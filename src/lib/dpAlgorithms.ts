// DP visualization types
export interface DPStep {
  table: number[][];
  currentCell: { row: number; col: number } | null;
  highlightCells: { row: number; col: number }[];
  message: string;
  result?: number;
}

export interface FibStep {
  values: Map<number, number>;
  currentN: number;
  computing: number[];
  callStack: number[];
  message: string;
  result?: number;
}

// Fibonacci with Memoization
export function* fibonacciDP(n: number): Generator<FibStep> {
  const memo = new Map<number, number>();
  const callStack: number[] = [];
  
  yield {
    values: new Map(),
    currentN: n,
    computing: [],
    callStack: [n],
    message: `Computing Fibonacci(${n})`,
  };

  function* fib(num: number): Generator<FibStep, number> {
    callStack.push(num);
    
    if (num <= 1) {
      memo.set(num, num);
      yield {
        values: new Map(memo),
        currentN: num,
        computing: [],
        callStack: [...callStack],
        message: `Base case: F(${num}) = ${num}`,
      };
      callStack.pop();
      return num;
    }

    if (memo.has(num)) {
      const val = memo.get(num)!;
      yield {
        values: new Map(memo),
        currentN: num,
        computing: [],
        callStack: [...callStack],
        message: `Found in memo: F(${num}) = ${val}`,
      };
      callStack.pop();
      return val;
    }

    yield {
      values: new Map(memo),
      currentN: num,
      computing: [num - 1, num - 2],
      callStack: [...callStack],
      message: `Computing F(${num}) = F(${num - 1}) + F(${num - 2})`,
    };

    const left = yield* fib(num - 1);
    const right = yield* fib(num - 2);
    const result = left + right;
    memo.set(num, result);

    yield {
      values: new Map(memo),
      currentN: num,
      computing: [],
      callStack: [...callStack],
      message: `F(${num}) = ${left} + ${right} = ${result}`,
    };

    callStack.pop();
    return result;
  }

  const result = yield* fib(n);

  yield {
    values: new Map(memo),
    currentN: n,
    computing: [],
    callStack: [],
    message: `Fibonacci(${n}) = ${result}`,
    result,
  };
}

// 0/1 Knapsack Problem
export function* knapsackDP(weights: number[], values: number[], capacity: number): Generator<DPStep> {
  const n = weights.length;
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  yield {
    table: dp.map(row => [...row]),
    currentCell: null,
    highlightCells: [],
    message: `Knapsack: ${n} items, capacity ${capacity}. Initialize table with zeros.`,
  };

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      yield {
        table: dp.map(row => [...row]),
        currentCell: { row: i, col: w },
        highlightCells: [],
        message: `Checking item ${i} (weight: ${weights[i - 1]}, value: ${values[i - 1]}) with capacity ${w}`,
      };

      if (weights[i - 1] <= w) {
        const includeItem = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const excludeItem = dp[i - 1][w];
        
        yield {
          table: dp.map(row => [...row]),
          currentCell: { row: i, col: w },
          highlightCells: [
            { row: i - 1, col: w },
            { row: i - 1, col: w - weights[i - 1] }
          ],
          message: `Include: ${values[i - 1]} + dp[${i - 1}][${w - weights[i - 1]}] = ${includeItem}, Exclude: ${excludeItem}`,
        };

        dp[i][w] = Math.max(includeItem, excludeItem);
      } else {
        dp[i][w] = dp[i - 1][w];
        
        yield {
          table: dp.map(row => [...row]),
          currentCell: { row: i, col: w },
          highlightCells: [{ row: i - 1, col: w }],
          message: `Item too heavy (${weights[i - 1]} > ${w}), taking previous value: ${dp[i - 1][w]}`,
        };
      }
    }
  }

  yield {
    table: dp.map(row => [...row]),
    currentCell: null,
    highlightCells: [{ row: n, col: capacity }],
    message: `Maximum value achievable: ${dp[n][capacity]}`,
    result: dp[n][capacity],
  };
}

// Longest Common Subsequence
export function* lcsDP(str1: string, str2: string): Generator<DPStep> {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  yield {
    table: dp.map(row => [...row]),
    currentCell: null,
    highlightCells: [],
    message: `LCS of "${str1}" and "${str2}". Initialize table.`,
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      yield {
        table: dp.map(row => [...row]),
        currentCell: { row: i, col: j },
        highlightCells: [],
        message: `Comparing '${str1[i - 1]}' with '${str2[j - 1]}'`,
      };

      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        
        yield {
          table: dp.map(row => [...row]),
          currentCell: { row: i, col: j },
          highlightCells: [{ row: i - 1, col: j - 1 }],
          message: `Match! '${str1[i - 1]}' = '${str2[j - 1]}'. LCS length = ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}`,
        };
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        
        yield {
          table: dp.map(row => [...row]),
          currentCell: { row: i, col: j },
          highlightCells: [{ row: i - 1, col: j }, { row: i, col: j - 1 }],
          message: `No match. Taking max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
        };
      }
    }
  }

  // Backtrack to find LCS string
  let lcs = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs = str1[i - 1] + lcs;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  yield {
    table: dp.map(row => [...row]),
    currentCell: null,
    highlightCells: [{ row: m, col: n }],
    message: `LCS length: ${dp[m][n]}, LCS: "${lcs}"`,
    result: dp[m][n],
  };
}
