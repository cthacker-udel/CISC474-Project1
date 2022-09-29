//#region Constants

// Array of moving car coordinates
let movingCars = [];

// Array of moving log coordinates
let movingLogs = [];

/**
 * Constants to avoid repeated code
 */
const CONSTANTS = {
    /**
     * Important coordinates, frog startx and starty
     */
    IMPORTANT_COORDS: {
        START_X: 12,
        START_Y: 24,
    },
    /**
     * Measurements for consistency, coord height, width, and the # of columns and rows
     */
    MEASUREMENTS: {
        COORD_WIDTH: "4vw",
        COORD_HEIGHT: "4vh",
        NUM_COLUMNS: 25,
        NUM_ROWS: 25,
    },
    /**
     * The ids of the elements in the DOM
     */
    OBJECTS: {
        FROG_ID: "frog",
        LOG_ID: "log",
        // car type and direction it's traveling in
        CAR_ID: {
            YELLOW_LEFT: "yellow-left",
            PURPLE_LEFT: "purple-left",
            WHITE_RIGHT: "white-right",
            SEMI_LEFT: "semi-left",
        },
    },
    /**
     * The indexes of the rows, specifically where objects will be spawned to then animate to the other side of the screen
     */
    ROW_VALUES: {
        ROADS: [1, 2, 3, 4, 15, 16, 17, 18, 20, 21, 22, 23],
        WATER: [7, 8, 9, 10, 11],
    },
    /**
     * The ids of the rows
     */
    ROWS: {
        ROAD: "road-row",
        END: "end-row",
        LILYPAD: "lilypad-row",
        LOG: "log-row",
        BOARDWALK: "boardwalk-row",
        WATER: "water-row",
        START: "start-row",
    },
};

/**
 * The ids for each row, organized into an array
 */
const rowIds = [
    CONSTANTS.ROWS.WATER,
    CONSTANTS.ROWS.ROAD,
    CONSTANTS.ROWS.BOARDWALK,
    CONSTANTS.ROWS.GRASS,
];

//#endregion

//#region Helpers

/**
 * Takes in a percent, and returns the numerical value of that percentage of the vh
 *
 * @param {number} percent - The percent of vh we want to return
 * @returns The vh amount, so 50vh will return the number equivalent of 50vh
 */
const vh = (percent) => {
    const h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
    );
    return (percent * h) / 100;
};

/**
 * Takes in a percent, and returns the numerical value of that percentage of vw
 *
 * @param {number} percent - The percent of vw we want to return
 * @returns The vw amount, so 50vw will return the number equivalent of 50vw
 */
const vw = (percent) => {
    const w = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
    );
    return (percent * w) / 100;
};

/**
 * Generates a random int between min and max
 *
 * @param {number} min - The min range for the random int, inclusive
 * @param {number} max - The max range for the random int, exclusive
 * @returns - Random integer between min and max
 */
const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

//#endregion

//#region Create Functions

/**
 * Creates a coordinate element with the specified i and j
 *
 * @param {number} i - The y coordinate
 * @param {number} j - The x coordinate
 * @returns
 */
const createCoord = (i, j) => {
    const coord = document.createElement("div");
    coord.style.height = CONSTANTS.MEASUREMENTS.COORD_HEIGHT;
    coord.style.width = CONSTANTS.MEASUREMENTS.COORD_WIDTH;
    coord.className = `x-${j} y-${i}`;
    coord.style.position = "relative";
    coord.setAttribute("coord", `${i},${j}`);
    coord.id = `${j}-${i}`;
    return coord;
};

/**
 * Creates a frog element, and positions it at the beginning of the row
 *
 * @returns Frog element
 */
const createFrog = () => {
    const frog = document.createElement("img");
    frog.setAttribute("src", "images/frog.png");
    frog.id = CONSTANTS.OBJECTS.FROG_ID;
    frog.style.height = "3.9vh";
    frog.style.width = "3vw";
    frog.style.position = "relative";
    frog.setAttribute("onLog", false);
    return frog;
};

//#endregion

//#region Functions

/**
 * Adds a car to the random row, and appends it's coordinates to the movingCars array to then be moved
 *
 * @param {number} timestamp - For utility if it needs to be utilized, passed from the requestAnimationFrame function represents the time this function was called
 */
const addCar = (timestamp) => {
    const left = getRandomInt(0, 2);
    const y = CONSTANTS.ROW_VALUES.ROADS[getRandomInt(0, 12)];
    const calculatedX = CONSTANTS.MEASUREMENTS.NUM_COLUMNS * left;
    const x = calculatedX > 0 ? calculatedX - 1 : calculatedX;
    const startingPoint = document.getElementById(`${x}-${y}`);
    const car = document.createElement("img");
    car.className = `moving-car-${x}-${y}`;
    car.height = `${vh(4)}`;
    car.width = `${vw(4)}`;
    car.src = left
        ? "images/purple-car-traveling-left.png"
        : "images/white-car-traveling-right.png";
    car.setAttribute("direction", left ? "left" : "right");
    startingPoint.appendChild(car);
    movingCars.push([x, y, left > 0]);
};

/**
 * Adds a car to the random row, and appends it's coordinates to the movingCars array to then be moved
 *
 * @param {number} timestamp - For utility if it needs to be utilized, passed from the requestAnimationFrame function, represents the time this function was called
 */
const addLog = (timestamp) => {
    let startingPoint = null;
    let x;
    let y;
    let left;
    while (
        startingPoint === null ||
        startingPoint.hasChildNodes() ||
        movingLogs.map((e) => e[1]).includes(y)
    ) {
        left = getRandomInt(0, 2);
        y = CONSTANTS.ROW_VALUES.WATER[getRandomInt(0, 6)];
        const calculatedX = CONSTANTS.MEASUREMENTS.NUM_COLUMNS * left;
        x = calculatedX > 0 ? calculatedX - 1 : calculatedX;
        startingPoint = document.getElementById(`${x}-${y}`);
    }
    const log = document.createElement("img");
    log.className = `moving-log-${x}-${y}`;
    log.height = `${vh(4)}`;
    log.width = `${vw(4)}`;
    log.src = "images/log.png";
    log.setAttribute("direction", left ? "left" : "right");
    log.style.position = "relative";
    startingPoint.appendChild(log);
    movingLogs.push([x, y, left > 0]);
};

/**
 * Side-Effect function
 *
 * Checks if the movingCars array has cars within it, if it doesn't sets a timer to re-call itself via requestAnimationFrame method, if there is a moving car
 * - First checks if the car is moving left and has reached the left, then it de-spawns it, waits 3 seconds, and re-spawns another car
 * - Second checks if the car is moving right and has reached the right, then it de-spawns it, and re-spawns another car
 * - Third, if it's in the process of moving, it removes the image from it's current node, and adds it to the node in it's path, then increment's it's x coordinate in the movingCars array
 */
const moveCars = (timestamp, frogInstance) => {
    console.log(document.getElementById("lives").innerHTML);
    if (movingCars.length > 0) {
        let index = 0;
        while (index < movingCars.length) {
            const eachCar = movingCars[index];
            const [x, y, left] = eachCar;
            const frogx = frogInstance ? Number.parseInt(frogInstance.getAttribute("x")) :-1; 
            const frogy = frogInstance ? Number.parseInt(frogInstance.getAttribute("y")) :-1;
            if (x == frogx && y == frogy) {
                console.log("hit by a car");
                resetFrog(frogInstance);
                loseLife();
            }
            if (left && x === 0) {
                const currentNode = document.getElementById(`${x}-${y}`);
                currentNode.removeChild(currentNode.childNodes[0]);
                movingCars.splice(index, 1);
                setTimeout(() => {
                    window.requestAnimationFrame(addCar);
                }, getRandomInt(1500, 3000));
            } else if (!left && x === 24) {
                const currentNode = document.getElementById(`${x}-${y}`);
                currentNode.removeChild(currentNode.childNodes[0]);
                movingCars.splice(index, 1);
                setTimeout(() => {
                    window.requestAnimationFrame(addCar);
                }, getRandomInt(1500, 3000));
            } else {
                const currentNode = document.getElementById(`${x}-${y}`);
                const car = currentNode.childNodes[0];
                currentNode.removeChild(car);
                const nextNode = document.getElementById(
                    `${left ? x - 1 : x + 1}-${y}`,
                );
                nextNode.appendChild(car);
                movingCars[index++][0] = left ? x - 1 : x + 1;
            }
        }
    }
    setTimeout(() => {
        window.requestAnimationFrame((time) => moveCars(time, frogInstance));
    }, [30]);
};

/**
 * Side-Effect function
 * @param {HTMLImageElement} frogInstance - The frog instance
 *
 * Checks if the movingLogs array has logs within it, if it doesn't sets a timer to re-call itself via requestAnimationFrame method, if there is a moving log
 * - First checks if the log is moving left and has reached the left, then it de-spawns it, waits 3 seconds, and re-spawns another log
 * - Second checks if the log is moving right and has reached the right, then it de-spawns it, and re-spawns another log
 * - Third, if it's in the process of moving, it removes the image from it's current node, and adds it to the node in it's path, then increment's it's x coordinate in the movingLogs array
 */
const moveLogs = (timestamp, frogInstance) => {
    if (movingLogs.length > 0) {
        let index = 0;
        while (index < movingLogs.length) {
            const eachLog = movingLogs[index];
            const [x, y, left] = eachLog;
            if (left && x === 0) {
                const currentNode = document.getElementById(`${x}-${y}`);
                [...currentNode.childNodes].forEach((eachNode) =>
                    currentNode.removeChild(eachNode),
                );
                movingLogs.splice(index, 1);
                setTimeout(() => {
                    window.requestAnimationFrame(addLog);
                }, getRandomInt(1500, 3000));
            } else if (!left && x === 24) {
                const currentNode = document.getElementById(`${x}-${y}`);
                [...currentNode.childNodes].forEach((eachNode) =>
                    currentNode.removeChild(eachNode),
                );
                movingLogs.splice(index, 1);
                setTimeout(() => {
                    window.requestAnimationFrame(addLog);
                }, getRandomInt(1500, 3000));
            } else {
                const currentNode = document.getElementById(`${x}-${y}`);
                const log = currentNode.childNodes[0];
                [...currentNode.childNodes].forEach((eachNode) =>
                    currentNode.removeChild(eachNode),
                );
                const nextNode = document.getElementById(
                    `${left ? x - 1 : x + 1}-${y}`,
                );
                nextNode.appendChild(log);
                const isCurrentFrogLog =
                    frogInstance.getAttribute("onLog") === "true" &&
                    movingLogs[index][0] ===
                        parseInt(frogInstance.getAttribute("x"), 10) &&
                    movingLogs[index][1] ===
                        parseInt(frogInstance.getAttribute("y"), 10);
                movingLogs[index++][0] = left ? x - 1 : x + 1;
                if (isCurrentFrogLog) {
                    nextNode.appendChild(frogInstance);
                    frogInstance.setAttribute("x", movingLogs[index - 1][0]);
                    frogInstance.setAttribute("y", movingLogs[index - 1][1]);
                }
            }
        }
    }
    setTimeout(() => {
        window.requestAnimationFrame((time) => moveLogs(time, frogInstance));
    }, [2500]);
};

/**
 * Starts the game, first sets the start-screen display to none, then displays the game screen
 */
function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-board").style.display = "block";
}

/**
 * Increments the score element by 1 each time the frog reaches the top of the level (TODO: Refactor)
 */
const incrementScore = () => {
    const scoreSpan = document.getElementById("score");
    const scoreStr = scoreSpan.innerText;
    var score = parseInt(scoreStr) + 1;
    scoreSpan.innerText = score;
};

/*
* Identifies when the frog reaches the end and sets ending screen
*/
const reachedEnd = (frogInstance) => {
    const frog = document.getElementById(CONSTANTS.OBJECTS.FROG_ID);
    const fromI = Number.parseInt(frog.getAttribute("y"), 10);
    const fromJ = Number.parseInt(frog.getAttribute("x"), 10);

    if (fromI === 1) {
        console.log("Reached the end")
        endingScreen();
        return true
    }
}

const endingScreen = () => {
    document.getElementById("end-screen").style.display = "block";
    document.getElementById("game-board").style.display = "none";
}

/**
 * Moves the frog from `fromI` and `fromJ` to `toI` and `toJ`
 *
 * @param {number} i - The y coord
 * @param {number} j - The x coord
 * @param {HTMLImageElement} frogInstance
 */
const moveFrog = (fromI, fromJ, toI, toJ, frogInstance) => {
    const fromCoordinate = document.getElementById(`${fromJ}-${fromI}`);
    const toCoordinate = document.getElementById(`${toJ}-${toI}`);
    frogInstance.setAttribute("x", toJ);
    frogInstance.setAttribute("y", toI);
    toCoordinate.appendChild(frogInstance);
    if (
        movingLogs.find(
            (eachCoord) => eachCoord[0] === toJ && eachCoord[1] === toI,
        )
    ) {
        frogInstance.style.position = "absolute";
        frogInstance.style.right = ".5vw";
        frogInstance.setAttribute("onLog", true);
    } else {
        if (frogInstance.getAttribute("onLog") === "true") {
            frogInstance.style.position = "relative";
            frogInstance.style.right = undefined;
            frogInstance.setAttribute("onLog", false);
        }
    }
    waterJump(frogInstance);
};

/**
 * Removes life and resets frog to the beginning when water is touched
 * 
 * @param {HTMLImageElement} frogInstance 
 */
const waterJump = (frogInstance) => {
    const frog = document.getElementById(CONSTANTS.OBJECTS.FROG_ID);
    const fromI = Number.parseInt(frog.getAttribute("y"), 10);
    const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
    if (
        CONSTANTS.ROW_VALUES.WATER.includes(fromI) &&
        frogInstance.getAttribute("onLog") === "false"
    ) {
        resetFrog(frogInstance);
        loseLife();
    }

}

/**
 * Moves frog to the beginning
 * 
 * @param {HTMLImageElement} frogInstance 
 */
const resetFrog = (frogInstance) => {
    const fromI = Number.parseInt(frog.getAttribute("y"), 10);
    const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
    moveFrog(fromI, fromJ, CONSTANTS.IMPORTANT_COORDS.START_Y, CONSTANTS.IMPORTANT_COORDS.START_X, frogInstance);
    
}

/**
 * Moves frog to the beginning and updates lives var when it loses a life
 * 
 * @param {HTMLImageElement} frogInstance 
 */
function loseLife() {
    const lives = document.getElementById("lives");
    lives.innerHTML = Number.parseInt(lives.innerHTML) - 1;
    console.log("lost life");
    updateLives(Number.parseInt(lives.innerHTML));

    if (Number.parseInt(lives.innerHTML) < 1){
        console.log(lives.innerHTML, typeof lives.innerHTML);
        updateLives(0);
        updateLives(3);
        document.getElementById("start-screen").style.display = "block";
        document.getElementById("game-board").style.display = "none";
        lives.innerHTML = 3;  
    }
}

function updateLives(lives){
    console.log("update lives");
    var imgFrog = document.createElement("img");
    imgFrog.setAttribute("src", "images/frog.png");
    imgFrog.style.height = "3.9vh";
    imgFrog.style.width = "3vw";
    const clone = imgFrog.cloneNode(true);
    const clone2 = imgFrog.cloneNode(true);
    var text = document.createTextNode(" ");
    document.getElementById("frogger-0").style.color = "#ffeab0";
    if (lives==3){
        document.getElementById("frogger-0").appendChild(text);
        document.getElementById("frogger-0").appendChild(imgFrog);
        document.getElementById("frogger-0").appendChild(clone);
        document.getElementById("frogger-0").appendChild(clone2);
    }
    else if(lives==2){  
        document.getElementById("frogger-0").innerHTML="";
        document.getElementById("frogger-0").appendChild(text);
        document.getElementById("frogger-0").appendChild(imgFrog);
        document.getElementById("frogger-0").appendChild(clone);
    }
    else if(lives==1){
       document.getElementById("frogger-0").innerHTML="";   
       document.getElementById("frogger-0").appendChild(text);
       document.getElementById("frogger-0").appendChild(imgFrog);
    }
    else{
        document.getElementById("frogger-0").innerHTML="";  
    }
}
//#region Listeners

/**
 * Handles the keydown event, which fires for any key pressed
 *
 * @param {KeyboardEvent} keyEvent - The keyboard event to capture, and edit DOM elements contingent on key pressed
 */
window.onkeydown = (keyEvent) => {
    const { key } = keyEvent;
    const frog = document.getElementById(CONSTANTS.OBJECTS.FROG_ID);

    switch (key) {
        case "ArrowDown": {
            const fromI = Number.parseInt(frog.getAttribute("y"), 10);
            const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
            frog.setAttribute("src", "images/frog-down.png");
            frog.style.height = "3.9vh";
            frog.style.width = "2.9vw";
            if (fromI < 24) {
                moveFrog(fromI, fromJ, fromI + 1, fromJ, frog);
            }
            break;
        }
        case "ArrowUp": {
            const fromI = Number.parseInt(frog.getAttribute("y"), 10);
            const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
            frog.setAttribute("src", "images/frog.png");
            frog.style.height = "3.9vh";
            frog.style.width = "3vw";
            reachedEnd(frog);
            if (fromI > 0) {
                moveFrog(fromI, fromJ, fromI - 1, fromJ, frog);
            }
            break;
        }
        case "ArrowLeft": {
            const fromI = Number.parseInt(frog.getAttribute("y"), 10);
            const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
            frog.setAttribute("src", "images/frog-left.png");
            frog.style.height = "3.9vh";
            frog.style.width = "3vw";
            if (fromJ > 0) {
                moveFrog(fromI, fromJ, fromI, fromJ - 1, frog);
            }
            break;
        }
        case "ArrowRight": {
            const fromI = Number.parseInt(frog.getAttribute("y"), 10);
            const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
            frog.setAttribute("src", "images/frog-right.png");
            frog.style.height = "3.9vh";
            frog.style.width = "2.9vw";
            if (fromJ < 24) {
                moveFrog(fromI, fromJ, fromI, fromJ + 1, frog);
            }
            break;
        }
    }
};

/**
 * Fires when the screen loads
 */
window.onload = () => {
    document.getElementById("game-board").style.display = "none";
    const frog = createFrog();
    updateLives(3);
    for (let i = 0; i < CONSTANTS.MEASUREMENTS.NUM_ROWS; i++) {
        for (let j = 0; j < CONSTANTS.MEASUREMENTS.NUM_COLUMNS; j++) {
            const row = document.getElementById(`frogger-${i}`);
            const coord = createCoord(i, j);
            row.appendChild(coord);
        }
    }
    const startingCoord = document.getElementById(
        `${CONSTANTS.IMPORTANT_COORDS.START_X}-${CONSTANTS.IMPORTANT_COORDS.START_Y}`,
    );
    frog.setAttribute("x", CONSTANTS.IMPORTANT_COORDS.START_X);
    frog.setAttribute("y", CONSTANTS.IMPORTANT_COORDS.START_Y);
    startingCoord.appendChild(frog);
    
    window.requestAnimationFrame(addCar);
    window.requestAnimationFrame(addCar);
    window.requestAnimationFrame(addCar);
    window.requestAnimationFrame(addCar);
    window.requestAnimationFrame(addCar);
    window.requestAnimationFrame(addCar);
    window.requestAnimationFrame(addCar);

    window.requestAnimationFrame(addLog);
    window.requestAnimationFrame(addLog);
    window.requestAnimationFrame(addLog);
    window.requestAnimationFrame(addLog);
    window.requestAnimationFrame(addLog);
    window.requestAnimationFrame((time) => moveCars(time, frog));
    window.requestAnimationFrame((time) => moveLogs(time, frog));
};

//#endregion
