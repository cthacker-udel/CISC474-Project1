//#region Constants

// Array of moving car coordinates
let movingCars = [];


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
    frog.style.height = "3.5vh";
    frog.style.width = "3.5vw";
    frog.style.position = "relative";
    return frog;
};

const createLog = (x, y, isMovingLeft) => {
    const log = document.createElement("img");
    log.className = `moving-log ${x}-${y}`;
    log.height = `${vh(4)}`;
    log.width = `${vw(4)}`;
    log.src = "images/log.png";
    log.setAttribute("direction", isMovingLeft ? "left" : "right");
    log.setAttribute("x", x);
    log.setAttribute("y", y);
    log.style.position = "relative";
    return log;
};

const gatherLogs = () => document.getElementsByClassName("moving-log");

//#endregion

//#region Functions

/**
 * Adds a car to the random row, and appends it's coordinates to the movingCars array to then be moved
 *
 * @param {number} timestamp - For utility if it needs to be utilized, passed from the requestAnimationFrame function represents the time this function was called
 */
const addCar = (timestamp) => {
    const left = getRandomInt(0, 2);
    const y = CONSTANTS.ROW_VALUES.ROADS[getRandomInt(0, 7)];
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
    const y = CONSTANTS.ROW_VALUES.WATER[getRandomInt(0, 5)]; // random row which to place the log on
    const left = getRandomInt(0, 2); // determines if left or right
    const calculatedX = CONSTANTS.MEASUREMENTS.NUM_COLUMNS * left; // either left or far right
    const x = calculatedX > 0 ? calculatedX - 1 : calculatedX; // -1 if far right to avoid indexError, else keep the same because it's 0
    const startingPoint = document.getElementById(`${x}-${y}`); // gather coordinate to place log at
    const logs = gatherLogs();

    const logsInDirection = [...logs].filter((eachLog) => Number.parseInt(eachLog.getAttribute("y")) === y);
    console.log(logsInDirection);
    if (logsInDirection.length > 0) {
        // logs already present in row, place it on the correct directional spot
        const isLeft = logsInDirection[0][2];
        if (isLeft) {
            const rightMostPoint = document.getElementById(`24-${y}`);
            if (rightMostPoint.childElementCount === 0) {
                const log = createLog(23, y, isLeft);
                rightMostPoint.appendChild(log);
                return;
            }
        } else {
            const leftMostPoint = document.getElementById(`0-${y}`);
            if (leftMostPoint.childElementCount === 0) {
                const log = createLog(0, y, false);
                leftMostPoint.appendChild(log);
                return;
            }
        }
    } else {
        const log = createLog(x, y, left);
        startingPoint.appendChild(log);
        return;
    }
};

/**
 * Side-Effect function
 *
 * Checks if the movingCars array has cars within it, if it doesn't sets a timer to re-call itself via requestAnimationFrame method, if there is a moving car
 * - First checks if the car is moving left and has reached the left, then it de-spawns it, waits 3 seconds, and re-spawns another car
 * - Second checks if the car is moving right and has reached the right, then it de-spawns it, and re-spawns another car
 * - Third, if it's in the process of moving, it removes the image from it's current node, and adds it to the node in it's path, then increment's it's x coordinate in the movingCars array
 */
const moveCars = () => {
    if (movingCars.length > 0) {
        let index = 0;
        while (index < movingCars.length) {
            const eachCar = movingCars[index];
            const [x, y, left] = eachCar;
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
        window.requestAnimationFrame(moveCars);
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
    const movingLogs = gatherLogs();
    if (movingLogs.length > 0) {
        let index = 0;
        while (index < movingLogs.length) {
            const eachLog = movingLogs[index];
            const [x, y, left] = [
                +eachLog.getAttribute("x"),
                +eachLog.getAttribute("y"),
                eachLog.getAttribute("direction") === "left",
            ];
            const currentNode = document.getElementById(`${x}-${y}`);
            [...currentNode.childNodes].forEach((eachNode) =>
                currentNode.removeChild(eachNode),
            );
            if ((left && x > 0) || (!left && x < 24)) {
                const nextNode = document.getElementById(
                    `${left ? x - 1 : x + 1}-${y}`,
                );
                nextNode.appendChild(eachLog);
                const isCurrentFrogLog =
                    frogInstance.getAttribute("onLog") === "true" &&
                    x === parseInt(frogInstance.getAttribute("x"), 10) &&
                    y === parseInt(frogInstance.getAttribute("y"), 10);
                try {
                    movingLogs[index].setAttribute("x", left ? x - 1 : x + 1);
                } catch (e) {
                    console.log("in catch, ", movingLogs, index);
                }
                if (isCurrentFrogLog) {
                    nextNode.appendChild(frogInstance);
                    frogInstance.setAttribute(
                        "x",
                        +movingLogs[index].getAttribute("x"),
                    );
                    frogInstance.setAttribute(
                        "y",
                        +movingLogs.getAttribute("y"),
                    );
                }
            }
            index += 1;
        }
    }
};

const logMasterFunction = (timestamp, frogInstance) => {
    let interval = undefined;
    try {
            interval = setInterval(() => {
            let count = 0;
            const logRoundCount = getRandomInt(1, 5);
            while (count < logRoundCount) {
                addLog(timestamp);
                count++;
            }
            moveLogs(timestamp, frogInstance);
        }, [2500]);
    } catch (e) {
        console.error(e);
        if (interval) {
            clearInterval(interval);
        }
    }
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
        toCoordinate.childElementCount > 0 && [...toCoordinate.children].filter((eachNode) => eachNode.className.includes("moving-log")).length > 0
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
};

//#endregion

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
            if (fromI < 24) {
                moveFrog(fromI, fromJ, fromI + 1, fromJ, frog);
            }
            break;
        }
        case "ArrowUp": {
            const fromI = Number.parseInt(frog.getAttribute("y"), 10);
            const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
            if (fromI > 0) {
                moveFrog(fromI, fromJ, fromI - 1, fromJ, frog);
            }
            break;
        }
        case "ArrowLeft": {
            const fromI = Number.parseInt(frog.getAttribute("y"), 10);
            const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
            if (fromJ > 0) {
                moveFrog(fromI, fromJ, fromI, fromJ - 1, frog);
            }
            break;
        }
        case "ArrowRight": {
            const fromI = Number.parseInt(frog.getAttribute("y"), 10);
            const fromJ = Number.parseInt(frog.getAttribute("x"), 10);
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
    logMasterFunction(Date.now(), frog);
    window.requestAnimationFrame((time) => moveCars(time, frog));
};

//#endregion
