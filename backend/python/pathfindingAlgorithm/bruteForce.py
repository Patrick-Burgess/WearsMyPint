import sys
import json
import itertools


# Pub nodes contain the lat and lng coordinates of the pub
# and the id of the pub
# Has a method to calculate the euclidean distance between two nodes
class PubNode:
    def __init__(self, id, lat, lng):
        self.id = id
        self.lat = lat
        self.lng = lng

    def __str__(self):
        return f"PubNode(id={self.id}, lat={self.lat}, lng={self.lng})"

    def __repr__(self):
        return self.__str__()
    
    def euclideanDistance(self, other):
        return ((self.lat - other.lat) ** 2 + (self.lng - other.lng) ** 2) ** 0.5
    

def parseJSON(jsonData):
    # implement error handling
    data = json.loads(jsonData)
    return data

# Returns an array of PubNode objects, not including the start and goal nodes
# Also returns the start and goal nodes as separate objects
def getPubCoords(pubData, startID, goalID):
    pubLocationData = []
    for dic in pubData:
        if startID == dic['id']:
            startPubNode = PubNode(dic['id'], dic['lat'], dic['lng'])
        elif goalID == dic['id']:
            goalPubNode = PubNode(dic['id'], dic['lat'], dic['lng'])
        else:
            pubLocationData.append(PubNode(dic['id'], dic['lat'], dic['lng']))


    return (pubLocationData, startPubNode, goalPubNode)


def bruteForce(pubData, startID, goalID):
    # Calculates the total distance of a path given an array of PubNode objects
    def calculatePathDistance(path):
        totalDistance = 0
        for i in range(len(path) - 1):
            totalDistance += path[i].euclideanDistance(path[i + 1])
        return totalDistance
    
    # Iteratew over all permutations of the pubLocationData
    # Fids the shortest path by calculating the distance of each permutation
    # Shortest distance is not really useful at the moment 
    def findShortestRoute(pubLocationData, startPubNode, goalPubNode):
        shortestDistance = float('inf')
        shortestRoute = []
        allPermutations = itertools.permutations(pubLocationData)
        for perm in allPermutations:
            path = [startPubNode] + list(perm) + [goalPubNode]
            totalDistance = calculatePathDistance(path)
            if totalDistance < shortestDistance:
                shortestDistance = totalDistance
                shortestRoute = path
        return shortestRoute, shortestDistance
    
    pubLocationData, startPubNode, goalPubNode = getPubCoords(pubData, startID, goalID)
    shortestRoute, shortestDistance = findShortestRoute(pubLocationData, startPubNode, goalPubNode)

    route_ids = [pub.id for pub in shortestRoute]
    return { "route": route_ids }



if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())

    pubData = input_data['pubData']   
    startID = int(input_data['startPubID'])
    goalID = int(input_data['endPubID'])

    result = bruteForce(pubData, startID, goalID)
    print(json.dumps(result))

