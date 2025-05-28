<template>
  <form @submit.prevent="submitForm" class="space-y-4 max-w-xl mx-auto">
    <div class="relative">
      <textarea
        v-model="text"
        ref="textArea"
        rows="4"
        placeholder="Введите фрагмент дневника..."
        class="w-full p-4 pl-10 text-base border rounded-lg shadow-sm transition focus:outline-none"
        :class="{
          'border-red-500': showError && !text,
          'border-gray-300 dark:border-gray-600': !showError || text
        }"
      />
      <span class="absolute top-3 left-3 text-gray-400">✍️</span>
    </div>

    <div class="relative">
      <select
        v-model="selectedType"
        ref="typeSelect"
        class="w-full p-3 pl-10 text-base border rounded-lg shadow-sm transition focus:outline-none"
        :class="{
          'border-red-500': showError && !selectedType,
          'border-gray-300 dark:border-gray-600': !showError || selectedType
        }"
      >
        <option value="" disabled>Выберите тип генерации</option>
        <option value="text">Художественный текст</option>
        <option value="image">Изображение</option>
        <option value="music">Музыка</option>
      </select>
      <span class="absolute top-2.5 left-3 text-gray-400">🎯</span>
    </div>

    <div v-if="selectedType" class="text-sm text-gray-600 dark:text-gray-400">
      <p v-if="selectedType === 'text'">📝 Модель создаст расширенный художественный текст в духе дневника.</p>
      <p v-if="selectedType === 'image'">🖼️ Будет создано изображение на основе эмоций и описания.</p>
      <p v-if="selectedType === 'music'">🎵 Генерация музыкального фрагмента, отражающего настроение.</p>
    </div>

    <div v-if="detectedEmotion" class="text-sm text-blue-600 dark:text-blue-400">
      Определённая эмоция: <strong>{{ detectedEmotion }}</strong>
    </div>

    <button
      type="submit"
      class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ isLoading ? 'Анализ и генерация...' : 'Создать' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { detectEmotion } from '../src/utils/emotion'

const emit = defineEmits(['generate'])

const text = ref('')
const selectedType = ref('')
const detectedEmotion = ref('')
const isLoading = ref(false)
const showError = ref(false)

const textArea = ref<HTMLTextAreaElement | null>(null)
const typeSelect = ref<HTMLSelectElement | null>(null)

async function submitForm() {
  showError.value = false
  if (!text.value || !selectedType.value) {
    showError.value = true
    if (!text.value) textArea.value?.focus()
    else typeSelect.value?.focus()
    return
  }

  isLoading.value = true
  detectedEmotion.value = await detectEmotion(text.value)
  emit('generate', {
    text: text.value,
    type: selectedType.value,
  })
  isLoading.value = false
}
</script>
