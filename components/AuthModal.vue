<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

const email = ref('')
const password = ref('')
const name = ref('')
const isRegister = ref(false)

const auth = useAuthStore()

const submit = async () => {
  try {
    if (isRegister.value) {
      await auth.register(name.value, email.value, password.value)
    } else {
      await auth.login(email.value, password.value)
    }
    emit('close')
  } catch (err) {
    alert('Ошибка: ' + err.message)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-zoom">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          class="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 relative"
          @click.stop
        >
          <button
            class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            @click="emit('close')"
            aria-label="Закрыть"
          >
            ✕
          </button>

          <h2 class="text-xl font-semibold mb-4 text-center">
            {{ isRegister ? 'Регистрация' : 'Вход' }}
          </h2>

          <form @submit.prevent="submit" class="space-y-4">
            <input
              v-if="isRegister"
              v-model="name"
              type="text"
              placeholder="Ваше имя"
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
            />
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
            />
            <input
              v-model="password"
              type="password"
              placeholder="Пароль"
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
            />
            <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded">
              {{ isRegister ? 'Зарегистрироваться' : 'Войти' }}
            </button>
          </form>

          <p class="text-sm mt-4 text-gray-500 dark:text-gray-400 text-center">
            {{ isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?' }}
            <button
              @click="isRegister = !isRegister"
              class="text-blue-600 hover:underline ml-1"
            >
              {{ isRegister ? 'Войти' : 'Зарегистрироваться' }}
            </button>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}
.fade-zoom-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
