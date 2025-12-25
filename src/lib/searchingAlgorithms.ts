export type SearchStep = {
  array: number[];
  current: number;
  left?: number;
  right?: number;
  found: boolean;
  checked: number[];
};

export function* linearSearch(arr: number[], target: number): Generator<SearchStep> {
  const checked: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    yield {
      array: arr,
      current: i,
      found: false,
      checked: [...checked],
    };

    checked.push(i);

    if (arr[i] === target) {
      yield {
        array: arr,
        current: i,
        found: true,
        checked: [...checked],
      };
      return;
    }
  }

  yield {
    array: arr,
    current: -1,
    found: false,
    checked: [...checked],
  };
}

export function* binarySearch(arr: number[], target: number): Generator<SearchStep> {
  const sortedArr = [...arr].sort((a, b) => a - b);
  let left = 0;
  let right = sortedArr.length - 1;
  const checked: number[] = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    yield {
      array: sortedArr,
      current: mid,
      left,
      right,
      found: false,
      checked: [...checked],
    };

    checked.push(mid);

    if (sortedArr[mid] === target) {
      yield {
        array: sortedArr,
        current: mid,
        left,
        right,
        found: true,
        checked: [...checked],
      };
      return;
    }

    if (sortedArr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  yield {
    array: sortedArr,
    current: -1,
    left,
    right,
    found: false,
    checked: [...checked],
  };
}
