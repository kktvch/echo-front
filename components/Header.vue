<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import AuthModal from '@/components/AuthModal.vue'
import ProModal from '@/components/ProModal.vue'
import { ref, inject, computed } from 'vue'

const auth = useAuthStore()
const showAuthModal = ref(false)
const showProModal = ref(false)

const toggleDark = inject('toggleDark')
const isDark = inject('isDark')
const toggleAccessibility = inject('toggleAccessibility')
const isAccessible = inject('isAccessible')

const user = computed(() => auth.user)
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-50 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-300 dark:border-gray-700">
    <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-4 py-3 gap-y-2">
      <!-- Логотип и название -->
      <div class="flex items-center gap-3">
        <img src="/icon/logo.svg" alt="Эхо фронта" class="h-6 w-6" />
        <span class="font-bold tracking-wide text-lg whitespace-nowrap">Эхо фронта</span>
      </div>

      <nav class="flex flex-wrap items-center gap-3 text-sm">
        <a href="#about" class="hover:underline">О проекте</a>

        <button @click="toggleDark" class="hover:opacity-75 transition" title="Темная тема">
          {{ isDark ? '🌙' : '🌞' }}
        </button>

        <button @click="toggleAccessibility" class="hover:opacity-75 transition" title="Режим для слабовидящих">
          {{ isAccessible ? '🦯' : '🧑' }}
        </button>

        <template v-if="user">
          <span class="text-sm text-gray-900 dark:text-white whitespace-nowrap">
            👤 {{ user.email }} — 
            <strong>{{ user.isPro ? 'Pro' : 'Стандарт' }}</strong>
            <span v-if="!user.isPro"> | Осталось: {{ auth.generationsLeft }}</span>
          </span>

          <button @click="auth.logout()" class="text-red-500 underline ml-1">Выйти</button>

          <button
            v-if="!user.isPro"
            @click="showProModal = true"
            class="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
          >
            Купить Pro
          </button>
        </template>

        <template v-else>
          <button
            @click="showAuthModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Войти / Зарегистрироваться
          </button>
        </template>
      </nav>
    </div>

    <AuthModal :show="showAuthModal" @close="showAuthModal = false" />
    <ProModal v-if="showProModal" @close="showProModal = false" />
  </header>
</template>
