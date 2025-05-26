<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
  type: String,
  result: String,
})

const voted = ref(false)
const voteResult = ref('')
const isAccessible = inject('isAccessible')

async function vote(voteType) {
  voted.value = true
  voteResult.value = voteType

  try {
    await fetch('http://localhost:4000/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: props.type,
        vote: voteType,
      }),
    })
  } catch (err) {
    console.error('Ошибка при голосовании:', err)
  }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-md space-y-4">
    <div v-if="type === 'text'" class="prose max-w-none dark:prose-invert">
      <p>{{ result }}</p>
    </div>

    <div v-else-if="type === 'image'" class="text-center">
      <img :src="result" alt="Сгенерированное изображение" class="rounded shadow mx-auto mb-4" />
    </div>

    <div v-else-if="type === 'music'" class="text-center mb-4">
      <audio :src="result" controls class="mx-auto mt-2" />
    </div>

    <div class="flex justify-center items-center gap-4 mt-4" v-if="!voted">
      <button
        @click="vote('like')"
        class="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-800 dark:text-white px-4 py-2 rounded"
      >
        👍 Нравится
      </button>
      <button
        @click="vote('dislike')"
        class="bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-800 dark:text-white px-4 py-2 rounded"
      >
        👎 Не нравится
      </button>
    </div>

    <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2" v-else>
      <span v-if="voteResult === 'like'">Спасибо за вашу оценку: 👍</span>
      <span v-else>Спасибо за вашу оценку: 👎</span>
    </div>

    <div class="mt-6 flex justify-center">
      <button
        @click="$emit('reset')"
        class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm px-4 py-2 rounded text-black dark:text-white"
      >
        Создать другой
      </button>
    </div>
  </div>
</template>
