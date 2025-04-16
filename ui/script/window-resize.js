import { menuOpen, settings, settingsIcon, settingsHideout, settingsMouseLeave } from "./settings.js";
import { showMathSymbols, mathSymbols, mathSymbolsCompact1, mathSymbolsCompact2, mathSymbolsHideout, moveThroughText, mathSymbolsPosition } from "./math-symbols.js";
import { outputBox, actionButtonsMenu, pageButtons, actionButtonsMoveExp } from "./output-box.js";
import { inputBox, hideCopyMessage } from "./input-box.js";

export let windowWidth = window.innerWidth;
let lastWindowWidth = 0;
const header = document.getElementById("header");
const footer = document.getElementById("footer");
export const main = document.getElementById("main");
export const compactContainer = document.getElementById("compactContainer");

let actionButtonsXPosition;
let actionButtonsYPosition;

const checkCompactValues = [1350, 1000, 850, 700, 550, 0];
let loaded = false;

export function enableResizer() {
    if (loaded) return;
    window.addEventListener("resize", compactLayout);
    compactLayout();
    loaded = true;
}

export function elementsPosition(enableInterval) {
    if (enableInterval) {
        const interval = setInterval(elementsPosition, 10);
        setTimeout(() => {
            clearInterval(interval);
        }, 500);
    }
    main.style.top = header.offsetHeight + compactContainer.offsetHeight + "px";
    const normalPosition = window.innerHeight - header.offsetHeight;
    const minFooterBottom = getMinFooterBottom();
    const footerBottomDistance = outputBox.offsetHeight + Math.abs(outputBox.getBoundingClientRect().top - header.getBoundingClientRect().top);
    footer.style.top = Math.max(normalPosition, minFooterBottom, footerBottomDistance) + "px";
}

function getMinFooterBottom() {
    if (windowWidth <= 550) {
        return 550
    } else if (windowWidth <= 850) {
        return 600
    } else if (windowWidth <= 1350) {
        return 550;
    } else {
        return 700;
    }
}

function compactLayout() {
    windowWidth = window.innerWidth;
    hideCopyMessage()
    disableTransition();
    if (windowWidthCheck()) {
        compactLayout_MainAppend();
        compactMathSymbols();
        compactSettings();
        compactShowSymbols();
        compactPageButtons();
        lastWindowWidth = windowWidth;
    }
    actionButtonsMove();
    compactSettingsMove();
    enableTransition();
    elementsPosition(false);
}

function windowWidthCheck() {
    if (windowWidth > 1350 && lastWindowWidth <= 1350) return true;
    for (let i = 0; i < 5; i++) {
        if (windowWidth <= checkCompactValues[i] && windowWidth > checkCompactValues[i + 1] && (lastWindowWidth > checkCompactValues[i] || lastWindowWidth <= checkCompactValues[i + 1])) return true
    }
    return false;
}

function compactMathSymbols() {
    if (windowWidth <= 1350) {
        mathSymbols.style.visibility = "hidden";
        mathSymbolsCompact1.style.visibility = "visible";
        mathSymbolsCompact2.style.visibility = "visible";
        moveThroughText.style.height = "200px";
        mathSymbolsHideout.style.height = "278px";
        mathSymbolsHideout.style.width = "500px";
        const compactMathSymbolsTop = inputBox.offsetHeight - 50 + "px";
        moveThroughText.style.top = compactMathSymbolsTop;
        mathSymbolsHideout.style.top = compactMathSymbolsTop;
        mathSymbolsCompact1.style.top = compactMathSymbolsTop;
        mathSymbolsCompact2.style.top = compactMathSymbolsTop;
    } 
    if (windowWidth <= 550) {
        document.querySelectorAll(".compactSymbols").forEach(element => {
            element.style.fontSize = "17px";
        });
        mathSymbolsCompact1.style.height = "250px";
        mathSymbolsCompact1.style.width = "368px";
        mathSymbolsCompact2.style.height = "61px";
        mathSymbolsCompact2.style.width = "72px";
        mathSymbolsHideout.style.transform = "translateY(-200px)";
    } else if (windowWidth <= 1350) {
        document.querySelectorAll(".compactSymbols").forEach(element => {
            element.style.fontSize = "20px";
        });
        mathSymbolsCompact1.style.height = "278px";
        mathSymbolsCompact1.style.width = "408px";
        mathSymbolsCompact2.style.height = "68px";
        mathSymbolsCompact2.style.width = "80px";
        moveThroughText.style.height = "200px";
        mathSymbolsHideout.style.transform = "translateY(-190px)";
    } else {
        outputBox.style.marginTop = "0px";
        moveThroughText.style.top = "0px";
        mathSymbolsHideout.style.top = "0px";
        mathSymbolsCompact1.style.top = "0px";
        mathSymbolsCompact2.style.top = "0px";
        mathSymbols.style.visibility = "visible";
        mathSymbolsCompact1.style.visibility = "hidden";
        mathSymbolsCompact2.style.visibility = "hidden";
        mathSymbolsHideout.style.height = "492px";
        mathSymbolsHideout.style.width = "314px";
        mathSymbolsHideout.style.transform = "translate(485px, -430px)";
    }
    mathSymbolsPosition();
}

function compactSettingsMove() {
    if (windowWidth <= 1150 && windowWidth > 850) {
        const distance = Math.round((1150 - windowWidth) / 2);
        const settingsIconDistance = -525 + distance + "px";
        const settingsDistance = -450 + distance + "px";
        settingsIcon.style.transform = "translate(" + settingsIconDistance + ", 35px)";
        settingsHideout.style.transform = "translate(" + settingsDistance + ", -282px)";
        settingsMouseLeave.style.transform = "translate(" + settingsDistance + ", 20px)";
        if (menuOpen) {
            settings.style.transform = "translate(" + settingsDistance + ", 20px)";
        } else {
            settings.style.transform = "translate(" + settingsDistance + ", -282px)";
        }
    }
}

function compactSettings() {
        if (windowWidth <= 550){
        settingsIcon.style.transform = "translate(-190px, 25px)";
        settingsHideout.style.transform = "translate(-115px, -290px)";
        settingsMouseLeave.style.transform = "translate(-115px, 10px)";
        if (menuOpen) {
            settings.style.transform = "translate(-115px, 10px)";
        } else {
            settings.style.transform = "translate(-115px, -290px)";
        }
    } else if (windowWidth <= 850) {
        settingsIcon.style.transform = "translate(-225px, 25px)";
        settingsHideout.style.transform = "translate(-150px, -290px)";
        settingsMouseLeave.style.transform = "translate(-150px, 10px)";
        if (menuOpen) {
            settings.style.transform = "translate(-150px, 10px)";
        } else {
            settings.style.transform = "translate(-150px, -290px)";
        }
    } else {
        settingsIcon.style.transform = "translate(-525px, 35px)";
        settingsHideout.style.transform = "translate(-450px, -282px)";
        settingsMouseLeave.style.transform = "translate(-450px, 20px)";
        if (menuOpen) {
            settings.style.transform = "translate(-450px, 20px)";
        } else {
            settings.style.transform = "translate(-450px, -282px)";
        }
    } 
}

function compactShowSymbols() {
    if (windowWidth > 550) {
        showMathSymbols.style.width = "140px";
        showMathSymbols.style.height = "40px";
        showMathSymbols.style.fontSize = "17px";
    }
    if (windowWidth <= 550) {
        showMathSymbols.style.width = "110px";
        showMathSymbols.style.transform = "translate(160px, 15px)";
        showMathSymbols.style.fontSize = "15px";
    } else if (windowWidth <= 850) {
        showMathSymbols.style.transform = "translate(180px, 15px)";
    } else if (windowWidth <= 1000) {
        showMathSymbols.style.width = "80px";
        showMathSymbols.style.height = "60px";
        showMathSymbols.style.transform = "translate(355px, 20px)";
    } else{
        showMathSymbols.style.transform = "translate(400px, 20px)";
    }
}

function compactPageButtons() {
    if (windowWidth <= 550) {
        pageButtons[0].style.transform = "translate(80px, 15px)";
        pageButtons[1].style.transform = "translate(40px, 18px)";
        pageButtons[2].style.transform = "translate(5px, 18px)";
    } else if (windowWidth <= 700) {
        pageButtons[0].style.transform = "translate(70px, 15px)";
        pageButtons[1].style.transform = "translate(15px, 18px)";
        pageButtons[2].style.transform = "translate(-20px, 18px)";
    } else {
        pageButtons[0].style.transform = "translate(280px, 25px)";
        pageButtons[1].style.transform = "translate(-275px, 27px)";
        pageButtons[2].style.transform = "translate(-310px, 27px)";
    }
}

function compactLayout_MainAppend() {
    if (windowWidth <= 850) {
        compactContainer.style.height = "50px";
        compactContainer.appendChild(showMathSymbols);
        compactContainer.appendChild(settingsIcon);
        compactContainer.appendChild(settings);
        compactContainer.appendChild(settingsHideout);
        compactContainer.appendChild(settingsMouseLeave);
    } else {
        compactContainer.style.height = "0px";
        main.appendChild(showMathSymbols);
        main.appendChild(settingsIcon);
        main.appendChild(settings);
        main.appendChild(settingsHideout);
        main.appendChild(settingsMouseLeave);
    }
    if (windowWidth <= 700) {
        for (let i = 0; i < 3; i++) {
            compactContainer.appendChild(pageButtons[i]);
        }
    } else {
        for (let i = 0; i < 3; i++) {
            main.appendChild(pageButtons[i]);
        }
    }
}

export function actionButtonsMove() {
    if (actionButtonsMoveExp === null) return;
    actionButtonsYPosition = Math.abs(actionButtonsMoveExp.getBoundingClientRect().top - main.getBoundingClientRect().top) + 13;
    actionButtonsXPosition = windowWidth <= 620 ? Math.round(main.offsetWidth / 2) - 55 : 255;
    actionButtonsMenu.style.transform = "translate(" + actionButtonsXPosition + "px, " + actionButtonsYPosition + "px)";
}

function disableTransition() {
    settings.style.transition = "none";
    mathSymbols.style.transition = "none";
    moveThroughText.style.transition = "none";
    mathSymbolsCompact1.style.transition = "none";
    mathSymbolsCompact2.style.transition = "none";
    outputBox.style.transition = "none";
}

function enableTransition() {
    setTimeout(() => {
        settings.style.transition = "transform 0.5s ease-out";
        mathSymbols.style.transition = "transform 0.5s ease-out";
        moveThroughText.style.transition = "transform 0.5s ease-out";
        mathSymbolsCompact1.style.transition = "transform 0.5s ease-out";
        mathSymbolsCompact2.style.transition = "transform 0.5s ease-out";
        outputBox.style.transition = "margin-top 0.5s ease-out";
    }, 10);
}