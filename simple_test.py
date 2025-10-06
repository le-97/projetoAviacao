"""
Teste ultra-simples para verificar se FastAPI funciona
"""
from fastapi import FastAPI

app = FastAPI(title="Test MVP")

@app.get("/")
def read_root():
    return {"message": "Hello Aviation Compliance MVP!", "status": "working"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/test/e175/usa")
def test_compliance():
    return {
        "aircraft": "E175",
        "country": "USA", 
        "compliant": True,
        "message": "Test passed!"
    }