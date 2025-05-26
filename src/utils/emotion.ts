export async function detectEmotion(text: string): Promise<string> {
    try {
      const res = await fetch('http://localhost:5000/emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
  
      if (!res.ok) {
        console.error('Ошибка ответа от /emotion:', res.status)
        return 'neutral'
      }
  
      const data = await res.json()
      return data.emotion || 'neutral'
    } catch (err) {
      console.error('Ошибка при вызове detectEmotion:', err)
      return 'neutral'
    }
  }
  