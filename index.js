/**
 * Generates a random int between min and max
 *
 * @param {number} min - The min range for the random int
 * @param {number} max - The max range for the random int
 * @returns - Random integer between min and max
 */
const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

const levelIds = [
    "log-level",
    "car-level",
    "lilypad-level",
    "start-level",
    "end-level",
];

/**
 * Fires when the screen loads
 */
window.onload = () => {
    const froggerContainer = document.getElementById("frogger-container");
    const levelAmount = getRandomInt(5, 8);
    console.log("levelAmount ", levelAmount);
    for (i = 0; i < levelAmount; i++) {
        const levelType = getRandomInt(0, 4);
        froggerContainer.appendChild(createLevel(levelIds[levelType]));
    }
    const childNodesLength = 100.0 / froggerContainer.children.length;
    [...froggerContainer.children].forEach((eachNode) => {
        eachNode.style.height = `${childNodesLength}vh`;
        eachNode.style.width = "100%";
    });
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
