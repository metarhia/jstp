#!/usr/bin/env node

'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

const commandName = path.relative('.', __filename);
const help = `\
This tool allows to filter the result of

  git cherry branch | grep '^\\+'

by parsing the PR metadata from commit messages, fetching semver-* labels
from GitHub and only leaving those commits that satisfy compatibility
requirements.  Then additional files that help you prepare a release are
automatically generated.

Usage:

  ${commandName} branch max-semver-level [--exclude=commit1,...]
    [--token=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX]

where:
 * 'branch' is the staging release branch name
 * 'max-semver-level' is one of:
     - patch
     - minor
     - major
 * 'token' is an access token.

Unlabeled PRs are treated as semver-patch.

Note: you should most probably run it from the master branch unless you exactly
know what you are doing.

If there are no errors, two files are generated:
 * '{branch}-apply-commits.sh' is a shell script that checks out the
   specified branch and cherry-picks the commits,
 * '{branch}-commits.md' is a markdown file that contains a list of
   commit messages, authors and PR URLs
`;

const branch = process.argv[2];
const maxLevel = process.argv[3];

if (!branch || !['patch', 'minor', 'major'].includes(maxLevel)) {
  console.error(help);
  process.exit(1);
}

let excludeCommits = [];
let token = null;
process.argv.forEach((arg) => {
  if (arg.startsWith('--exclude')) {
    const commits = arg.split('=')[1];
    const commitHashes = commits.split(',');
    excludeCommits = excludeCommits.concat(commitHashes);
  } else if (arg.startsWith('--token')) {
    token = arg.split('=')[1];
  }
});

getCommandOutput('git cherry ' + branch).then((cherryOut) => {
  const hashes = cherryOut
    .split('\n')
    .filter(line => line !== '' && line.startsWith('+'))
    .map(line => line.slice(2))
    .filter((hash) => {
      for (const excludedHash of excludeCommits) {
        if (hash.startsWith(excludedHash)) {
          return false;
        }
      }
      return true;
    });
  return Promise.all(hashes.map(getMetadata));
}).then(processCommits).catch((error) => {
  const message = error.stack || error.toString();
  console.error(message);
  process.exit(1);
});

function getCommandOutput(cmd) {
  const exec = promisify(childProcess.exec);
  return exec(cmd).then((stdout, stderr) => {
    if (stderr) console.error(stderr);
    return stdout;
  });
}

function getMetadata(commitHash) {
  const command = 'git log --format="%aN%n%B" -n 1 ' + commitHash;
  return getCommandOutput(command).then((output) => {
    const firstLfIndex = output.indexOf('\n');
    const secondLfIndex = output.indexOf('\n', firstLfIndex + 1);
    const author = output.slice(0, firstLfIndex);
    const message = output.slice(firstLfIndex + 1, secondLfIndex);

    const match = output.match(/^PR-URL: (.+)$/m);
    const prUrl = parsePrUrl(match && match[1]);
    const repo = prUrl && prUrl.repo;
    const pr = prUrl && prUrl.id;

    return getSemverTag(repo, pr).then((tag) => ({
      hash: commitHash,
      author,
      message,
      repo,
      pr,
      semver: tag
    }));
  });
}

function parsePrUrl(prUrl) {
  if (!prUrl) return null;
  const regex = /^https:\/\/github.com\/([\w-]+)\/([\w-]+)\/pull\/(\d+)\/?$/;
  const match = prUrl.match(regex);
  return match && {
    repo: match[1] + '/' + match[2],
    id: match[3]
  };
}

function getSemverTag(repo, id) {
  const host = 'api.github.com';
  const path = `/repos/${repo}/issues/${id}/labels`;
  return httpsGetJson({ host, path }).then((labels) => {
    const semverLabel = 'semver-';
    for (const label of labels) {
      if (label.name.startsWith(semverLabel)) {
        return label.name.slice(semverLabel.length);
      }
    }
    return 'patch';
  });
}

function httpsGetJson(options) {
  options = Object.assign({
    headers: { 'User-Agent': 'metarhia-jstp-release-tool' }
  }, options);
  if (token) {
    options.headers['Authorization'] = `token ${token}`;
  }

  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      getStreamData(res, (err, json) => {
        if (err) return reject(err);

        if (res.statusCode !== 200) {
          const url = `https://${options.host}${options.path}`;
          const message = `Request to ${url} failed with status code ` +
                          res.statusCode;
          return reject(`${message}\n${json}`);
        }

        const contentType = res.headers['content-type'];
        if (!contentType.startsWith('application/json')) {
          const error = new Error(`Invalid Content-Type: ${contentType}`);
          res.resume();
          return reject(error);
        }

        let object = null;
        try {
          object = JSON.parse(json);
        } catch (err) {
          return reject(err);
        }
        resolve(object);
      });
    }).on('error', error => reject(error));
  });
}

function getStreamData(stream, callback) {
  const chunks = [];
  stream.on('data', chunk => chunks.push(chunk));
  stream.on('end', () => {
    const data = Buffer.concat(chunks).toString();
    callback(null, data);
  });
  stream.on('error', callback);
}

function promisify(fn) {
  return (...args) => (
    new Promise((resolve, reject) => {
      fn(...args, (error, ...result) => {
        if (error) reject(error);
        else resolve(...result);
      });
    })
  );
}

function processCommits(commits) {
  commits = filterCommits(commits, maxLevel);

  let script = `git checkout ${branch}\ngit cherry-pick`;
  let changelog = '';

  for (const commit of commits) {
    let semverTag = '';
    if (commit.semver !== 'patch') {
      semverTag = ` **\\[semver-${commit.semver}\\]**`;
    }

    console.log(`${commit.hash} ${commit.message}${semverTag}`);
    script += ` \\\n  ${commit.hash}`;

    const colonPos = commit.message.indexOf(':');
    if (colonPos === -1) {
      continue;
    }

    const subsystem = commit.message.slice(0, colonPos + 1);
    const description = commit.message.slice(colonPos + 1);
    const message = `**${subsystem}**${description}`;

    const url = `https://github.com/${commit.repo}/pull/${commit.pr}`;
    const pr = `[#${commit.pr}](${url})`;
    changelog += ` * ${message}\n   (*${commit.author}*)\n   ` +
                 `${pr}${semverTag}\n`;
  }

  script += '\n';

  const writeFile = promisify(fs.writeFile);
  return Promise.all([
    writeFile(`${branch}-apply-commits.sh`, script),
    writeFile(`${branch}-commits.md`, changelog)
  ]);
}

function filterCommits(commits, semverMax) {
  const levels = {
    patch: 0,
    minor: 1,
    major: 2
  };
  return commits.filter(commit => levels[commit.semver] <= levels[semverMax]);
}
