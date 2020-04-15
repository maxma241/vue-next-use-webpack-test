import { watchEffect, watch, WatchSource } from 'vue'
import useTimeoutFn from './useTimeoutFn';

export type UseDebounceReturn = [() => boolean | null, () => void];

export default function useDebounce<T extends any>(fn: Function, ms: number = 0, source: WatchSource<T>): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  watch(source, reset, { flush: 'sync' });

  return [isReady, cancel];
}