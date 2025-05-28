from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer

model_name = "sberbank-ai/rugpt3large_based_on_gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
text_pipeline = pipeline("text-generation", model=model, tokenizer=tokenizer)

@app.post("/generate-text")
async def generate_text(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    emotion = data.get("emotion", "")
    
    context_prompt = (
        f"Контекст: {prompt}\n"
        f"Эмоция: {emotion}\n"
        "Сформулируй художественный рассказ от лица участника Великой Отечественной войны, "
        "сохраняя историческую правдоподобность и глубину переживаний.\n"
    )

    result = text_pipeline(context_prompt, max_length=300, do_sample=True, top_p=0.95)[0]["generated_text"]
    return {"result": result}
