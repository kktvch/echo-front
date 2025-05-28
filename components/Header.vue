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
  <header class="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
      <!-- Лого и название -->
      <div class="flex items-center gap-2">
        <img src="/icon/logo.svg" alt="Логотип" class="h-6 w-6" />
        <h1 class="text-lg font-semibold tracking-wide">Эхо фронта</h1>
      </div>

      <!-- Навигация и управление -->
      <nav class="flex items-center gap-3 text-sm">
        <a href="#about" class="hover:underline">О проекте</a>

        <button @click="toggleDark" class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs">
          {{ isDark ? '🌙' : '☀️' }}
        </button>

        <button @click="toggleAccessibility" class="px-2 py-1 rounded bg-yellow-300 dark:bg-yellow-600 text-xs">
          {{ isAccessible ? '🦯' : '🔤' }}
        </button>

        <template v-if="auth.user">
          <span class="text-gray-700 dark:text-gray-200">
            👤 {{ auth.user.email }} — <strong>{{ auth.user.isPro ? 'Pro' : 'Стандарт' }}</strong>
            <span v-if="!auth.user.isPro" class="text-xs text-gray-400 ml-1">(Осталось: {{ generationsLeft }})</span>
          </span>
          <button @click="auth.logout()" class="text-red-500 underline text-xs">Выйти</button>
          <button
            v-if="!auth.user.isPro"
            @click="showProModal = true"
            class="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded text-xs"
          >
            Купить Pro
          </button>
        </template>

        <template v-else>
          <button
            @click="showAuthModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
          >
            Войти
          </button>
        </template>
      </nav>
    </div>

    <AuthModal :show="showAuthModal" @close="showAuthModal = false" />
    <ProModal v-if="showProModal" @close="showProModal = false" />
  </header>
</template>
