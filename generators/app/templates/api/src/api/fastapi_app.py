"""FastAPI API with CORS middleware. See https://fastapi.tiangolo.com/tutorial/cors/."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Warning: these CORS are very permissive.
