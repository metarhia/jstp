'use strict';

const mean = sample => {
  const len = sample.length;
  if (len === 0)
    return;
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += sample[i];
  }
  return sum / len;
};

const stdev = (sample, meanValue) => {
  const len = sample.length;
  if (len === 0)
    return;
  if (len === 1)
    return 0;
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += Math.pow(sample[i] - meanValue, 2);
  }
  const variance = sum / len;
  return Math.sqrt(variance);
};

const combineCount = samples => {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i].count;
  }
  return sum;
};

const combineMean = (samples, count) => {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    sum += sample.mean * sample.count;
  }
  return sum / count;
};

const combineStdev = (samples, mean, count) => {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    sum += sample.count * Math.pow(sample.stdev, 2) +
           sample.count * Math.pow(sample.mean - mean, 2);
  }
  return Math.sqrt(sum / count);
};

const combineSamples = samples => {
  const len = samples.length;
  if (len === 0)
    return;
  if (len === 1) {
    return samples[0];
  }
  const count = combineCount(samples);
  const mean  = combineMean(samples, count);
  const stdev = combineStdev(samples, mean, count);
  return { count, mean, stdev };
};

module.exports = {
  mean,
  stdev,
  combineCount,
  combineMean,
  combineStdev,
  combineSamples,
};
