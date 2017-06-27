'use strict';

const utils = {};
module.exports = utils;

// Simple wrapper function to filter out elements that start
// with any of the forbidden strings
//
// arr - input array
// forbidden - array of strings that are forbidden to appear
//             in the resulting array as a beginning of any element
//
// returns an array of strings
utils.filterKeys = (arr, forbidden) => (
  arr.filter(key => forbidden.every(el => !key.startsWith(el)))
);

// str - inputs string
// separator - string to use as a separator
// limit - resulting length of output array - 1 (last one is what's left),
//         if !limit === true => means no limit and split till no more
//         separators found
// leaveEmpty - if true multiple separators in sequence will be added as
//              empty string, else they are skipped
//
// returns an array of strings
//
// The behaviour is as follows:
//  splits 'str' till limit is bound or no more separators left in 'str'
//  if leaveEmpty is true then multiple separators in sequence are written in
//  resulting array as one empty string (''), else they are skipped
//  and doesn't get counted to limit
utils.split = (str, separator, limit, leaveEmpty) => {
  const result = [];
  let start = 0;

  const shouldPush = end =>
    start !== end || (leaveEmpty && result[result.length - 1] !== '');

  // eslint-disable-next-line no-unmodified-loop-condition
  while (!limit || result.length < limit) {
    const split = str.indexOf(separator, start);
    if (split === -1) break;
    if (shouldPush(split)) result.push(str.slice(start, split));
    start = split + separator.length;
  }
  if (shouldPush(str.length)) result.push(str.slice(start));
  return result;
};

utils.complete = (input, completions) => {
  if (!input) return completions;
  return completions.filter(c => c.startsWith(input));
};

utils.tryCompleter = (input, completer) => {
  const completions = completer.complete([input], 0)[0];
  if (completions.length === 1) return completions[0];
  return input;
};

// inputs - array of user inputs
// depth - level of nested completion (index in inputs array)
// completer - object that has '.complete(inputs, depth)'
//             function or '.help()' or neither
//             (no completions or help available).
//             To get next completer '.getNextCompleter(name)'
//             function is used, every completer that has
//             '.complete(inputs, depth)' function must also
//             have the aforementioned function.
utils.iterativeCompletion = (inputs, depth, completer) => {
  let help = '';
  let completions = [];
  let newDepth = depth;
  if (completer.complete) {
    do {
      depth = newDepth;
      [completions, newDepth] = completer.complete(inputs, newDepth);
      const nextCompleter = completer.getNextCompleter(completions[0]);
      if (completions.length === 1 && nextCompleter) {
        completer = nextCompleter;
      } else {
        break;
      }
    } while (newDepth < inputs.length && completer.complete);
  }
  // reset completions if we didn't reach last input because
  // they'll be not valid (those are completions for previous inputs)
  if (newDepth <= inputs.length - 1) completions = [];
  if (!completions[0] ||
      completions.length === 1 && completions[0] === inputs[depth]) {
    completions = [];
    if (completer.help) help = completer.help();
  }
  return [completions, help];
};
