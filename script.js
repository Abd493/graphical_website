let selectedAlgorithm = '';
const locations = {
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

const routes = {
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

const travelCosts = {
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


function selectAlgorithm(algo) {
    selectedAlgorithm = algo;
    alert(`Selected Algorithm: ${selectedAlgorithm}`);
}


function renderGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let location in locations) {
        const {x, y} = locations[location];
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText(location, x - 10, y - 30);
    }

    for (let location in routes) {
        for (let neighbor of routes[location]) {
            const startX = locations[location].x;
            const startY = locations[location].y;
            const endX = locations[neighbor].x;
            const endY = locations[neighbor].y;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}

function initiateTraversal() {
    if (!selectedAlgorithm) {
        alert('Please select an algorithm first!');
        return;
    }

    renderGraph();
    const start = 'Pakistan';
    const destination = 'Maldives';

    if (selectedAlgorithm === 'BFS') {
        breadthFirstSearch(routes, start, destination);
    } else if (selectedAlgorithm === 'DFS') {
        depthFirstSearch(routes, start, destination);
    } else if (selectedAlgorithm === 'UCS') {
        uniformCostSearch(routes, start, destination);
    }
}


function breadthFirstSearch(routes, start, end) {
    let queue = [start];
    let visited = new Set();

    while (queue.length > 0) {
        let location = queue.shift();
        highlightLocation(location);
        if (location === end) {
            alert(`Path found using BFS: ${location}`);
            return;
        }
        if (!visited.has(location)) {
            visited.add(location);
            queue = queue.concat(routes[location] || []);
        }
    }
    alert('No path found using BFS');
}


function depthFirstSearch(routes, start, end) {
    let stack = [start];
    let visited = new Set();

    while (stack.length > 0) {
        let location = stack.pop();
        highlightLocation(location);
        if (location === end) {
            alert(`Path found using DFS: ${location}`);
            return;
        }
        if (!visited.has(location)) {
            visited.add(location);
            stack = stack.concat(routes[location] || []);
        }
    }
    alert('No path found using DFS');
}


function uniformCostSearch(routes, start, end) {
    let pq = new PriorityQueue();
    pq.enqueue([start, 0]);
    let costsToLocation = {};
    costsToLocation[start] = 0;
    let visited = new Set();

    while (!pq.isEmpty()) {
        let [location, cost] = pq.dequeue();
        highlightLocation(location);
        if (location === end) {
            alert(`Path found using UCS: ${location}`);
            return;
        }
        if (!visited.has(location)) {
            visited.add(location);
            let neighbors = routes[location] || [];
            for (let neighbor of neighbors) {
                let newCost = cost + (travelCosts[location][neighbor] || 0);
                if (!costsToLocation[neighbor] || newCost < costsToLocation[neighbor]) {
                    costsToLocation[neighbor] = newCost;
                    pq.enqueue([neighbor, newCost]);
                }
            }
        }
    }
    alert('No path found using UCS');
}


class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
        if (this.isEmpty()) {
            this.queue.push(item);
        } else {
            let added = false;
            for (let i = 0; i < this.queue.length; i++) {
                if (item[1] < this.queue[i][1]) {
                    this.queue.splice(i, 0, item);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.queue.push(item);
            }
        }
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

function highlightLocation(location) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const {x, y} = locations[location];

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();
}

renderGraph();
