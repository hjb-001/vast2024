## This a main enter point of the application

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel # 数据验证
from controller.datacontroller import datacontroller

app = FastAPI()

# CORS middleware
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# route
@app.get("/index")
def index():
    return {
        "msg": "vast challenge 2024",
        "success": 200
    }

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str=None):
#     return {"item_id": item_id, "q": q}

@app.post("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}

# 注册路由
app.include_router(datacontroller,prefix='/api') # 注册数据控制器路由


if __name__ == '__main__':
    # import os
    # print(os.getcwd())
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5555, log_level="info",reload=True)