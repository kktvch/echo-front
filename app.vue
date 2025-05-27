<script setup lang="ts">
import { ref, reactive, provide, onMounted, watch, readonly } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import InputForm from '@/components/InputForm.vue'
import ResultCard from '@/components/ResultCard.vue'
import AuthModal from '@/components/AuthModal.vue'
import { useAuthStore } from '@/stores/auth'
import { handleGenerate } from '../src/utils/ai'
import { detectEmotion } from '../src/utils/emotion'


const result = ref(null)
const selectedType = ref('')
const latestText = ref('')
const isLoading = ref(false)
const capsules = ref([])
const myCapsules = ref([])
const showCapsules = ref(false)
const selectedCapsule = ref(null)
const isEditing = ref(false)

const isDark = ref(false)
const isAccessible = ref(false)
const showFeedback = ref(false)
const feedbackText = ref('')

const auth = useAuthStore()
const user = computed(() => auth.user)

function reset() {
  result.value = null
  selectedType.value = ''
  latestText.value = ''
}

async function handleGenerateEvent({ type, text }) {
  selectedType.value = type
  latestText.value = text
  isLoading.value = true

  try {
    const emotion = await detectEmotion(text)
    result.value = await handleGenerate(type, text, emotion)
    auth.useGeneration()
  } catch (error) {
    console.error('Ошибка генерации:', error)
  } finally {
    isLoading.value = false
  }
}

function saveCapsule() {
  const capsule = {
    title: latestText.value.slice(0, 30) + (latestText.value.length > 30 ? '...' : ''),
    timestamp: new Date().toLocaleString(),
    type: selectedType.value,
    raw: latestText.value,
    user: user.value?.name || null,
  }
  if (user.value) myCapsules.value.unshift(capsule)
  capsules.value.unshift(capsule)
  fetch('http://localhost:4000/capsule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(capsule),
  }).catch(err => {
    console.error('Ошибка при сохранении капсулы:', err)
  })
}

async function fetchCapsules() {
  const res = await fetch('http://localhost:4000/capsule')
  if (res.ok) {
    const data = await res.json()
    capsules.value = data
    if (user.value) {
      myCapsules.value = data.filter(c => c.user === user.value.name)
    }
  }
}

function openCapsule(capsule) {
  selectedCapsule.value = { ...capsule, index: capsules.value.indexOf(capsule) }
}

function deleteCapsule() {
  if (selectedCapsule.value) {
    capsules.value.splice(selectedCapsule.value.index, 1)
    selectedCapsule.value = null
  }
}

function editCapsule() {
  if (selectedCapsule.value) {
    latestText.value = selectedCapsule.value.raw
    selectedType.value = selectedCapsule.value.type
    result.value = selectedCapsule.value.raw
    selectedCapsule.value = null
  }
}

function submitFeedback() {
  console.log('Обратная связь:', feedbackText.value)
  feedbackText.value = ''
  showFeedback.value = false
  alert('Спасибо за отзыв!')
}

onMounted(() => {
  auth.fetchUser()
  fetchCapsules()
  const html = document.documentElement
  const savedTheme = localStorage.getItem('theme')
  const savedA11y = localStorage.getItem('accessibility')
  isDark.value = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  isAccessible.value = savedA11y === 'true'
  html.classList.toggle('dark', isDark.value)
  html.classList.toggle('accessible', isAccessible.value)
  watch(isDark, () => {
  const html = document.documentElement
  html.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})
})

provide('toggleDark', () => (isDark.value = !isDark.value))
provide('isDark', readonly(isDark))
provide('toggleAccessibility', () => (isAccessible.value = !isAccessible.value))
provide('isAccessible', readonly(isAccessible))
</script>


<template>
  <div :class="[
    'min-h-screen',
    `bg-[url('/textures/war-map.jpg')]`,
    'bg-cover',
    'bg-fixed',
    'text-gray-900',
    { 'dark:bg-gray-900 dark:text-gray-100': isDark, 'text-xl leading-relaxed': isAccessible }
  ]">
    <Header />
    <main class="max-w-4xl mx-auto p-28 px-6">
      <section class="text-center mb-8 animate-fade-in">
        <h1 class="text-5xl font-military text-military tracking-wider uppercase mb-2">Эхо фронта</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Оживи память войны: текст, образ, музыка</p>
      </section>

      <InputForm @generate="handleGenerateEvent" />

      <div class="mt-8">
        <Transition name="fade">
          <ResultCard
            v-if="result"
            :type="selectedType"
            :result="result"
            @reset="reset"
          />
        </Transition>
      </div>

      <div v-if="result" class="mt-4 flex justify-center">
        <button
          v-if="user"
          @click="saveCapsule"
          class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded shadow animate-fade-in"
        >
          💾 Сохранить в капсулу
        </button>
        <p v-else class="text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
          🔐 Для создания капсулы войдите в систему
        </p>
      </div>

      <section class="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center animate-fade-in">
        <p>
          Проект создан с уважением к памяти участников Великой Отечественной войны. Результаты являются художественной интерпретацией.
        </p>
      </section>
    </main>
    <Footer />

    <Teleport to="body">
      <div class="fixed bottom-6 right-6 z-50">
        <button
          @mouseenter="showFeedback = true"
          @mouseleave="showFeedback = false"
          class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg animate-pulse hover:animate-none"
        >
          💬
        </button>

        <Transition name="fade-slide">
          <div v-if="showFeedback">
            <div
              class="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded shadow-lg"
              @mouseenter="showFeedback = true"
              @mouseleave="showFeedback = false"
            >
              <h3 class="font-semibold mb-2">Обратная связь</h3>
              <textarea
                v-model="feedbackText"
                rows="4"
                placeholder="Ваше сообщение..."
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              ></textarea>
              <button @click="submitFeedback" class="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                Отправить
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  will-change: opacity, transform;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
