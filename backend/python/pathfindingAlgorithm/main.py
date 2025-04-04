import json
from backend.python.pathfindingAlgorithm.bruteForce import AStar

def pathfind(data):
    AStar(data)

with open('testData.json') as f:
    jsonData = f.read()
    data = json.loads(jsonData)
    pathfind(data)
    