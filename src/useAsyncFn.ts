import { reactive, ref, WatchSource, watch, watchEffect } from 'vue';
import useMountedData from './useMountedData';

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

export type AsyncFn<Result = any, Args extends any[] = any[]> = [
  AsyncState<Result>,
  (...args: Args | []) => Promise<Result>
];

export default function useAsyncFn<Result extends any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result>,
  source: WatchSource<any>,
  initialState: AsyncState<Result> = { loading: false }
): AsyncFn<Result, Args> {
  const lastCallId = ref(0);
  const state = reactive<AsyncState<Result>>(initialState);

  const isMounted = useMountedData();

  const callback = (...args: Args | []) => {
    const callId = ++lastCallId.value;
    state.loading = true

    return fn(...args).then(
      value => {
        if (isMounted() && callId === lastCallId.value) {
          state.loading = false
          state.value = value
        }

        return value;
      },
      error => {
        if (isMounted() && callId === lastCallId.value) {
          state.error = error
          state.loading = false
        }

        return error;
      }
    );
  };



  return [state, callback];
}