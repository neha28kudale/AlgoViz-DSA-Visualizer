export type SortingStep = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number;
};

export function* bubbleSort(arr: number[]): Generator<SortingStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...array], comparing: [j, j + 1], swapping: [], sorted: [...sorted] };

      if (array[j] > array[j + 1]) {
        yield { array: [...array], comparing: [], swapping: [j, j + 1], sorted: [...sorted] };
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
    sorted.unshift(n - 1 - i);
  }
  sorted.unshift(0);

  yield { array: [...array], comparing: [], swapping: [], sorted: [...sorted] };
}

export function* selectionSort(arr: number[]): Generator<SortingStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      yield { array: [...array], comparing: [minIdx, j], swapping: [], sorted: [...sorted] };

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      yield { array: [...array], comparing: [], swapping: [i, minIdx], sorted: [...sorted] };
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
    }
    sorted.push(i);
  }
  sorted.push(n - 1);

  yield { array: [...array], comparing: [], swapping: [], sorted: [...sorted] };
}

export function* insertionSort(arr: number[]): Generator<SortingStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [0];

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0) {
      yield { array: [...array], comparing: [j - 1, j], swapping: [], sorted: [...sorted] };

      if (array[j - 1] > array[j]) {
        yield { array: [...array], comparing: [], swapping: [j - 1, j], sorted: [...sorted] };
        [array[j - 1], array[j]] = [array[j], array[j - 1]];
        j--;
      } else {
        break;
      }
    }
    sorted.push(i);
  }

  yield { array: [...array], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i) };
}

export function* quickSort(arr: number[], low = 0, high = arr.length - 1, sorted: number[] = []): Generator<SortingStep> {
  const array = arr;

  if (low < high) {
    let pivotIdx = low;
    const pivot = array[high];

    yield { array: [...array], comparing: [], swapping: [], sorted: [...sorted], pivot: high };

    for (let i = low; i < high; i++) {
      yield { array: [...array], comparing: [i, high], swapping: [], sorted: [...sorted], pivot: high };

      if (array[i] < pivot) {
        if (i !== pivotIdx) {
          yield { array: [...array], comparing: [], swapping: [i, pivotIdx], sorted: [...sorted], pivot: high };
          [array[i], array[pivotIdx]] = [array[pivotIdx], array[i]];
        }
        pivotIdx++;
      }
    }

    yield { array: [...array], comparing: [], swapping: [pivotIdx, high], sorted: [...sorted], pivot: high };
    [array[pivotIdx], array[high]] = [array[high], array[pivotIdx]];
    sorted.push(pivotIdx);

    yield* quickSort(array, low, pivotIdx - 1, sorted);
    yield* quickSort(array, pivotIdx + 1, high, sorted);
  } else if (low === high) {
    sorted.push(low);
  }

  if (low === 0 && high === arr.length - 1) {
    yield { array: [...array], comparing: [], swapping: [], sorted: Array.from({ length: arr.length }, (_, i) => i) };
  }
}

export function* mergeSort(arr: number[], start = 0, end = arr.length - 1, sorted: number[] = []): Generator<SortingStep> {
  const array = arr;

  if (start < end) {
    const mid = Math.floor((start + end) / 2);

    yield* mergeSort(array, start, mid, sorted);
    yield* mergeSort(array, mid + 1, end, sorted);

    // Merge
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      yield { array: [...array], comparing: [start + i, mid + 1 + j], swapping: [], sorted: [...sorted] };

      if (left[i] <= right[j]) {
        array[k] = left[i];
        i++;
      } else {
        array[k] = right[j];
        j++;
      }
      k++;
    }

    while (i < left.length) {
      array[k] = left[i];
      i++;
      k++;
    }

    while (j < right.length) {
      array[k] = right[j];
      j++;
      k++;
    }

    yield { array: [...array], comparing: [], swapping: [], sorted: [...sorted] };
  }

  if (start === 0 && end === arr.length - 1) {
    yield { array: [...array], comparing: [], swapping: [], sorted: Array.from({ length: arr.length }, (_, i) => i) };
  }
}

export function* heapSort(arr: number[]): Generator<SortingStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  function* heapify(size: number, root: number): Generator<SortingStep> {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      yield { array: [...array], comparing: [largest, left], swapping: [], sorted: [...sorted] };
      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      yield { array: [...array], comparing: [largest, right], swapping: [], sorted: [...sorted] };
      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      yield { array: [...array], comparing: [], swapping: [root, largest], sorted: [...sorted] };
      [array[root], array[largest]] = [array[largest], array[root]];
      yield* heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    yield { array: [...array], comparing: [], swapping: [0, i], sorted: [...sorted] };
    [array[0], array[i]] = [array[i], array[0]];
    sorted.unshift(i);
    yield* heapify(i, 0);
  }
  sorted.unshift(0);

  yield { array: [...array], comparing: [], swapping: [], sorted: [...sorted] };
}
