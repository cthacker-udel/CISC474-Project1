const CONSTANTS = {
    LEVELS: {
        CAR: "car-level",
        END: "end-level",
        FROG_ID: "frog",
        LILYPAD: "lilypad-level",
        LOG: "log-level",
        START: "start-level",
    },
};

const vh = (percent) => {
    const h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
    );
    return (percent * h) / 100;
};

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

/**
 * The ids for each level
 */
const levelIds = [
    CONSTANTS.LEVELS.LOG,
    CONSTANTS.LEVELS.CAR,
    CONSTANTS.LEVELS.LILYPAD,
];

/**
 * Fires when the screen loads
 */
window.onload = () => {
    const froggerContainer = document.getElementById("frogger-container");
    const levelAmount = getRandomInt(5, 8);
    froggerContainer.appendChild(createEndLevel());
    for (i = 0; i < levelAmount; i++) {
        const levelType = getRandomInt(0, 3);
        froggerContainer.appendChild(createLevel(levelIds[levelType]));
    }
    froggerContainer.appendChild(createStartLevel());
    const childNodesLength = 100.0 / froggerContainer.children.length;
    [...froggerContainer.children].forEach((eachNode) => {
        eachNode.style.height = `${childNodesLength}vh`;
        eachNode.style.width = "100%";
    });
    froggerContainer.appendChild(createFrog());
};

/**
 * Handles the keydown event, which fires for any key pressed
 *
 * @param {KeyboardEvent} keyEvent - The keyboard event to capture, and edit DOM elements contingent on key pressed
 */
window.onkeydown = (keyEvent) => {
    const { key } = keyEvent;
    const frog = document.getElementById(CONSTANTS.LEVELS.FROG_ID);
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
 * Creates a frog element, and positions it at the beginning of the level
 *
 * @returns Frog element
 */
const createFrog = () => {
    const frog = document.createElement("div");
    frog.className = "position-absolute";
    frog.id = CONSTANTS.LEVELS.FROG_ID;
    frog.style.height = "2.95vh";
    frog.style.width = "2.95vw";
    frog.style.right = "50%";
    frog.style.bottom = "0%";
    frog.style.backgroundColor = "red";
    return frog;
};

// #region Creating Levels

/**
 * Creates the start level, and returns the html element
 *
 * @returns The start level
 */
const createStartLevel = () => {
    const startLevel = document.createElement("div");
    startLevel.id = CONSTANTS.LEVELS.START;
    startLevel.innerHTML = startLevel.id;
    return startLevel;
};

/**
 * Creates the end level, and returns the html element
 *
 * @returns The end level
 */
const createEndLevel = () => {
    const endLevel = document.createElement("div");
    endLevel.id = CONSTANTS.LEVELS.END;
    endLevel.innerHTML = endLevel.id;
    return endLevel;
};

/**
 * Generic function to create a level with the supplied id
 *
 * @param {string} id - The id of the level
 * @returns The created level
 */
const createLevel = (id) => {
    const level = document.createElement("div");
    level.id = id;
    level.innerHTML = id;
    return level;
};

// #endregion
