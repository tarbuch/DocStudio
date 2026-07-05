// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DebouncedFunction<T extends (...args: any[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

/**
 * A robust debounce utility function with cancel and flush support.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the original function with .cancel() and .flush() methods
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): DebouncedFunction<T> => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
    lastArgs = null
  }

  const flush = () => {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
      if (lastArgs) {
        func(...lastArgs)
        lastArgs = null
      }
    }
  }

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      timeout = null
      func(...args)
      lastArgs = null
    }, wait)
  }

  debounced.cancel = cancel
  debounced.flush = flush

  return debounced
}
