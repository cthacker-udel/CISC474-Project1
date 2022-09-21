/**
 * Constants to avoid repeated code
 */
const CONSTANTS = {
    ROWS: {
        ROAD: "road-row",
        END: "end-row",
        LILYPAD: "lilypad-row",
        LOG: "log-row",
        BOARDWALK: "boardwalk-row",
        WATER: "water-row",
        START: "start-row",
    },
    OBJECTS: {
        FROG_ID: "frog",
        LOG_ID: "log",
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
    CONSTANTS.ROWS.GRASS
];

/**
 * Fires when the screen loads
 */
window.onload = () => {
    const endContainer = document.getElementById("end-container");
    endContainer.appendChild(createEndrow());
    const roadContainer = document.getElementById("road-container");
    roadContainer.appendChild(createRoadrow());
    const startContainer = document.getElementById("start-container");
    startContainer.appendChild(createStartrow());
    startContainer.appendChild(createFrog());
};

/**
 * Handles the keydown event, which fires for any key pressed
 *
 * @param {KeyboardEvent} keyEvent - The keyboard event to capture, and edit DOM elements contingent on key pressed
 */
window.onkeydown = (keyEvent) => {
    const { key } = keyEvent;
    const frog = document.getElementById(CONSTANTS.OBJECTS.FROG_ID);
    const frogPosition = frog.getBoundingClientRect();

    /// COMMENTED FOR FURTHER REFERENCE

    // console.log(frogPosition);
    // console.log(
    //     window.innerHeight,
    //     window.outerHeight,
    //     "|",
    //     window.innerWidth,
    //     window.outerWidth,
    // );
    // console.log(
    //     document.documentElement.clientHeight,
    //     document.documentElement.clientWidth,
    // );

    // console.log(vh(10));
    // console.log(frog.style.bottom);

    // console.log(frogPosition.x);
    // console.log(frog.style);

    switch (key) {
        case "ArrowDown": {
            if (frog.style.bottom !== "0%") {
                const previousBottom = parseInt(
                    frog.style.bottom.replace("%", ""),
                );
                frog.style.bottom =
                    frog.style.bottom !== "97%"
                        ? `${previousBottom - 5}%`
                        : "95%";
            }
            break;
        }
        case "ArrowUp": {
            if (frog.style.bottom !== "95%" && frog.style.bottom !== "97%") {
                const previousBottom = parseInt(
                    frog.style.bottom.replace("%", ""),
                );
                frog.style.bottom = `${previousBottom + 5}%`;
            } else if (frog.style.bottom === "95%") {
                frog.style.bottom = "97%";
            }
            break;
        }
        case "ArrowLeft": {
            if (frog.style.right !== "95%" && frog.style.right !== "97%") {
                const previousLeft = parseInt(
                    frog.style.right.replace("%", ""),
                );
                frog.style.right = `${previousLeft + 5}%`;
            } else if (frog.style.right === "95%") {
                frog.style.right = "97%";
            }
            break;
        }
        case "ArrowRight": {
            if (frog.style.right !== "0%") {
                const previousRight = parseInt(
                    frog.style.right.replace("%", ""),
                );
                frog.style.right =
                    frog.style.right !== "97%"
                        ? `${previousRight - 5}%`
                        : "95%";
            }
            break;
        }
    }
};

/**
 * Creates a frog element, and positions it at the beginning of the row
 *
 * @returns Frog element
 */
const createFrog = () => {
    const frog = document.createElement("img");
    frog.setAttribute('src', 'images/frog.png');
    frog.className = "position-absolute";
    frog.id = CONSTANTS.OBJECTS.FROG_ID;
    frog.style.height = "4.95vh";
    frog.style.width = "4.95vw";
    frog.style.right = "50%";
    frog.style.bottom = "1%";
    return frog;
};

// #region Creating ROWS

/**
 * Creates the start row, and returns the html element
 *
 * @returns The start row
 */
const createStartrow = () => {
    const startrow = document.createElement("img");
    startrow.setAttribute('src', 'images/sidewalk.png');
    startrow.id = CONSTANTS.ROWS.START;
    startrow.innerHTML = startrow.id;
    return startrow;
};

/**
 * Creates the end row, and returns the html element
 *
 * @returns The end row
 */
const createEndrow = () => {
    const endrow = document.createElement("img");
    endrow.setAttribute('src', 'images/end.png');
    endrow.id = CONSTANTS.ROWS.END;
    endrow.innerHTML = endrow.id;
    return endrow;
};

/**
 * Creates the road row
 *
 * @returns The road row
 */
const createRoadrow = () => {
    const roadrow = document.createElement("img");
    roadrow.setAttribute('src', 'images/road.png');
    roroadroww.id = CONSTANTS.ROWS.ROAD;
    roadrow.innerHTML = roadrow.id;
    return roadrow;
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
}