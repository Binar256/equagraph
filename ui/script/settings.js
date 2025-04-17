export const settings = document.getElementById("settings");
export const settingsIcon = document.getElementById("settingsIcon");
export const settingsHideout = document.getElementById("settingsHideout");
export const settingsMouseLeave = document.getElementById("settingsMouseLeave");

const buttonSettingsElements = ["darkmode", "function1", "function2", "function3", "keepOpenSettings"];
const buttonSettings = [];

export let menuOpen = false;
let windowWidth = window.innerWidth;
let loaded = false;

export function activateSettings() {
    if (loaded) {return;}
    loadSettings();
    loaded = true;
}

function loadSettings() {
    for (let i = 0; i < 5; i++) {
        buttonSettings[i] = {
            status: false,
            element: document.getElementById(buttonSettingsElements[i]),
            child: document.getElementById(buttonSettingsElements[i]).querySelector("img")
        };
        buttonSettings[i].element.addEventListener("click", function() {
            buttonSettings[i].child.classList.toggle("showIconSettings");
            settingsFunctions(i); 
            buttonSettings[i].status = !buttonSettings[i].status;
        });
    }
    if (document.documentElement.dataset.theme === "dark") {
        buttonSettings[0].status = true;
        buttonSettings[0].child.classList.toggle("showIconSettings");
    }
    
    document.addEventListener("mousemove", event => {
        windowWidth = window.innerWidth;
        if (!menuOpen || buttonSettings[4].status) return;
        const rect = settingsMouseLeave.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        if (mouseX < rect.left || mouseX > rect.right ||
            mouseY < rect.top || mouseY > rect.bottom) {
            if (windowWidth <= 550) {
                settings.style.transform = "translate(-115px, -290px)";
            } else if (windowWidth <= 850){
                settings.style.transform = "translate(-150px, -290px)";
            }
            else if (windowWidth <= 1150 && windowWidth > 850) {
                const distance = Math.round((1150 - windowWidth) / 2);
                const settingsDistance = -450 + distance + "px";
                settings.style.transform = "translate(" + settingsDistance + ", -282px)";
            } else {
                settings.style.transform = "translate(-450px, -282px)";
            }
            if (!buttonSettings[0].status) {
                document.documentElement.style.setProperty('--menu-color', "var(--dark-color)");
            }
            menuOpen = false;
        }
    });

    settingsIcon.addEventListener("mouseenter", function() {
        windowWidth = window.innerWidth;
        menuOpen = true;
        if (windowWidth <= 550) {
            settings.style.transform = "translate(-115px, 10px)";
        } else if (windowWidth <= 850) {
            settings.style.transform = "translate(-150px, 10px)";
        } else if (windowWidth <= 1150 && windowWidth > 850) {
            const distance = Math.round((1150 - windowWidth) / 2);
            const settingsDistance = -450 + distance + "px";
            settings.style.transform = "translate(" + settingsDistance + ", 20px)";
        } else {
            settings.style.transform = "translate(-450px, 20px)";
        }
        if (!buttonSettings[0].status) {
            document.documentElement.style.setProperty('--menu-color', "white");
        }
    });

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
        if ((event.matches && buttonSettings[0].status) || (!event.matches && !buttonSettings[0].status)) return;
        if (event.matches) {
            document.documentElement.dataset.theme = "dark";
            document.documentElement.style.setProperty('--menu-color', "white");
        } else {
            document.documentElement.dataset.theme = "light";
            document.documentElement.style.setProperty('--menu-color', menuOpen ? "white" : "var(--dark-color)");

        }
        buttonSettings[0].status = !buttonSettings[0].status;
        buttonSettings[0].child.classList.toggle("showIconSettings");
    });
    someThemes();
}

function settingsFunctions(click) {
    switch (click) {
        case 0: darkmodeFunction();
                break;
        case 1: function1Function();
                break;
        case 2: function2Function();
                break;
        case 3: function3Function();
                break;
    }
}

function darkmodeFunction() {
    if (!buttonSettings[0].status) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.style.setProperty('--menu-color', "white");
    }
}

function function1Function() {}
function function2Function() {}
function function3Function() {}  

function someThemes() {
    buttonSettings[0].element.addEventListener("mousedown", () => timeoutController(true));
    buttonSettings[0].element.addEventListener("mouseup", () => timeoutController(false));
    buttonSettings[0].element.addEventListener("mouseleave", () => timeoutController(false));
}

function setupTimeout() {
    let timeout;
    return (startTimeout) => {
        if (timeout) clearTimeout(timeout);
        if (startTimeout) timeout = setTimeout(() => {
            const rootStyles = getComputedStyle(document.documentElement);
            const color = rootStyles.getPropertyValue("--theme-color").trim();
            if (color === "black") {
                document.documentElement.style.setProperty("--theme-color", "var(--dark-color)");
                buttonSettings[0].element.querySelector("span").innerText = "Dark mode";
            }
            else {
                document.documentElement.style.setProperty("--theme-color", "black");
                buttonSettings[0].element.querySelector("span").innerText = "Black mode";
            }
        }, 10_00);
    }
}
const timeoutController = setupTimeout();