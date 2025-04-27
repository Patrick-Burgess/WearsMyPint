import sys
import json
import itertools


# Pub nodes contain the lat and lng coordinates of the pub
# and the id of the pub
# Has a method to calculate the euclidean distance between two nodes

#
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


    # returns 
    route_ids = [pub.id for pub in shortestRoute]
    return { "route": route_ids }


def heldKarp(G, startIndex, goalIndex):
    n = len(G)
    g = dict()
    parent = dict()

    for k in range(1,n):
        g[(frozenset({k}),k)] = G[startIndex][k]
        parent[(frozenset({k}), k)] = startIndex

    arr = [i for i in range(n) if i not in (startIndex, goalIndex)]

    for s in range(2, n):
        subsets = list(itertools.combinations(arr, s))
        for S in subsets:
            for k in S:

                SWithoutk = frozenset(m for m in S if m != k)

                best_m = None
                min_distance = float('inf')
                for m in SWithoutk:
                    distance = g[(SWithoutk,m)] + G[m][k]
                    if distance < min_distance:
                        min_distance = distance
                        best_m = m

                g[(frozenset(S),k)] = min_distance
                parent[(frozenset(S), k)] = best_m


    fullSet = frozenset(arr)
    bestLastCity = None
    minDistance = float('inf')
    for k in arr:
        distance = g[(fullSet, k)] + G[k][goalIndex]
        if distance < minDistance:
            bestLastCity = k
            minDistance = distance

    route = [goalIndex, bestLastCity]
    curSet = fullSet
    k = bestLastCity

    while curSet:
        m = parent[(curSet, k)]
        route.append(m)
        curSet = curSet - {k}
        k = m


    route.reverse()

    opt = min(g[(frozenset(arr), k)] for k in arr)

    return (route, opt)


def getDistanceMatrix(pubData, startID, goalID):
    pubLocationData, startPubNode, goalPubNode = getPubCoords(pubData, startID, goalID)
    pubLocationData = [startPubNode] + pubLocationData + [goalPubNode]
    distanceMatrix = [[] for _ in range(len(pubLocationData))]
    for i in range(len(pubLocationData)):
        for j in range(len(pubLocationData)):
            distanceMatrix[i].append(pubLocationData[j].euclideanDistance(pubLocationData[i]))
    
    idDistanceMatrixMap = [x.id for x in pubLocationData]
    return (distanceMatrix, idDistanceMatrixMap)


pubs_data = [
    {
        "id": 1,
        "name": "Collingwood College Bar",
        "average_pint_price": 0,
        "location": "The Hill",
        "opening_hours": "11:00 AM - 11:00 PM",
        "description": "A family-friendly pub with a spacious beer garden.",
        "lat": 54.76275673931081,
        "lng": -1.5771552366439878,
        "onTap": ["The Stag"]
    },
    {
        "id": 2,
        "name": "Grey College Bar",
        "average_pint_price": 0,
        "location": "The Hill",
        "opening_hours": "11:00 AM - 11:00 PM",
        "description": "A modern pub with a wide range of craft beers and cocktails.",
        "lat": 54.764809855032034,
        "lng": -1.5754408714745514,
        "onTap": [
            "Appleshed",
            "Appleshed Dark Fruits",
            "Green Tiger",
            "Birra Murano",
            ""
        ]
    },
    {
        "id": 3,
        "name": "Hatfield College Bar",
        "average_pint_price": 0,
        "location": "The Bailey",
        "opening_hours": "10:00 AM - 11:30 PM",
        "description": "A vibrant pub with a riverside view, perfect for sunny afternoons.",
        "lat": 54.774764413264826,
        "lng": -1.5744648843028721,
        "onTap": ["Stella Artios"]
    },
    {
        "id": 4,
        "name": "Josephine Butler College Bar",
        "average_pint_price": 0,
        "location": "The Hill",
        "opening_hours": "10:00 AM - 11:30 PM",
        "description": "A vibrant pub with a riverside view, perfect for sunny afternoons.",
        "lat": 54.75976588780357,
        "lng": -1.5797947495180495,
        "onTap": [
            "Appleshed",
            "Appleshed Dark Fruits",
            "Green Tiger",
            "Birra Murano",
            ""
        ]
    },
    {
        "id": 5,
        "name": "John Snow College Bar / The Igloo",
        "average_pint_price": 0,
        "location": "The Hill",
        "opening_hours": "10:00 AM - 11:30 PM",
        "description": "A vibrant pub with a riverside view, perfect for sunny afternoons.",
        "lat": 54.76241051635582,
        "lng": -1.5850068715736967,
        "onTap": [
            "Appleshed",
            "Appleshed Dark Fruits",
            "Green Tiger",
            "Birra Murano",
            ""
        ]
    },
    {
        "id": 6,
        "name": "St Aidan's College Bar",
        "average_pint_price": 0,
        "location": "The Hill",
        "opening_hours": "10:00 AM - 11:30 PM",
        "description": "A vibrant pub with a riverside view, perfect for sunny afternoons.",
        "lat": 54.76517803458084,
        "lng": -1.584228543113528,
        "onTap": ["Green Badger"]
    }
]

"""
G, idDistanceMatrixMap = getDistanceMatrix(pubs_data, 1, 3)
heldKarpRoute, opt = heldKarp(G, 0, 5)
idRoute = []
for k in heldKarpRoute:
    idRoute.append(idDistanceMatrixMap[k])

res = bruteForce(pubs_data, 1, 3)

print('er')

"""
if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())

    pubData = input_data['pubData']   
    startID = int(input_data['startPubID'])
    goalID = int(input_data['endPubID'])

    #pubData = pubs_data
    #startID = 1
    #goalID = 6

    
    G, idDistanceMatrixMap = getDistanceMatrix(pubData, startID, goalID)
    heldKarpRoute, opt = heldKarp(G, 0, len(idDistanceMatrixMap)-1)
    idRoute = []
    for k in heldKarpRoute:
        idRoute.append(idDistanceMatrixMap[k])
    
    print(json.dumps({ "route": idRoute }))


