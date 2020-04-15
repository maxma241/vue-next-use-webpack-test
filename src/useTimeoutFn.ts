import { watchEffect, ref } from 'vue';

export type UseTimeoutFnReturn = [() => boolean | null, () => void, () => void];

export default function useTimeoutFn(fn: Function, ms: number = 0): UseTimeoutFnReturn {
  const ready = ref<boolean | null>(false);
  const timeout = ref<ReturnType<typeof setTimeout>>();
  const callback = ref(fn);

  const isReady = () => ready.value;

  const set = () => {
    ready.value = false;
    timeout.value && clearTimeout(timeout.value);

    timeout.value = setTimeout(() => {
      ready.value = true;
      callback.value();
    }, ms);
  }
 

  const clear = () => {
    ready.value = null;
    timeout.value && clearTimeout(timeout.value);
  }

  // update ref when function changes
  watchEffect(() => {
    callback.value = fn;
  }, { flush: 'sync' });

  // set on mount, clear on unmount
  watchEffect(cb => {
    set();

    cb(clear);
  }, { flush: 'sync' });

  return [isReady, clear, set];
}