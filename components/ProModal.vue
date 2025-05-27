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
  <Teleport to="body">
    <div
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      @click.self="$emit('close')"
    >
      <div
        class="relative z-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-xl shadow-xl w-[90%] max-w-md"
      >
        <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-2xl text-gray-500 hover:text-red-400"
          aria-label="Закрыть"
        >
          &times;
        </button>

        <h2 class="text-2xl font-bold text-center mb-4">Преимущества Pro</h2>
        <ul class="text-sm text-left list-disc list-inside space-y-2">
          <li>Безлимитные генерации</li>
          <li>Доступ к режиму <strong>«Душевный дневник»</strong></li>
          <li>Приоритет в очереди</li>
        </ul>

        <button
          class="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
          @click="$emit('close')"
        >
          🚀 Купить Pro
        </button>
      </div>
    </div>
  </Teleport>
</template>

