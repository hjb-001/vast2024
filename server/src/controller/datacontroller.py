
from fastapi import APIRouter,Request,Depends,Query
from service import dataService
from pydantic import BaseModel
from utils import message
import json
import networkx as nx
datacontroller = APIRouter()

class Item(BaseModel):  # 定义POST请求的模型
    id: int
    name: str

# 根据公司类型查询 
# not used for new
@datacontroller.api_route("/getCompanyLit",methods=["GET","POST"])
async def getID(company_id=Query(str)):
    print("company_id:",company_id)
    data  = read_mc3()
    set =[]
    for node in data.get("nodes"):
        if(node.get("type")=="Entity.Organization.Company"):
            set.append(node.get("id"))
    return message.success_message(set)

# 读取mc3.json数据
def read_mc3():
    with open('mc3.json','r',encoding='utf-8') as f:
        data = json.load(f)  #data是一个字典 {'nodes':[],'links':[]}
    # print(data.get("nodes")[0].get("type"))
    return data