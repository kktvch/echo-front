from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from transformers import MarianMTModel, MarianTokenizer
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



mt_tokenizer = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-ru-en")
mt_model = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-ru-en")

em_tokenizer = AutoTokenizer.from_pretrained("j-hartmann/emotion-english-distilroberta-base")
em_model = AutoModelForSequenceClassification.from_pretrained("j-hartmann/emotion-english-distilroberta-base")
classifier = pipeline("text-classification", model=em_model, tokenizer=em_tokenizer, return_all_scores=False)

class EmotionRequest(BaseModel):
    text: str

@app.post("/emotion")
def analyze_emotion(req: EmotionRequest):
    # Перевод текста
    translated = mt_model.generate(**mt_tokenizer(req.text, return_tensors="pt", padding=True))
    eng_text = mt_tokenizer.decode(translated[0], skip_special_tokens=True)

    # Предсказание эмоции
    result = classifier(eng_text)[0]
    return {"emotion": result["label"]}


class PromptRequest(BaseModel):
    prompt: str

@app.post("/gpt")
async def generate_text(req: PromptRequest):
    # TODO: Подключить модель или проксировать к OpenAI
    return {"result": f"{req.prompt}"}

@app.post("/sd")
async def generate_image(req: PromptRequest):
    # TODO: Генерация изображения (можно подставить static URL)
    return {"url": "/placeholders/frontline_1.jpg"}

@app.post("/music")
async def generate_music(req: PromptRequest):
    # TODO: Подключение к MusicGen или возвращение заранее сгенерированного файла
    return {"audioUrl": "/placeholders/melody_1.mp3"}
