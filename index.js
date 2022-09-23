/**
 * Constants to avoid repeated code
 */
const CONSTANTS = {
    IMPORTANT_COORDS: {
        START_X: 12,
        START_Y: 24,
    },
    MEASUREMENTS: {
        COORD_WIDTH: "4vw",
        COORD_HEIGHT: "4vh",
        NUM_COLUMNS: 25,
        NUM_ROWS: 25,
    },
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
    RANGES: {},
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
 * The ids for each row
 */
const rowIds = [
    CONSTANTS.ROWS.WATER,
    CONSTANTS.ROWS.ROAD,
    CONSTANTS.ROWS.BOARDWALK,
    CONSTANTS.ROWS.GRASS,
];

/**
 * Fires when the screen loads
 */
window.onload = () => {
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
    startingCoord.innerHTML = "";
    startingCoord.appendChild(frog);
};

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
    coord.setAttribute("coord", `${i},${j}`);
    coord.id = `${j}-${i}`;
    return coord;
};

/**
 * Moves the frog from `fromI` and `fromJ` to `toI` and `toJ`
 *
 * @param {number} i - The y coord
 * @param {number} j - The x coord
 * @param {HTMLImageElement} frogInstance
 */
const moveFrog = (fromI, fromJ, toI, toJ, frogInstance) => {
    console.log("moving to ", `${fromI} ${fromJ} to ${toI} ${toJ}`);
    const fromCoordinate = document.getElementById(`${fromJ}-${fromI}`);
    fromCoordinate.removeChild(fromCoordinate.childNodes[0]);
    const toCoordinate = document.getElementById(`${toJ}-${toI}`);
    frogInstance.setAttribute("x", toJ);
    frogInstance.setAttribute("y", toI);
    toCoordinate.appendChild(frogInstance);
};

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

// #region Creating ROWS

const createRow = (img, id) => {
    const row = document.createElement("img");
    row.setAttribute("src", `images/${img}.png`);
    row.id = id;
    row.innerHTML = row.id;
    return row;
};

// #region Creating OBJECTS

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
    return frog;
};

/**
 * Create a car moving left
 *
 * @returns car object
 */
 const createCarLeft = () => {
    const carLeft = document.createElement("img");
    // TODO: make this randomly select cars traveling left
    carLeft.setAttribute('src', 'images/purple-car-traveling-left.png');
    carLeft.className = "position-absolute";
    carLeft.id = CONSTANTS.OBJECTS.CAR_ID.PURPLE_LEFT;
    return carLeft;
};

/**
 * Create a moving log
 *
 * @returns Log object
 */
const createLogs = () => {
    const log = document.createElement("img");
    log.setAttribute('src', 'images/log.png');
    log.className = "position-absolute";
    log.id = CONSTANTS.OBJECTS.LOG_ID;
    log.style.height = "2.95vh";
    log.style.width = "5.95vw";
    return log;
};


function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
};

/**
 * Increments the score element by 1 each time the frog reachs the top of the level
 */
 const incrementScore = () => {
    const scoreSpan = document.getElementById("score");
    const scoreStr = scoreSpan.innerText;
    var score = parseInt(scoreStr) + 1
    scoreSpan.innerText = score
}
