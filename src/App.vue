<template>
<div>
  <img src="./logo.png">
  <h1>Hello Vue 3!</h1>
  <h3>count: {{ count }}</h3>
  <h3>debounceCount: {{ debounceCount }}</h3>
  <button @click="inc">Clicked {{ count }} times.</button>
  <div>
    <input type="text" v-model="searchText" />
    <h3>searchText: {{ searchText }}</h3>
    <h3>debounceSearchText: {{ debounceSearchText }}</h3>
    <pre>{{ fetchCtx }}</pre>
    <!-- <button @click="fetch">fetch echo</button> -->
  </div>
</div>
</template>

<script>
import { ref, watchEffect } from 'vue'
import useDebounce from './useDebounce'
import useAsync from './useAsync'

export default {
  setup() {
    const debounceCount = ref(0)
    const searchText = ref('')
    const debounceSearchText = ref('')
    const count = ref(0)
    const inc = () => {
      count.value++
    }

    useDebounce(() => {
      debounceCount.value = count.value
      console.log(count.value, debounceCount.value)
    }, 1000, count)

    useDebounce(() => {
      debounceSearchText.value = searchText.value
    }, 1000, searchText)

    const fetchCtx = useAsync(async () => {

      return new Promise(r => {
        setTimeout(() => {
          r(debounceSearchText.value)
        }, 1000)
      })
    }, debounceSearchText)

    

    return {
      count,
      inc,
      debounceCount,
      searchText,
      debounceSearchText,
      fetchCtx
    }
  }
}
</script>

<style scoped>
img {
  width: 200px;
}
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
