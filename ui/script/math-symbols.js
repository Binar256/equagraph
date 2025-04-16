import { outputBox, outputBoxCentral } from "./output-box.js";
import { MQ, mathField } from "./input-box.js";
import { elementsPosition } from "./window-resize.js";

export const showMathSymbols = document.getElementById("showMathSymbols");
export const mathSymbols = document.getElementById("mathSymbols");
export const mathSymbolsCompact1 = document.getElementById("mathSymbolsCompact1");
export const mathSymbolsCompact2 = document.getElementById("mathSymbolsCompact2");
export const mathSymbolsHideout = document.getElementById("mathSymbolsHideout");
export const moveThroughText = document.getElementById("moveThroughText");

let symbolsContainer;
let buttons = [];
let elements = [];
let inputElements = [];
let moveLeft = [];

let number1 = 14;
let number2 = 17;

let symbolsCompact;
let compactSymbolsLoaded = false;
let symbolsLoaded = false;

let mouseDown = false;

let windowWidth = window.innerWidth;
const moveTTElements = ["deleteSymbol", "leftSymbol", "rightSymbol", "solve"];
const moveTT = [];
const moveTTEvents = ["Backspace", "Left", "Right", "Enter"];

const symbolsElements = [
    [" 7 ", " 8 ", " 9 ",
     " 4", " 5 ", " 6 ",
     " 1 ", " 2 ", " 3 ",
     " 0 ", " , ", " = ",
     " + ", " - ", " \\left(x\\right) ",
     " \\times ", " \\div ", " \\frac{x}{x} ",
     " 123 ", " \\sqrt[\\varphi]{\\pi^{e}} ", " f(x) "],

    [" \\left|x\\right| ", " \\% ", " i ",
     " < ", " > ", " ! ",
     " x ", " y ", " z ",
     " x^2 ", " x^3 ", " x^x ",
     " \\sqrt{x} ", " \\sqrt[3]{x} ", " \\sqrt[x]{x} ",
     " \\pi ", " e ", " \\varphi "],

    [" f(x) ", " e^x ", " 10^x ",
     " \\degree ", " \\prime ", " \\prime\\prime ",
     " \\sin(x) ", " \\cos(x) ", " \\tan(x) ",
     " \\sec(x) ", " \\csc(x) ", " \\cot(x) ",
     " \\sin^{-1}(x) ", " \\cos^{-1}(x) ", " \\tan^{-1}(x) ",
     " \\ln(x) ", " \\log(x) ", " \\log_{x}(x) "] 
]; 

const inputSymbolsElements = [
    [" 7 ", " 8 ", " 9 ",
    " 4", " 5 ", " 6 ",
    " 1 ", " 2 ", " 3 ",
    " 0 ", " , ", "=",
    " + ", " - ", "(",
    " \\times ", " \\div ", "/",
    " 123 ", " \\sqrt[\\varphi]{\\pi^{e}} ", " f(x) "],

    ["|", " \\% ", " i ",
     " < ", " > ", " ! ",
     " x ", " y ", " z ",
     " ^{2} ", " ^{3} ", "^",
     "sqrt", " \\sqrt[3]{} ", " \\sqrt[]{} ",
     " \\pi ", " e ", " \\varphi "],

    [" f\\left(\\right) ", " e^{} ", " 10^{} ",
     " \\degree ", " \\prime ", " \\prime\\prime ",
     " \\sin\\left(\\right) ", " \\cos\\left(\\right) ", " \\tan\\left(\\right) ",
     " \\sec\\left(\\right) ", " \\csc\\left(\\right) ", " \\cot\\left(\\right) ",
     " \\sin^{-1}\\left(\\right) ", " \\cos^{-1}\\left(\\right) ", " \\tan^{-1}\\left(\\right) ",
     " \\ln\\left(\\right) ", " \\log\\left(\\right) ", " \\log_{}\\left(\\right) "] 
];

const compactSymbolsElements = [
    [" 7 ", " 8 ", " 9 ", " \\left(x\\right) ", " \\frac{x}{x} ",
     " 4", " 5 ", " 6 ", " + ", " - ",
     " 1 ", " 2 ", " 3 ", " \\times ", " \\div ", 
     " 0 ", " , ", " = ", " 123 ", " \\sqrt[\\varphi]{\\pi^{e}}", " f(x) "],

    [" x ", " y ", " z ", " \\% ", " \\left|x\\right| ",
     " x^2 ", " x^3 ", " x^x ", " < ", " > ",
     " \\sqrt{x} ", " \\sqrt[3]{x} ", " \\sqrt[x]{x} ", " i ", " ! ",
     " \\pi ", " e ", " \\varphi "],

    [" \\sin(x) ", " \\cos(x) ", " \\tan(x) ", " \\degree ", " f(x) ",
     " \\sec(x) ", " \\csc(x) ", " \\cot(x) ", " \\prime ", " e^x ",
     " \\sin^{-1}(x) ", " \\cos^{-1}(x) ", " \\tan^{-1}(x) ", " \\prime\\prime ", " 10^x ",
     " \\ln(x) ", " \\log(x) ", " \\log_{x}(x) "] 
];

const inputCompactSymbolsElements = [
    [" 7 ", " 8 ", " 9 ", "(", "/",
     " 4", " 5 ", " 6 ", " + ", " - ",
     " 1 ", " 2 ", " 3 ", " \\times ", " \\div ", 
     " 0 ", " , ", "=", " 123 ", " \\sqrt[\\varphi]{\\pi^{e}} ", " f(x) "],
   
    [" x ", " y ", " z ", " \\% ", "|",
     " ^{2} ", " ^{3} ", "^", " < ", " > ",
     "sqrt", " \\sqrt[3]{} ", " \\sqrt[]{} ", " i ", " ! ",
     " \\pi ", " e ", " \\varphi "],

    [" \\sin\\left(\\right) ", " \\cos\\left(\\right) ", " \\tan\\left(\\right) ", " \\degree ", " f\\left(\\right) ",
     " \\sec\\left(\\right) ", " \\csc\\left(\\right) ", " \\cot\\left(\\right) ", " \\prime ", " e^{} ",
     " \\sin^{-1}\\left(\\right) ", " \\cos^{-1}\\left(\\right) ", " \\tan^{-1}\\left(\\right) ", " \\prime\\prime ", " 10^{} ",
     " \\ln\\left(\\right) ", " \\log\\left(\\right) ", " \\log_{}\\left(\\right) "] 
];

const symbolsButtons = [];
const compactSymbolsButtons = [];

const alternativeSymbols = [" x) ", " x\\frac{x}{x} "];
const inputAlternativeSymbols = [")", " \\frac{}{} "];

const symbolsMoveLeft = [
    [0, 0, 0,
     0, 0, 0,
     0, 0, 0,
     0, 0, -1,
     0, 0, -1,
     0, 0, -1],

    [-1, 0, 0,
     0, 0, 0,
     0, 0, 0,
     0, 0, -1,
     -1, 1, 2,
     0, 0, 0,],

    [1, 1, 1,
     0, 0, 0,
     1, 1, 1,
     1, 1, 1,
     1, 1, 1,
     1, 1, 3,],
]

const compactSymbolsMoveLeft = [
    [0, 0, 0, -1, -1,
     0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,
     0, 0, -1],
   
    [0, 0, 0, 0, -1,
     0, 0, -1, 0, 0,
     -1, 1, 2, 0, 0,
     0, 0, 0],
   
    [1, 1, 1, 0, 1,
     1, 1, 1, 0, 1,
     1, 1, 1, 0, 1,
     1, 1, 3]
]

export let showSymbols = false;
let click = 18;
let box = 0;
let moveTTTimeout;
let moveTTInterval;

let changeSymbolTimeout;
let alternativeSymbol = false;

let loaded = false;

export function activateMathSymbols() {
    if (loaded) return;
    loadShowMathSymbos();
    isCompact(true);
    loadMoveThroughText();
    loaded = true;
    window.addEventListener("resize", () => isCompact(false));
}

function loadShowMathSymbos() {
    showMathSymbols.addEventListener("click",function() {
        if (showSymbols) this.innerText = "Show symbols";
        else this.innerText = "Hide symbols";
        showSymbols = !showSymbols;
        mathSymbolsPosition();
        elementsPosition(true);
    });
}

export function mathSymbolsPosition() {
    if (symbolsCompact) {
        if (showSymbols) {
            if (windowWidth <= 550) {
                mathSymbolsCompact1.style.transform = "translate(-37px, 80px)";
                mathSymbolsCompact2.style.transform = "translate(185px, 269px)";
                moveThroughText.style.transform = "translate(184px, 70px) scale(0.9)";
            } else {
                mathSymbolsCompact1.style.transform = "translate(-41px, 90px)";
                mathSymbolsCompact2.style.transform = "translate(205px, 300px)";
                moveThroughText.style.transform = "translate(204px, 90px)";
            }
            outputBox.style.marginTop = mathSymbolsCompact1.offsetHeight + 10 + "px";
        } else {
            if (windowWidth <= 550) {
                mathSymbolsCompact1.style.transform = "translate(-37px, -172px)";
                mathSymbolsCompact2.style.transform = "translate(185px, 17px)";
                moveThroughText.style.transform = "translate(184px, -182px) scale(0.9)";
            } else {
                mathSymbolsCompact1.style.transform = "translate(-41px, -190px)";
                mathSymbolsCompact2.style.transform = "translate(205px, 20px)";
                moveThroughText.style.transform = "translate(204px, -190px)";
            }
            outputBox.style.marginTop = "0px";
        }
    } else {
        if (showSymbols) {
            mathSymbols.style.transform = "translate(453px, 62px)";
            moveThroughText.style.transform = "translate(610px, 62px)";
        } else {
            mathSymbols.style.transform = "translate(453px, -430px)";
            moveThroughText.style.transform = "translate(610px, -150px)";
        }
    } 
}

function loadMoveThroughText() {
    for (let i = 0; i < 4; i++) {
        moveTT[i] = document.getElementById(moveTTElements[i]);
        moveTT[i].addEventListener("mousedown", function(event) {
            event.preventDefault();
            this.style.backgroundColor = "var(--symbols-click-color)";
            if (i != 3) {
                mathField.keystroke(moveTTEvents[i]); 
                moveTTTimeout = setTimeout(() => {
                    moveTTInterval = setInterval(() => {
                        mathField.keystroke(moveTTEvents[i]);  
                    }, 40);  
                }, 260);
            }
        });
        moveTT[i].addEventListener("mouseup", function() {
            this.style.backgroundColor = "var(--symbols-hover-color)";
            if (i !== 3) {
                clearTimeout(moveTTTimeout);
                clearInterval(moveTTInterval);
            }
        }); 
        moveTT[i].addEventListener("mouseenter", function() {
            this.style.backgroundColor = "var(--symbols-hover-color)";
        });
        moveTT[i].addEventListener("mouseleave",  function() {
            this.style.backgroundColor = "var(--mathSymbols-color)";
            if (i !== 3) {
                clearTimeout(moveTTTimeout);
                clearInterval(moveTTInterval);
            }
        });
        if (i === 0) {
            moveTT[i].style.borderTopLeftRadius = "5px";
            moveTT[i].style.borderTopRightRadius = "5px";
        } else if (i === 3) {
            moveTT[i].style.borderBottomLeftRadius = "5px";
            moveTT[i].style.borderBottomRightRadius = "5px";
        }
    }
    moveTT[3].addEventListener("click", () => outputBoxCentral("write"))
}

function isCompact(load) {
    windowWidth = window.innerWidth;
    if (windowWidth <= 1350 && (!symbolsCompact || load)) compactSymbols();
    else if (windowWidth > 1350 && (symbolsCompact || load)) normalSymbols();

    if (windowWidth <= 1350 && !compactSymbolsLoaded) {
        compactSymbolsLoaded = true;
        loadSymbols();
        simulateSymbolsClick();
    } else if (windowWidth > 1350 && !symbolsLoaded) {
        symbolsLoaded = true;
        loadSymbols();
        simulateSymbolsClick();
    } 
    
}

function compactSymbols() {
    number1 = 3;
    number2 = 4;
    elements = compactSymbolsElements;
    inputElements = inputCompactSymbolsElements;
    moveLeft = compactSymbolsMoveLeft;
    buttons = compactSymbolsButtons;
    symbolsCompact = true;
    if (compactSymbolsLoaded) simulateSymbolsClick();
}

function normalSymbols() {
    number1 = 14;
    number2 = 17;
    elements = symbolsElements;
    inputElements = inputSymbolsElements;
    moveLeft = symbolsMoveLeft;
    buttons = symbolsButtons;
    symbolsCompact = false;
    if (symbolsLoaded) simulateSymbolsClick();
}

function simulateSymbolsClick() {
    click = 0;
    symbolClick(box + 18);
}

function loadSymbols() {
    symbolsContainer = symbolsCompact ? mathSymbolsCompact1 : mathSymbols;
    for (let i = 0; i < 21; i++) {
        if (symbolsCompact && i === 20) {
            symbolsContainer = mathSymbolsCompact2;
        }
        buttons[i] = document.createElement("button");
        buttons[i].type = "button";
        buttons[i].innerText = elements[0][i];
        symbolsContainer.appendChild(buttons[i]);
        setSymbolsBorders_Title(i);
        if (i < 18) {
            setSymbolsBackground(i);
            buttons[i].classList = "symbolsButtons buttonClass";
        } else {
            buttons[i].classList = "switchMathSymbolsButtons buttonClass";
            setSwitchSymbolsBackground(i);
        }
        if (symbolsCompact) {
            buttons[i].classList.add("compactSymbols");
        }
        MQ.StaticMath(buttons[i]); 
        buttons[i].children[1].style.pointerEvents = "none";
        buttons[i].addEventListener("click", () => symbolClick(i))
    }
    buttons[18].style.backgroundColor = "var(--primary-color)";
    assignSymbolsButtons();
}

function assignSymbolsButtons() {
    buttons.forEach((element, i) => {
        if (symbolsCompact) compactSymbolsButtons[i] = element;
        else symbolsButtons[i] = element;
    });
}

function setSymbolsBorders_Title(i) {
    if (symbolsCompact) {
        switch (i) {
            case 0: 
                buttons[i].style.borderTopLeftRadius = "5px";
                break;
            case 4:
                buttons[i].style.borderTopRightRadius= "5px";
                buttons[i].title = "Hold to write compound fraction";
                break;
            case 15:
                buttons[i].style.borderBottomLeftRadius= "5px";
                break;
            case 20:
                buttons[i].style.borderBottomRightRadius= "5px";
                buttons[i].style.borderTopRightRadius= "5px";
                break;
            case 3:
                buttons[i].title = "Hold to write right bracket";
                break;
        }  
    } else {
        switch (i) {
            case 0: 
                buttons[i].style.borderTopLeftRadius = "5px";
                break;
            case 2:
                buttons[i].style.borderTopRightRadius= "5px";
                break;
            case 18:
                buttons[i].style.borderBottomLeftRadius= "5px";
                break;
            case 20:
                buttons[i].style.borderBottomRightRadius= "5px";
                break;
            case 14:
                buttons[i].title = "Hold to write right bracket";
                break;
            case 17:
                buttons[i].title = "Hold to write compound fraction";
                break;
        }
    }
} 


function setSymbolsBackground(symbol) {
    buttons[symbol].addEventListener("mousedown", function() {
        this.style.backgroundColor = "var(--symbols-click-color)";
        if (symbol === number1 || symbol === number2) changeSymbol(symbol);
    });
    buttons[symbol].addEventListener("mouseup", function() {
        this.style.backgroundColor = "var(--symbols-hover-color)";
        if (symbol === number1 || symbol === number2) clearTimeout(changeSymbolTimeout)
    });
    buttons[symbol].addEventListener("mouseenter", function() {
        this.style.backgroundColor = "var(--symbols-hover-color)";
    });
    buttons[symbol].addEventListener("mouseleave", function() {
        this.style.backgroundColor = "var(--mathSymbols-color)";
        if (symbol === number1 || symbol === number2) resetSymbol(symbol); 
    });
}

function setSwitchSymbolsBackground(symbol) {
    buttons[symbol].addEventListener("mouseenter", function() {
        if (symbol != click) this.style.backgroundColor = "var(--switchSymbols-hover-color)";
    });
    buttons[symbol].addEventListener("mouseleave", function() {
        if (symbol != click) this.style.backgroundColor = "var(--switchSymbols-color)";
    });
    buttons[symbol].addEventListener("mousedown", function() {
        if (symbol != click) this.style.backgroundColor = "var(--switchSymbols-click-color)";
    });
}

function symbolClick(symbol) {
    if (symbol > 17 && click != symbol) {
        loadNewSymbols(symbol - 18);  
        buttons[symbol].style.backgroundColor = "var(--primary-color)";
        click = symbol;
        box = symbol - 18
        for (let i = 18; i < 21; i++) {
            if (i != symbol) {
                buttons[i].style.backgroundColor = "var(--switchSymbols-color)";
            } 
        }
    } else if (symbol < 18) {
        if (moveLeft[box][symbol] === -1) {  
            if (alternativeSymbol) {
                writeAlterantiveSymbols(symbol);
            } else {
                mathField.cmd(inputElements[box][symbol]);
            }
        } else {
            mathField.write(inputElements[box][symbol]);
            moveCursor(moveLeft[box][symbol]);
        }
    }
}

function changeSymbol(symbol) {
    if (box === 0) {
        changeSymbolTimeout = setTimeout(() => {
            if (symbol === number1) {
                buttons[symbol].innerText = alternativeSymbols[0];
                MQ.StaticMath(buttons[symbol]);
            } else if (symbol === number2) {
                buttons[symbol].innerText = alternativeSymbols[1];
                MQ.StaticMath(buttons[symbol]);
            }
            buttons[symbol].style.outline = "2px solid var(--primary-adapt-color)";
            alternativeSymbol = true;
        }, 300)
    }
}

function resetSymbol(symbol) {
    if (box === 0) {
        clearTimeout(changeSymbolTimeout);
        if ((symbol === number1 || symbol === number2) && alternativeSymbol) {
            buttons[symbol].innerText = elements[0][symbol];
            MQ.StaticMath(buttons[symbol]);
            buttons[symbol].children[1].style.pointerEvents = "none";
            alternativeSymbol = false;
        } 
        buttons[symbol].style.outline = "none";
    }
}

function writeAlterantiveSymbols(symbol) {
    if (symbol === number1) {
        mathField.cmd(inputAlternativeSymbols[0]);
    } else if (symbol === number2) {
        mathField.write(inputAlternativeSymbols[1]);
        mathField.keystroke("Left");
        mathField.keystroke("Left");
    } 
    resetSymbol(symbol);
}

function moveCursor(symbolMove) {
    for (let i = symbolMove; i > 0; i--) {
        mathField.keystroke("Left");
    }
}

function loadNewSymbols(box) {
    for (let i = 0; i < 18; i++) {
        buttons[i].innerText= elements[box][i];
        if (box === 0) {
            if (i === number1) {
                buttons[i].title = "Hold to write right bracket";
            }
            if (i === number2) {
                buttons[i].title = "Hold to write compound fraction";
            }
        } else {
            if (i === number1 || i === number2) {
                buttons[i].title = "";
            }
        }
        MQ.StaticMath(buttons[i]);  
        buttons[i].children[1].style.pointerEvents = "none";
    }
}
