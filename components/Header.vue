<script setup>
import { useAuthStore } from '@/stores/auth'
import AuthModal from '@/components/AuthModal.vue'
import ProModal from '@/components/ProModal.vue'
import { ref, inject, computed } from 'vue'

const auth = useAuthStore()
const showAuthModal = ref(false)
const showProModal = ref(false)

const generationsLeft = computed(() => auth.generationsLeft)

const toggleDark = inject('toggleDark')
const isDark = inject('isDark')
const toggleAccessibility = inject('toggleAccessibility')
const isAccessible = inject('isAccessible')
</script>

<template>
  <header class="flex justify-between items-center px-4 py-3 shadow bg-white dark:bg-gray-800 dark:text-white">
    <h1 class="text-lg font-bold">Эхо фронта</h1>
    <nav class="flex items-center gap-4 text-sm">
      <a href="#about" class="hover:underline">О проекте</a>

      <button
        @click="toggleDark"
        class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      >
        {{ isDark ? '🌙 Тёмная' : '🌞 Светлая' }}
      </button>

      <button
        @click="toggleAccessibility"
        class="px-3 py-1 rounded bg-yellow-100 dark:bg-yellow-600 text-yellow-800 dark:text-white"
      >
        {{ isAccessible ? '🦯 Крупный текст' : '🧑 Обычный' }}
      </button>

      <template v-if="auth.user">
        <span class="text-sm text-gray-900 dark:text-white">
          👤 {{ auth.user.email }} —
          <strong>{{ auth.user.isPro ? 'Pro' : 'Стандарт' }}<span v-if="!auth.user.isPro"> ({{ generationsLeft }})</span></strong>
          <span v-if="!auth.user.isPro"> | Осталось: {{ generationsLeft.value }}</span>
        </span>
        <button @click="auth.logout()" class="text-red-500 underline ml-1">Выйти</button>
        <button
          v-if="!auth.user.isPro"
          @click="showProModal = true"
          class="text-sm bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
        >
          Купить Pro
        </button>
      </template>

      <template v-else>
        <button
          @click="showAuthModal = true"
          class="text-white bg-blue-600 px-4 py-2 rounded"
        >
          Войти / Зарегистрироваться
        </button>
      </template>
    </nav>

    <AuthModal :show="showAuthModal" @close="showAuthModal = false" />
    <ProModal v-if="showProModal" @close="showProModal = false" />
  </header>
</template>