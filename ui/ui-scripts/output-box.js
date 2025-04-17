import { input, MQ, mathField, copiedLatex, safetyInputLimit, outputLimit, message } from "./input-box.js";
import { elementsPosition, actionButtonsMove } from "./window-resize.js";

export const outputBox = document.getElementById("outputBox");
export const actionButtonsMenu = document.getElementById("actionButtonsMenu");
const invalidInputBox = document.getElementById("invalidInputBox");

const actionButtonsElements = ["editButton", "removeButton", "deleteButton"];
const actionButtons = [];
const pageButtonsElements = ["addButton", "upButton", "downButton"];
export const pageButtons = [];

let pageButtonsTimeout;
let pageButtonsInterval;
let pageButtonsTmTriggered = false;
let addButtonTm;

let actionButtonsMenuTm;
export let actionButtonsMoveExp = null;

let output;
let lastInput;

const exp = [];
let currentExp = 0;
let expCount = 0;
let pressedExpId = 0;
let pressedExpCountId = 0;
let expAmount = 0;

let newExp = false;
let storeAvailable = false;

const expInputHistory = [];
let expHistoryPosition = 0;

export let outputLenght = 0;

let loaded = false;

export function activateOutputBox() {
    if (loaded) return;
    loadActionButtons();
    loadPageButtons();
    loaded = true;
}

function loadActionButtons() {
    for (let i = 0; i < 3; i++) {
        actionButtons[i] = document.getElementById(actionButtonsElements[i]);
        actionButtons[i].addEventListener("mousedown", function() {
            this.style.backgroundColor = "var(--symbols-click-color)";
        });
        actionButtons[i].addEventListener("mouseup", function() {
            this.style.backgroundColor = "var(--symbols-hover-color)";
        });
        actionButtons[i].addEventListener("mouseenter", function() {
            this.style.backgroundColor = "var(--symbols-hover-color)";
        });
        actionButtons[i].addEventListener("mouseleave", function() {
            this.style.backgroundColor = "var(--mathSymbols-color)";
        });
        actionButtons[i].addEventListener("click", function() {
            actionButtonsClick(actionButtonsElements[i]);
        });
        if (i === 0) {
            actionButtons[i].style.borderTopLeftRadius = "5px";
            actionButtons[i].style.borderTopRightRadius = "5px";
        } else if (i === 2) {
            actionButtons[i].style.borderBottomLeftRadius = "5px";
            actionButtons[i].style.borderBottomRightRadius = "5px";
        }
    }

    document.body.addEventListener("click", event => {
        if (!event.target.closest('.expButtons')) hideActionButtons();
    });

    document.body.addEventListener("keydown", event => {
        hideActionButtons();
        if (event.key === " ") {
            event.preventDefault();
        }
    })
}

function hideActionButtons() {
    clearTimeout(actionButtonsMenuTm)
    actionButtonsMenu.style.transition = "none";
    actionButtonsMenu.style.maxHeight = "0px";
    actionButtonsMoveExp = null;
}

function loadPageButtons() {
    for (let i = 0; i < 3; i++) {
        pageButtons[i] = document.getElementById(pageButtonsElements[i]);
        pageButtons[i].addEventListener("mousedown", function(event) {
            event.preventDefault();
            if (i != 0) {
                pageButtonsTimeout = setTimeout(() => {
                    pageButtonsTmTriggered = true;
                    pageButtonsInterval = setInterval(() => {
                        pageButtonsSwitch(i);
                    }, 100)
                }, 200)
            } else {
                addButtonTm = setTimeout(() => {
                    pageButtonsTmTriggered = true;
                    this.style.outline = "2px solid var(--primary-adapt-color)";
                    outputBoxCentral("store");
                }, 300)
            }
            this.style.backgroundColor = "var(--page-buttons-click-color)"
        })
        pageButtons[i].addEventListener("mouseup", function() {
            if (i === 0) {
                this.style.outline = "none";
            } 
            this.style.backgroundColor = "var(--page-buttons-hover-color)";
            clearTimeout(pageButtonsTimeout);
            clearTimeout(addButtonTm);
            clearInterval(pageButtonsInterval);
            if (!pageButtonsTmTriggered) {
                pageButtonsSwitch(i);
            } else {
                pageButtonsTmTriggered = false;
            }
        })
        pageButtons[i].addEventListener("mouseenter", function() {
            this.style.backgroundColor = "var(--page-buttons-hover-color)";
        })
        pageButtons[i].addEventListener("mouseleave", function() {
            if (i === 0) {
                this.style.outline = "none";
            } 
            this.style.backgroundColor = "var(--page-color)";
            clearTimeout(pageButtonsTimeout);
            clearTimeout(addButtonTm);
            clearInterval(pageButtonsInterval);
        })
    }
}

function pageButtonsSwitch(button) {
    switch(button) {
        case 0: 
            outputBoxCentral("add");
            break;
        case 1:
            moveThroughExpHistory(true);
            break;
        case 2:
            moveThroughExpHistory(false);
            break;
    }
}

export function outputBoxCentral(command, passCheck) {
    // when you add exp solver, change every output variable to array
    if (!loaded || !checkLimits(passCheck)) return;
    if (exp[currentExp] === undefined) {
        if (input === "") return;
        defineExp();
    }
    if (input == "Invalid") {
        invalidInput();
        return
    } 
    else invalidInputBox.style.display = "none";
    switch (command) {
        case "write":
            writeExp();
            break;
        case "add":
            writeExp("check");
            addExp();
            break;
        case "store":
            writeExp();
            addExp("store");
            storeExp();
            break;
    }
}

function checkLimits(passCheck) {
    if (passCheck) return true;
    if (input.length > safetyInputLimit) {
        message(5, true, false, input.length);
        return false;
    }
    else if (outputLenght > outputLimit) {
        message(6, true, true);
        return false
    } else return true;
}

function invalidInput() {
    invalidInputBox.style.display = "block";
    outputBox.prepend(invalidInputBox);
}

function defineExp() {
    exp[currentExp] = {
        expressions: [],
        expCalc: "",
        expressionsLenght: 0,
        expHistory: [],
        expCalcHistory: [],
        div: document.createElement("div"),
            expContainer: document.createElement("div"),
                expDiv: [],
            expCalcContainer: document.createElement("div"),
                expCalcDiv: [],
            separator: document.createElement("div"),
            collapseButton: null,
            collapseButtonTm: null,
            collapseButtonIv: null,
            buttons: []
    };
    outputBox.prepend(exp[currentExp].div);
    exp[currentExp].div.classList = "relative div";
    exp[currentExp].div.appendChild(exp[currentExp].expContainer);
    exp[currentExp].expContainer.className = "relative";
    exp[currentExp].div.appendChild(exp[currentExp].expCalcContainer);
    exp[currentExp].expCalcContainer.className = "expCalcContainer";
    exp[currentExp].div.prepend(exp[currentExp].separator);
    exp[currentExp].separator.className = "separator";
}

function writeExp(command) {
    if (command === "check" && input === "") {
        return;
    }
    if (lastInput !== input || newExp) {
        if (newExp) {
            newExp = false;
        }
        if (exp[currentExp].expContainer.childNodes.length < 1 && input == "") storeAvailable = false;
        else storeAvailable = true;
        
        output = input
        lastInput = input;

        outputLenght -= exp[currentExp].expCalc.length;
        exp[currentExp].expCalc = output;
        outputLenght += exp[currentExp].expCalc.length;

        exp[currentExp].expCalcContainer.querySelectorAll(".exp").forEach(child => child.remove());
        exp[currentExp].expCalcDiv.length = 0;

        if (input !== "") { 
            exp[currentExp].expHistory.push(input);
            exp[currentExp].expCalcHistory.push(output);
            if (expInputHistory.at(-1) !== input) expInputHistory.push(input);
            expHistoryPosition = expInputHistory.length - 1;
        }

        const arrLength = exp[currentExp].expCalc.length;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < arrLength; i++) {
            exp[currentExp].expCalcDiv[i] = document.createElement("div");
            exp[currentExp].expCalcDiv[i].innerText = exp[currentExp].expCalc[i];
            exp[currentExp].expCalcDiv[i].className = "exp";
            fragment.appendChild(exp[currentExp].expCalcDiv[i]);
            const text = MQ.StaticMath(exp[currentExp].expCalcDiv[i]);
            exp[currentExp].expCalcDiv[i].addEventListener("dblclick", (event) => copiedLatex(text, event))
            exp[currentExp].expCalcDiv[i].children[1].addEventListener("mousedown", event => event.stopPropagation());
        }
        exp[currentExp].expCalcContainer.appendChild(fragment);
    }
}   

function addExp(command) {
    if (input !== "") {
        exp[currentExp].expressions[expCount] = input;
        outputLenght += exp[currentExp].expressions[expCount].length;
        exp[currentExp].expressionsLenght += exp[currentExp].expressions[expCount].length;

        expHistoryPosition = expInputHistory.length;
        exp[currentExp].expDiv[expCount] = document.createElement("div");
        exp[currentExp].expDiv[expCount].classList = "exp expDiv";
        exp[currentExp].expDiv[expCount].style.display = "block";
        exp[currentExp].expDiv[expCount].innerText = input;
        exp[currentExp].expContainer.prepend(exp[currentExp].expDiv[expCount]);
        const text = MQ.StaticMath(exp[currentExp].expDiv[expCount]);
        exp[currentExp].expDiv[expCount].addEventListener("dblclick", (event) => {
            if (!event.target.closest('.expButtons')) copiedLatex(text, event);
        });
        exp[currentExp].expDiv[expCount].children[1].addEventListener("mousedown", event => event.stopPropagation());
        if (command !== "store") {
            exp[currentExp].expDiv[expCount].classList.add("expDivHidden");
            setTimeout(((expId, expCountId) => {
                return () => {
                    exp[expId].expDiv[expCountId].style.maxHeight = exp[expId].expDiv[expCountId].scrollHeight + "px";
                    exp[expId].expDiv[expCountId].style.marginBottom = "4px";
                };
            })(currentExp, expCount), 10);
        } else {
            exp[currentExp].expDiv[expCount].style.maxHeight = exp[currentExp].expDiv[expCount].scrollHeight + "px";
            exp[currentExp].expDiv[expCount].style.marginBottom = "4px";
        }
        createExpButtons();
        expCount++;
        newExp = true;
        mathField.latex(""); 
    }
}

function storeExp() {
    if (input !== "" || storeAvailable) {
        expHistoryPosition = expInputHistory.length;
        storeAvailable = false;
        exp[currentExp].div.prepend(exp[currentExp].separator);
        setTimeout((expId => {
            return () => {
                exp[expId].separator.classList.add("separatorVisible");
            };
        })(currentExp), 10);
        createCollapseButton();
        if (exp[expAmount] !== undefined) {
            expAmount++
        }
        currentExp = expAmount;
        expCount = 0; 
        newExp = true;
        mathField.latex("");
    }
}

function createCollapseButton() {
    if (exp[currentExp].collapseButton === null) {
        exp[currentExp].collapseButton = document.createElement("button");
        exp[currentExp].collapseButton.type = "button";
        exp[currentExp].collapseButton.innerText = "Collapse";
        exp[currentExp].collapseButton.classList = "collapseButton buttonClass";
        exp[currentExp].expContainer.appendChild(exp[currentExp].collapseButton);
        exp[currentExp].collapseButton.style.bottom = -exp[currentExp].expCalcContainer.scrollHeight + "px";
        exp[currentExp].expCalcContainer.style.maxHeight = exp[currentExp].expCalcContainer.offsetHeight + "px";
        exp[currentExp].collapseButton.addEventListener("click", ((expId) => {
            return () => {
                clearTimeout(exp[expId].collapseButtonTm);
                clearInterval(exp[expId].collapseButtonIv); 
                if (exp[expId].collapseButton.innerText === "Collapse") {
                    exp[expId].expCalcContainer.style.maxHeight = "0px";
                    exp[expId].collapseButton.innerText = "Expand";
                    exp[expId].collapseButton.style.bottom = "-10px";
                } else if ( exp[expId].collapseButton.innerText === "Expand") {    
                    exp[expId].expCalcContainer.style.maxHeight = exp[expId].expCalcContainer.scrollHeight + "px";
                    exp[expId].collapseButton.innerText = "Collapse";
                    exp[expId].collapseButtonIv = setInterval(() => {
                        if (exp[expId].expCalcContainer.scrollHeight === exp[expId].expCalcContainer.offsetHeight) {
                            exp[expId].collapseButton.style.bottom = -exp[expId].expCalcContainer.scrollHeight + "px";
                            clearInterval(exp[expId].collapseButtonIv)
                        } 
                    }, 10)
                    exp[expId].collapseButtonTm = setTimeout(() => {
                        exp[expId].collapseButton.style.bottom = -exp[expId].expCalcContainer.scrollHeight + "px";
                        clearInterval(exp[expId].collapseButtonIv)
                    }, 500)
                }
            }
        })(currentExp));
         

    } else {
        exp[currentExp].collapseButton.style.display = "block";
        exp[currentExp].expCalcContainer.style.maxHeight = exp[currentExp].expCalcContainer.scrollHeight + "px";
        exp[currentExp].collapseButton.innerText = "Collapse";
        exp[currentExp].collapseButton.style.bottom = -exp[currentExp].expCalcContainer.scrollHeight + "px";
        exp[currentExp].expContainer.appendChild(exp[currentExp].collapseButton);
    }
}

function createExpButtons() {
    if (exp[currentExp].buttons[expCount] === undefined) {
        exp[currentExp].buttons[expCount] = document.createElement("button");
        exp[currentExp].expDiv[expCount].type = "button";
        exp[currentExp].expDiv[expCount].appendChild(exp[currentExp].buttons[expCount]);
        exp[currentExp].buttons[expCount].classList = "expButtons buttonClass";
        for (let i = 0; i < 3; i++) {
            const button = document.createElement("div");
            button.className = "dot";
            exp[currentExp].buttons[expCount].appendChild(button);
        }
        const expId = currentExp;
        const expCountId = expCount;
        exp[currentExp].buttons[expCount].addEventListener("mousedown", event => event.stopPropagation());
        exp[expId].buttons[expCountId].addEventListener("click", function() {
            clearTimeout(actionButtonsMenuTm);
            actionButtonsMenu.style.maxHeight = "0px";
            actionButtonsMenu.style.transition = "none";
            actionButtonsMoveExp = exp[expId].buttons[expCountId];
            actionButtonsMove();
            actionButtonsMenuTm = setTimeout(() => {
                actionButtonsMenu.style.transition = "max-height 0.3s ease-out";
                actionButtonsMenu.style.maxHeight = "120px";
            }, 10);
            pressedExpId = expId;
            pressedExpCountId = expCountId;
        });
        exp[expId].buttons[expCountId].addEventListener("mousedown", function() {
            for (let i = 0; i < 3; i++) {
                this.children[i].style.backgroundColor = "var(--dots-click-color)";
            }
        });
        exp[expId].buttons[expCountId].addEventListener("mouseup", function() {
            for (let i = 0; i < 3; i++) {
                this.children[i].style.backgroundColor = "var(--text-color)";
            }
        });
        exp[expId].buttons[expCountId].addEventListener("mouseleave", function() {
            for (let i = 0; i < 3; i++) {
                this.children[i].style.backgroundColor = "var(--text-color)";
            }
        });
    }
}

function actionButtonsClick(button) {
    if (input == "Invalid") {
        mathField.latex("");
    }
    if (exp[pressedExpId] === undefined) {
        return;
    }
    switch(button) {
        case "editButton":
            editExp();
            break;
        case "removeButton":
            removeExp();
            break;
        case "deleteButton":
            deleteExp();
            break;
    }
}

function editExp() {
    outputLenght -= exp[pressedExpId].expressions[pressedExpCountId].length;
    exp[pressedExpId].expressionsLenght -= exp[pressedExpId].expressions[pressedExpCountId].length;
    exp[pressedExpId].expDiv[pressedExpCountId].remove();
    if (currentExp === pressedExpId) {
        outputBoxCentral("add", true);
    } else {
        outputBoxCentral("store", true);
        outputBox.prepend(exp[pressedExpId].div);
        exp[pressedExpId].div.style.overflow = "hidden";
        exp[pressedExpId].div.style.maxHeight = "0px"; 
        exp[pressedExpId].expCalcContainer.style.maxHeight = "none";
        exp[pressedExpId].collapseButton.style.display = "none";
        exp[pressedExpId].separator.classList.remove("separatorVisible");
        currentExp = pressedExpId;
        ((expId) => {
            setTimeout(() => {
                exp[expId].div.style.maxHeight = exp[expId].div.scrollHeight + "px";
            }, 10);
            setTimeout(() => {
                exp[expId].div.style.maxHeight = "none";
                exp[expId].div.style.overflow = "visible";
            }, 500);
        })(pressedExpId);
    }
    newExp = true;
    mathField.latex(exp[currentExp].expressions[pressedExpCountId]);
    expCount = exp[currentExp].expressions.length;
}

function removeExp() {
    const expContainerChildren = Array.from(exp[pressedExpId].expContainer.childNodes).filter(node => {
        return getComputedStyle(node).pointerEvents !== "none";
    });        
    if (expContainerChildren.length < 3 && currentExp !== pressedExpId) {
        deleteExp();
        return;
    }
    outputLenght -= exp[pressedExpId].expressions[pressedExpCountId].length;
    exp[pressedExpId].expressionsLenght -= exp[pressedExpId].expressions[pressedExpCountId].length;

    exp[pressedExpId].expDiv[pressedExpCountId].style.pointerEvents = "none";
    exp[pressedExpId].expDiv[pressedExpCountId].style.maxHeight = "0px";
    exp[pressedExpId].expDiv[pressedExpCountId].style.marginBottom = "0px";
    setTimeout(((expId, expCountId) => {
        return () => {
            exp[expId].expDiv[expCountId].remove();
            checkExp(expId);
        };
    })(pressedExpId, pressedExpCountId), 500)
}

function checkExp(expId) {
    const savedCurrentExp = currentExp;
    currentExp = expId;
    outputBoxCentral("write", true);
    currentExp = savedCurrentExp;
    if (currentExp !== expId && exp[expId].collapseButton.innerText === "Collapse") {
        exp[expId].expCalcContainer.style.maxHeight = "none";
        exp[expId].collapseButton.style.bottom = -exp[expId].expCalcContainer.scrollHeight + "px";
        setTimeout(() => {
            exp[expId].expCalcContainer.style.maxHeight = exp[expId].expCalcContainer.scrollHeight + "px";
        }, 10)
    } 
    newExp = true;
}

function deleteExp() {
    if (currentExp !== pressedExpId) {
        outputLenght -= exp[pressedExpId].expCalc.length;
        outputLenght -= exp[pressedExpId].expressionsLenght;
        exp[pressedExpId].expressionsLenght = 0;

        exp[pressedExpId].div.style.overflow = "hidden";
        exp[pressedExpId].div.style.maxHeight = exp[pressedExpId].div.offsetHeight + "px";
        exp[pressedExpId].div.style.pointerEvents = "none";
        ((expId) => {
            setTimeout(() => {
                exp[expId].div.style.maxHeight = "0px";
            }, 10);
            setTimeout(() => {
                exp[expId].div.remove();
            }, 500);
        })(pressedExpId);
    } else {
        exp[pressedExpId].expDiv.forEach(element => {
            element.remove();
        });
        outputLenght -= exp[pressedExpId].expressionsLenght;
        exp[pressedExpId].expressionsLenght = 0;
        outputBoxCentral("write", true);
    }
}

export function moveThroughExpHistory(older) {
    if (older && expHistoryPosition > 0) {
        expHistoryPosition--;
        mathField.latex(expInputHistory[expHistoryPosition]);
    } else if (!older && expHistoryPosition < expInputHistory.length -1) {
        expHistoryPosition++;
        mathField.latex(expInputHistory[expHistoryPosition]);
    }
}

const outputBoxResizeObserver = new ResizeObserver(() => {
    elementsPosition();
})

outputBoxResizeObserver.observe(outputBox);