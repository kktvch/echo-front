export async function handleGenerate(type: string, prompt: string, emotion?: string): Promise<string> {
  const fullPrompt = emotion ? `[${emotion}] ${prompt}` : prompt
  if (type === 'text') return await generateText(fullPrompt, emotion)
  if (type === 'image') return await generateImage(fullPrompt, emotion)
  if (type === 'music') return await generateMusic(fullPrompt, emotion)
  return ''
}

export async function generateText(prompt: string, emotion?: string): Promise<string> {
  const res = await fetch('http://localhost:5000/gpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, emotion }),
  })
  if (!res.ok) throw new Error('Ошибка генерации текста')
  const { result } = await res.json()
  return result
}

export async function generateImage(prompt: string, emotion?: string): Promise<string> {
  const res = await fetch('http://localhost:5000/sd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, emotion }),
  })
  if (!res.ok) throw new Error('Ошибка генерации изображения')
  const { url } = await res.json()
  return url
}

export async function generateMusic(prompt: string, emotion?: string): Promise<string> {
  const res = await fetch('http://localhost:5000/music', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, emotion }),
  })
  if (!res.ok) throw new Error('Ошибка генерации музыки')
  const { audioUrl } = await res.json()
  return audioUrl
}
