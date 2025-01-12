function sum_to_n_a(n: number): number {
  // Time Complexity: O(n)- Loop run n times
  // Space Complexity: O(1)- Constant space because only use fixed amount of memory
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function sum_to_n_b(n: number): number {
  // Time Complexity: O(n)- Linear time so the time taken to run increases linearly with the input
  // Space Complexity: O(n)- Linear space so the space taken to run increases linearly with the input
  return n === 1 ? 1 : n + sum_to_n_b(n - 1);
}

function sum_to_n_c(n: number): number {
  // Time Complexity: O(1)- Constant time so always takes the same amount of time to run
  // Space Complexity: O(1)- Constant space so always takes the same amount of space to run
  return (n * (n + 1)) / 2;
}
