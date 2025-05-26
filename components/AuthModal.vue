
<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['auth-success', 'close'])
const props = defineProps<{ show: boolean }>()

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const name = ref('')
const error = ref('')
const isRegister = ref(false)
const isOpen = ref(false)

watch(() => props.show, (val) => {
  isOpen.value = val
})

function closeModal() {
  isOpen.value = false
  error.value = ''
  emit('close')
}

async function submit() {
  error.value = ''
  try {
    if (isRegister.value) {
      const res = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
      })
      if (!res.ok) throw new Error(await res.text())
    }

    await auth.login(email.value, password.value)
    closeModal()
    emit('auth-success')
  } catch (e: any) {
    error.value = e.message || 'Ошибка'
  }
}
</script>

<template>
  <div>
    <div
      v-show="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>

        <h2 class="text-2xl font-bold mb-4">
          {{ isRegister ? 'Регистрация' : 'Вход' }}
        </h2>

        <div v-if="isRegister" class="mb-2">
          <input v-model="name" type="text" placeholder="Имя" class="w-full p-2 border rounded" />
        </div>

        <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" />
        <input v-model="password" type="password" placeholder="Пароль" class="w-full p-2 border rounded mb-4" />

        <button @click="submit" class="bg-military text-white px-4 py-2 rounded w-full mb-2">
          {{ isRegister ? 'Зарегистрироваться' : 'Войти' }}
        </button>

        <p class="text-red-500 text-sm" v-if="error">{{ error }}</p>

        <p class="text-center text-sm text-gray-600">
          <span v-if="isRegister">Уже есть аккаунт?</span>
          <span v-else>Нет аккаунта?</span>
          <button @click="isRegister = !isRegister" class="text-blue-500 underline ml-1">
            {{ isRegister ? 'Войти' : 'Зарегистрироваться' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
body.modal-open {
  overflow: hidden;
}
</style>
