let algorithm = '';
const nodes = {
    'Pakistan': {x: 100, y: 100},
    'India': {x: 200, y: 200},
    'China': {x: 300, y: 100},
    'Russia': {x: 400, y: 50},
    'Nepal': {x: 250, y: 250},
    'Bangladesh': {x: 300, y: 300},
    'Sri Lanka': {x: 200, y: 400},
    'Mongolia': {x: 450, y: 100},
    'Japan': {x: 600, y: 150},
    'South Korea': {x: 550, y: 200},
    'Thailand': {x: 450, y: 300},
    'Vietnam': {x: 500, y: 350},
    'Malaysia': {x: 400, y: 400},
    'Indonesia': {x: 350, y: 450},
    'Philippines': {x: 500, y: 450},
    'Singapore': {x: 350, y: 500},
    'Australia': {x: 300, y: 550},
    'New Zealand': {x: 250, y: 600},
    'Bhutan': {x: 350, y: 250},
    'Maldives': {x: 200, y: 500}
};

const graph = {
    'Pakistan': ['India', 'China'],
    'India': ['Nepal', 'Bangladesh', 'Sri Lanka'],
    'China': ['Russia', 'Mongolia'],
    'Russia': ['Japan'],
    'Nepal': ['Bhutan'],
    'Bangladesh': [],
    'Sri Lanka': ['Maldives'],
    'Mongolia': ['South Korea'],
    'Japan': ['South Korea'],
    'South Korea': ['Japan', 'China'],
    'Thailand': ['Vietnam'],
    'Vietnam': ['Malaysia'],
    'Malaysia': ['Indonesia'],
    'Indonesia': ['Philippines'],
    'Philippines': ['Singapore'],
    'Singapore': [],
    'Australia': ['New Zealand'],
    'New Zealand': [],
    'Bhutan': [],
    'Maldives': []
};

const costs = {
    'Pakistan': {'India': 2, 'China': 4},
    'India': {'Nepal': 3, 'Bangladesh': 5, 'Sri Lanka': 7},
    'China': {'Russia': 6, 'Mongolia': 8},
    'Russia': {'Japan': 10},
    'Nepal': {'Bhutan': 2},
    'Sri Lanka': {'Maldives': 1},
    'Mongolia': {'South Korea': 2},
    'Japan': {'South Korea': 3},
    'South Korea': {'Japan': 3, 'China': 2},
    'Thailand': {'Vietnam': 4},
    'Vietnam': {'Malaysia': 5},
    'Malaysia': {'Indonesia': 6},
    'Indonesia': {'Philippines': 7},
    'Philippines': {'Singapore': 8},
    'Australia': {'New Zealand': 9}
};

function setAlgorithm(algo) {
    algorithm = algo;
    alert(`Selected Algorithm: ${algorithm}`);
}

function drawGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let node in nodes) {
        const {x, y} = nodes[node];
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText(node, x - 10, y - 30);
    }

    for (let node in graph) {
        for (let neighbor of graph[node]) {
            const startX = nodes[node].x;
            const startY = nodes[node].y;
            const endX = nodes[neighbor].x;
            const endY = nodes[neighbor].y;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}

function startTraversal() {
    if (!algorithm) {
        alert('Please select an algorithm first!');
        return;
    }

    drawGraph();
    const start = 'Pakistan';
    const end = 'Maldives';

    if (algorithm === 'BFS') {
        bfs(graph, start, end);
    } else if (algorithm === 'DFS') {
        dfs(graph, start, end);
    } else if (algorithm === 'UCS') {
        ucs(graph, start, end);
    }
}

function bfs(graph, start, end) {
    let queue = [start];
    let visited = new Set();

    while (queue.length > 0) {
        let node = queue.shift();
        highlightNode(node);
        if (node === end) {
            alert(`Path found using BFS: ${node}`);
            return;
        }
        if (!visited.has(node)) {
            visited.add(node);
            queue = queue.concat(graph[node] || []);
        }
    }
    alert('No path found using BFS');
}

function dfs(graph, start, end) {
    let stack = [start];
    let visited = new Set();

    while (stack.length > 0) {
        let node = stack.pop();
        highlightNode(node);
        if (node === end) {
            alert(`Path found using DFS: ${node}`);
            return;
        }
        if (!visited.has(node)) {
            visited.add(node);
            stack = stack.concat(graph[node] || []);
        }
    }
    alert('No path found using DFS');
}

function ucs(graph, start, end) {
    let pq = new PriorityQueue();
    pq.enqueue([start, 0]);
    let costsToNode = {};
    costsToNode[start] = 0;
    let visited = new Set();

    while (!pq.isEmpty()) {
        let [node, cost] = pq.dequeue();
        highlightNode(node);
        if (node === end) {
            alert(`Path found using UCS: ${node}`);
            return;
        }
        if (!visited.has(node)) {
            visited.add(node);
            let neighbors = graph[node] || [];
            for (let neighbor of neighbors) {
                let newCost = cost + (costs[node][neighbor] || 0);
                if (!costsToNode[neighbor] || newCost < costsToNode[neighbor]) {
                    costsToNode[neighbor] = newCost;
                    pq.enqueue([neighbor, newCost]);
                }
            }
        }
    }
    alert('No path found using UCS');
}

class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element) {
        if (this.isEmpty()) {
            this.collection.push(element);
        } else {
            let added = false;
            for (let i = 0; i < this.collection.length; i++) {
                if (element[1] < this.collection[i][1]) { // checking the priority
                    this.collection.splice(i, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.collection.push(element);
            }
        }
    }

    dequeue() {
        return this.collection.shift();
    }

    isEmpty() {
        return this.collection.length === 0;
    }
}

function highlightNode(node) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const {x, y} = nodes[node];

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();
}

drawGraph();
