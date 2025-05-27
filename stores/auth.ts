import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as null | {
      name: string
      email: string
      isPro: boolean
    },
    generationsLeft: 5,
  }),
  persist: true,
  actions: {
    async login(email: string, password: string) {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error(await res.text())

      await this.fetchUser()
    },

    async fetchUser() {
      const res = await fetch('http://localhost:4000/me', {
        credentials: 'include',
      })
    
      if (res.ok) {
        const user = await res.json()
        this.user = user
        this.token = 'set'
    
        if (
          this.generationsLeft === 5 ||
          this.generationsLeft === 0 ||
          typeof this.generationsLeft !== 'number'
        ) {
          this.generationsLeft = user.isPro ? Infinity : 5
        }
      } else {
        this.user = null
        this.token = null
        this.generationsLeft = 5
      }
    },

    async register(name: string, email: string, password: string) {
      const res = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) throw new Error(await res.text())
    
      await this.fetchUser()
    },
    

    async logout() {
      await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include',
      })
      this.user = null
      this.token = null
      this.generationsLeft = 5
    },

    useGeneration() {
      if (!this.user?.isPro && this.generationsLeft > 0) {
        this.generationsLeft--
      }
    },

    upgradeToPro() {
      if (this.user) {
        this.user.isPro = true
        this.generationsLeft = Infinity
      }
    },
  },
})
