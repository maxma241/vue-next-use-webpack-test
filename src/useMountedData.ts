import { watchEffect, ref } from 'vue';

export default function useMountedState(): () => boolean {
  const mountedRef = ref<boolean>(false);
  const get = () => mountedRef.value;

  watchEffect(cb => {
    mountedRef.value = true;

    cb(() => {
      mountedRef.value = false;
    });
  });

  return get;
}