<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const selectedType = ref('')
const error = ref('')
const emit = defineEmits(['generate'])

const types = [
  { value: 'text', label: 'Текст' },
  { value: 'image', label: 'Изображение' },
  { value: 'music', label: 'Музыка' },
]

async function submitForm() {
  error.value = ''
  if (!text.value || !selectedType.value) {
    error.value = 'Заполните все поля'
    return
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)) // имитация генерации

  emit('generate', {
    text: text.value,
    type: selectedType.value,
  })

  text.value = ''
  selectedType.value = ''
}
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <textarea
      v-model="text"
      placeholder="Фрагмент дневника"
      class="w-full p-3 border rounded"
    ></textarea>

    <select v-model="selectedType" class="w-full p-2 border rounded">
      <option disabled value="">Выберите тип</option>
      <option v-for="t in types" :key="t.value" :value="t.value">
        {{ t.label }}
      </option>
    </select>

    <button type="submit" class="bg-military text-white px-4 py-2 rounded">
      Создать
    </button>

    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </form>
</template>
