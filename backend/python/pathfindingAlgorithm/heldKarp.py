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


# G is distance matrix (incidence matrix), startIndex of the distance matrix, goalIndex of the distance matrix (i.e. not the ID's)
def heldKarp(G, startIndex, goalIndex):
    n = len(G)
    g = dict()
    parent = dict()

    # Populate dict with singleton subsets
    for k in range(1,n):
        g[(frozenset({k}),k)] = G[startIndex][k] 
        parent[(frozenset({k}), k)] = startIndex # Used for finding route

    # All indexes excluding start + end
    arr = [i for i in range(n) if i not in (startIndex, goalIndex)]

    # Loop over all sizes of subsets starting from size 2
    for s in range(2, n):
        # Make all possible comination of index possibilities (may be room for optimisation here as distance matrix is symmetrical)
        subsets = list(itertools.combinations(arr, s))
        for S in subsets:
            # Loop over each city k and pick it as the last city
            for k in S:

                SWithoutk = frozenset(m for m in S if m != k)

                best_m = None
                min_distance = float('inf')
                # Minimise the distance of the cities in the subset to the last city
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
        # Find the min distance INCLUDING getting to the goal index
        distance = g[(fullSet, k)] + G[k][goalIndex]
        if distance < minDistance:
            bestLastCity = k
            minDistance = distance

    # Initlialised like this as reversed later on
    route = [goalIndex, bestLastCity]
    curSet = fullSet
    k = bestLastCity

    # Find route via backtracking
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
            # Uses euclideanDistance, but there is generally enoguh spatial difference between locations that it is a good heuristic
            distanceMatrix[i].append(pubLocationData[j].euclideanDistance(pubLocationData[i]))
    
    idDistanceMatrixMap = [x.id for x in pubLocationData]
    return (distanceMatrix, idDistanceMatrixMap)



if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())

    pubData = input_data['pubData']   
    startID = int(input_data['startPubID'])
    goalID = int(input_data['endPubID'])

    # Do not actually need idDistanceMatrixMap, but it works for now
    G, idDistanceMatrixMap = getDistanceMatrix(pubData, startID, goalID)
    heldKarpRoute, opt = heldKarp(G, 0, len(idDistanceMatrixMap)-1)
    idRoute = []
    for k in heldKarpRoute:
        idRoute.append(idDistanceMatrixMap[k])
    
    print(json.dumps({ "route": idRoute }))


