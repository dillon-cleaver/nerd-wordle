/**
 * Creates an array of integers starting at `start` and incrementing by `step`
 * until (but excluding) `end`. If only one value is provided, it is treated as
 * the exclusive end bound and the range begins at 0.
 *
 * @param {number} start - Beginning of the range, or exclusive end when `end` is omitted.
 * @param {number} [end] - Exclusive upper bound; defaults to `start` when omitted.
 * @param {number} [step=1] - Amount to increment by on each iteration.
 * @returns {number[]} Array containing each integer in the generated sequence.
 */
export const range = (start: number, end: number, step = 1) => {
  let output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};
