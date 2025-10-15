/**
 * Dataset type definition:
 * - short 1-word title (string).
 * - an array of labels (strings, 1-3 characters each).
 * - an array of values (numbers, 0-100).
 * - The labels and values arrays are of equal length
 *   (1 to 8 elements).
 */
export type Dataset = {
  // Short dataset title (assume 1-word) 
  title: string;
  // Array of labels (1-3 chars)
  labels: string[];
  // Array of values (0-100)
  values: number[];
};

/**
 * Sample datasets for testing A1 Canvas
 */
export const datasets: Dataset[] = [
  {
    title: "Simple",
    labels: ["A", "B", "C", "D", "E"],
    values: [90, 70, 50, 30, 10],
  },
  {
    title: "Single",
    labels: ["FOO"],
    values: [50],
  },
  {
    title: "Same",
    labels: ["X", "Y", "Z", "AA", "BB", "CC"],
    values: [50, 50, 50, 50, 50, 50],
  },
  {
    title: "Octet",
    labels: ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP"],
    values: [12, 34, 56, 78, 90, 21, 43, 65],
  },
  {
    title: "Pair",
    labels: ["Q", "RS"],
    values: [7, 88],
  },
  {
    title: "Trio",
    labels: ["X", "YZ", "QRS"],
    values: [23, 67, 45],
  },
  {
    title: "Quad",
    labels: ["A", "BC", "DEF", "G"],
    values: [10, 99, 54, 32],
  },
  {
    title: "Five",
    labels: ["HIJ", "K", "LM", "N", "OPQ"],
    values: [11, 22, 33, 44, 55],
  },
  {
    title: "Hex",
    labels: ["R", "ST", "UVW", "X", "YZ", "ZA"],
    values: [66, 77, 88, 99, 12, 23],
  },
  {
    title: "Sept",
    labels: ["B", "CD", "EFG", "H", "IJ", "KLM", "N"],
    values: [34, 45, 56, 67, 78, 89, 90],
  },
];