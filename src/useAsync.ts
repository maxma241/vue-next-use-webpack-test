import { watch, WatchSource } from 'vue';
import useAsyncFn from './useAsyncFn';


export default function useAsync<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result>,
  source: WatchSource
) {
  const [state, callback] = useAsyncFn<Result, Args>(fn, source, {
    loading: true,
  });

  watch(source, () => {
    callback();
  }, { immediate: true });

  return state;
}