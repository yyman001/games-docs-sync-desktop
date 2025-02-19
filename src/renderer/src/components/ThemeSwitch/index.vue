<template>
  <button
    class="inline-flex relative items-center w-11 h-6 rounded-full border-2 border-gray-200 transition-all duration-300 ease-in-out bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-accent dark:border-gray-700"
    @click="toggleDark()"
  >
    <span
      class="inline-block w-5 h-5 bg-white rounded-full ring-0 shadow-lg transition-all duration-300 ease-in-out transform pointer-events-none dark:translate-x-5 dark:bg-accent"
    >
      <Sun class="absolute w-3 h-3 opacity-0 transition-all duration-300 ease-in-out translate-x-1 translate-y-1 dark:opacity-100 dark:text-white" />
      <Moon class="absolute w-3 h-3 text-black transition-all duration-300 ease-in-out translate-x-1 translate-y-1 dark:opacity-0" />
    </span>
    <span class="sr-only">切换主题</span>
  </button>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'

defineComponent({
  name: 'ThemeSwitch'
})

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
