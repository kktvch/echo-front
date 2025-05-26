<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const auth = useAuthStore()

const isOpen = ref(true)

function upgrade() {
  auth.upgradeToPro()
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 relative">
      <button @click="emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>
      <h2 class="text-2xl font-bold mb-4">Перейти на Pro</h2>
      <p class="mb-4">С Pro-аккаунтом вы получаете неограниченное количество генераций и доступ к режиму "Душевный дневник".</p>
      <button @click="upgrade" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded w-full">Купить Pro</button>
    </div>
  </div>
</template>
