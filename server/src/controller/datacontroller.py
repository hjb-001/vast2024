
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

G = nx.MultiGraph()
nodes = []
nodesList = []
links = []

#初始化多维无向图
def initAdjacentList():
    print("initAdjacentList")
    jsonItem = read_mc3()
    for i in range(len(jsonItem['nodes'])):
        nodesList.append(jsonItem['nodes'][i]['id'])
        nodes.append(i)
    for i in range(len(jsonItem['links'])):
        item = jsonItem['links'][i]
        num1 = nodesList.index(item['source'])
        num2 = nodesList.index(item['target'])
        links.append((num1, num2, i))

    G.add_nodes_from(nodes)

    for u, v, edge_id in links:
        G.add_edge(u, v, id=edge_id)



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


#根据给定id返回所有相关联结点和边
@datacontroller.api_route("/findRelation/{item_id}")
async def findRelation(item_id : str):
    if item_id not in nodesList:
        return message.false_message("No such item!")
    idx = nodesList.index(item_id)
    jsonItem = read_mc3()
    def findAllRelation(idx,relationNodes = set([]),relationEdges = set([])):
        for neighbor in G.neighbors(idx):
            edges = G.get_edge_data(idx,neighbor)
            for key, edge_data in edges.items():
                if edge_data['id'] not in relationEdges:
                    relationNodes.add(neighbor)
                    relationNodes.add(idx)
                    relationEdges.add(edge_data['id'])
                    findAllRelation(neighbor, relationNodes, relationEdges)
        return relationNodes,relationEdges
    idx = nodesList.index(item_id)
    associated_nodes, associated_edges = findAllRelation(idx)
    kdList = {
        'nodes' : [],
        'links' : [],
    }
    for node in associated_nodes:
        if jsonItem['nodes'][node]['type'].split('.')[1] == 'Person':
            item = {
                'type' : jsonItem['nodes'][node]['type'],
                'id' : jsonItem['nodes'][node]['id'],
                'group' : 1
            } 
        else:
            item = {
                'type' : jsonItem['nodes'][node]['type'],
                'ProductServices' : jsonItem['nodes'][node]['ProductServices'],
                'founding_date' : jsonItem['nodes'][node]['founding_date'],
                'revenue' : jsonItem['nodes'][node]['revenue'],
                'id' : jsonItem['nodes'][node]['id'],
                'group' : 0
            }
        jsonItem['nodes'][node]

        item['group'] = 1 if item['type'].split('.')[1] == 'Person' else 0
        kdList['nodes'].append(item)
    for link in associated_edges:
        item = {
            'type' : jsonItem['links'][link]['type'],
            'source' : jsonItem['links'][link]['source'],
            'target' : jsonItem['links'][link]['target'],
        }
        if 'end_date' in jsonItem['links'][link]:
            item['end_date'] = jsonItem['links'][link]['end_date']
        else:
            item['end_date'] = 'null'
        if 'start_date' in jsonItem['links'][link]:
            item['start_date'] = jsonItem['links'][link]['start_date']
        else:
            item['start_date'] = 'null'
        kdList['links'].append(item)
    b = json.dumps(kdList)
    return message.success_message(kdList)

# 读取mc3.json数据
def read_mc3():
    with open('../mc3.json','r',encoding='utf-8') as f:
        data = json.load(f)  #data是一个字典 {'nodes':[],'links':[]}
    return data

#初始化多维无向图
initAdjacentList()