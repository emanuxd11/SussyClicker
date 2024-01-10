function inactiveRunGame() {
    // do game logic
}

function handleFocusChange() {
    if (document.hidden) {
        var inactive = setInterval(inactiveRunGame, 1000);
    } else {
        clearInterval(inactive);
    }
}

document.addEventListener("visibilitychange", handleFocusChange);
