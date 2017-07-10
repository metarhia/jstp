'use strict';

const mean = (sample) => {
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

module.exports = { mean, stdev };
