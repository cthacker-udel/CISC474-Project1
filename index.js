window.onload = () => {
    const froggerContainer = document.getElementById("frogger-container");
    const childNodesLength = 100.0 / froggerContainer.children.length;
    [...froggerContainer.children].forEach((eachNode) => {
        eachNode.style.height = `${childNodesLength}vh`;
    });
};
