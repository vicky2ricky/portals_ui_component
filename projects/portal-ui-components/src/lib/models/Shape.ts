import { DropPoint } from './DropPoint';

export class Shape {
  startPoint: DropPoint;
  dropPoints: Array<DropPoint>;
  adjList: any; // This will be a Map

  public id;
  public group;
  public type;

  public roomId;
  public coloringData;
  public ccuId;
  public ccuName;
  public colorData;
  public roomName;

  // type -  would hold circle / regular
  constructor(id: string, type: string, group: any, roomId: string, roomName: string) {
    this.id = id;
    this.type = type;
    this.group = group;
    this.roomId = roomId;
    this.roomName = roomName;

    this.adjList = new Map();
    this.dropPoints = [];
    this.ccuId = '';
    this.ccuName = '';
  }


  addVertex(v: DropPoint, initial = false) {
    // initialize the adjacent list with a null array
    this.adjList.set(v.id, []);

    if (initial) {
      this.startPoint = JSON.parse(JSON.stringify(v));
      this.dropPoints.push(v);
    }
  }


  addEdge(sourcePoint: DropPoint, destPoint: DropPoint) {
    // get the list for vertex sourcePoint and put the vertex destPoint denoting edge between sourcePoint and destPoint
    this.adjList.get(sourcePoint.id).push(destPoint.id);

    // Since graph is undirected, add an edge from destPoint to sourcePoint also
    if (this.adjList.has(destPoint.id)) {
      this.adjList.get(destPoint.id).push(sourcePoint.id);
    } else {
      this.adjList.set(destPoint.id, [sourcePoint.id]);
    }

    const pointExist = this.dropPoints.find(dropPoint => dropPoint.id === destPoint.id);
    if (!pointExist) {
      this.dropPoints.push(destPoint);
    }

    // this.printShapeList();
  }


  addMidvertex(startPoint, endPoint, pointToAdd) {
    const indexOfStartPoint = this.dropPoints.findIndex(dropPoint => dropPoint.id === startPoint.id);
    this.dropPoints.splice(indexOfStartPoint + 1, 0, pointToAdd);

    // Also change the adjancency list for the start & endPoints
    const affectedVertices = [startPoint.id, endPoint.id];
    // So for each of the vertice, in the adjList, we remove this pointId and add the other one.
    // These are all ids
    affectedVertices.forEach((vertexId, index)  => {
      const currentVertices = this.adjList.get(vertexId);
      currentVertices.splice(
        currentVertices.indexOf(index === 0 ? affectedVertices[1] : affectedVertices[0]), 1, pointToAdd.id);
      this.adjList.set(vertexId, currentVertices);
    });

    this.adjList.set(pointToAdd.id, [startPoint.id, endPoint.id]);
  }


  removeVertices(pointIds) {
    for (const pointId of pointIds) {
      this.dropPoints = this.dropPoints.filter(dropPoint => dropPoint.id !== pointId);

      // What if i just removed the startPoint
      if (pointId === this.startPoint.id && this.dropPoints.length > 0) {
        // then the first point which now exists in the list is the startPoint.
        this.startPoint = JSON.parse(JSON.stringify(this.dropPoints[0]));
      }
      this.removeEdge(pointId);
    }
  }


  removeEdge(pointId) {
    // affectedVertices are the points which are the neighbours for this point.
    const affectedVertices = this.adjList.get(pointId);

    // So for each of the vertice, in the adjList, we remove this pointId and add the other one.
    if (affectedVertices.length === 2) {
      // These are all ids
      affectedVertices.forEach((vertexId, index)  => {
        const currentVertices = this.adjList.get(vertexId);
        currentVertices.splice(currentVertices.indexOf(pointId), 1, index === 0 ? affectedVertices[1] : affectedVertices[0]);
        this.adjList.set(vertexId, currentVertices);
      });

      this.adjList.delete(pointId);
    }

    this.printShapeList();
  }


  getFreePoint() {
    return this.dropPoints[this.dropPoints.length - 1];
  }

  getStartPoint() {
    return this.startPoint;
  }

  editDropPoint(id, x, y) {
    this.dropPoints = this.dropPoints.map(dropPoint => dropPoint.id !== id ? dropPoint : {id, x, y});
    if (this.startPoint.id === id) {
      this.startPoint.x = x;
      this.startPoint.y = y;
    }
  }


  translatePoints(x, y) {
    this.dropPoints = this.dropPoints.map(dropPoint => {
      dropPoint.x += parseFloat(x);
      dropPoint.y += parseFloat(y);
      return dropPoint;
    });
    this.startPoint.x += parseFloat(x);
    this.startPoint.y += parseFloat(y);
  }


  getNeighboringPoints(vertexId) {
    const currentVertices = this.adjList.get(vertexId);
    return this.dropPoints.filter(dropPoint => currentVertices.includes(dropPoint.id));
  }


  printShapeList() {
    // get all the vertices
    // console.log('-------Shape List Start--------');
    for (const key of this.adjList.keys()) {
      const assocValues = this.adjList.get(key);
      console.log(key + ' -> ' + assocValues.join(' '));
    }
    // console.log('--------Shape List End---------');
  }
}
