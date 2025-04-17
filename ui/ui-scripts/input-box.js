import { mathSymbolsCompact1, mathSymbolsCompact2 } from "./math-symbols.js";
import { outputBox, outputBoxCentral, moveThroughExpHistory, outputLenght } from "./output-box.js";
import { compactContainer, elementsPosition } from "./window-resize.js";

export let MQ = MathQuill.getInterface(2); 
export let mathField;
export let input = "";
export const inputBox = document.getElementById("inputBox");
const inputBoxPlaceholder = document.getElementById("inputBoxPlaceholder");
const clearInputButton = document.getElementById("clearInputButton")
const messageBox = document.getElementById("messageBox");
const copyMessageBox = document.getElementById("copyMessageBox");

const inputBoxFocusElementsMousedown = ["#inputBox", "#clearInputButton", ".pageButtons", ".symbolsButtons", ".moveTT"];

let messageTimeout;
let messageTransitionTimeout;
let showMessage;
let messageShowPosition;
let messageHidePosition;

let copyMessageBoxAnimationTm;
let copyMessageBoxTm;

let focus = false;
export const safetyInputLimit = 1000;
const maxInputLenght = safetyInputLimit + 100;
export const outputLimit = 1_000_000;

let loaded = false;

export function activateInputBox() {
    if (loaded) return;
    loadInputBox();
    loaded = true
}   

function loadInputBox() {
    mathField = MQ.MathField(inputBox, {
        supSubsRequireOperand: true,
        restrictMismatchedBrackets: true,
        autoCommands: "times cdot div frac pi varphi sqrt degree prime le ge pm",
        autoOperatorNames: "sin cos tan sec csc cot arcsin arccos arctan ln log",
        handlers: {
            edit: () => {
                input = mathField.latex();
                inputLimitCheck();
                inputBoxPlaceholder.innerText = input === "" ? "Enter a mathematical expression" : "";
            }
        }
    });
    inputBox.appendChild(clearInputButton);
    clearInputButton.style.visibility = "visible"; 

    clearInputButton.addEventListener("click", () => mathField.latex(""));
    clearInputButton.addEventListener("mousedown", function(event) {
        event.stopPropagation();
        event.preventDefault();
        inputBoxFocus(true);
        this.style.backgroundColor = "var(--symbols-click-color)";
    });
    clearInputButton.addEventListener("mouseup", function() {
        this.style.backgroundColor = "var(--mathSymbols-color)";
    });
    clearInputButton.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "var(--mathSymbols-color)";
    });

    mathField.el().addEventListener("keydown", event => {
        if (event.key === "\\") message(0);
        else if (event.key === " ") outputBoxCentral("add");
        else if (event.shiftKey && event.key === "Enter") outputBoxCentral("store"); 
        else if (event.key === "Enter") outputBoxCentral("write");
        else if (event.shiftKey && (event.key === "Backspace" || event.key === "Delete")) mathField.latex("");
        else if (event.key === "W") {
            event.preventDefault();
            moveThroughExpHistory(true);
        } 
        else if (event.key === "S") {
            event.preventDefault();
            moveThroughExpHistory(false);
        }
    }); 

    mathField.el().addEventListener("dblclick", (event) => copiedLatex(mathField, event))

    inputBox.firstChild.firstChild.addEventListener("focus", () => inputBoxFocus(true));
    inputBox.firstChild.firstChild.addEventListener("blur", () => inputBoxFocus(false));
    inputBox.firstChild.firstChild.addEventListener("keydown", event => {
        if ((event.ctrlKey || event.metaKey) && event.key === "a") event.stopPropagation();  
    });

    inputBox.firstChild.firstChild.addEventListener("paste", event => {
        let inputLenght = event.clipboardData.getData("text").length + input.length;
        if (inputLenght > safetyInputLimit) {
            event.preventDefault();
            message(4, true, 600, inputLenght, 1_000_000);
        }
    })

    document.body.addEventListener("keydown", event => {
        hideCopyMessage();
        if (event.key === "Tab") {
            event.preventDefault();
            inputBoxFocus(true);
        } 
        else if (event.key === "Escape") inputBoxFocus(false);
        else if (((event.ctrlKey || event.metaKey) && event.key === "v" && !focus)) event.preventDefault(); 
    });

    document.body.addEventListener("mousedown", (event) => {
        if (inputBoxFocusElementsMousedown.some(element => event.target.closest(element))) inputBoxFocus(true);
        if (event.target.closest("#copyMessageBox")) event.preventDefault();
    });   
    document.body.addEventListener("mouseup", (event) => {
        if (inputBoxFocusElementsMousedown.some(element => event.target.closest(element))) inputBoxFocus(true);
    });    

    document.body.addEventListener("click", event => {
        if (event.target.closest("#editButton")) inputBoxFocus(true);
        hideCopyMessage()
    });     
} 

function inputLimitCheck() {
    if (input.length >= maxInputLenght) {
        message(3, true, 550, input.length);
        clearInput();
    } 
    else if (input.length > safetyInputLimit) message(2, true, 600, input.length);
    else if (input.length >= safetyInputLimit) message(1, true); 
}

function clearInput() {
    inputBox.style.visibility = "hidden";
    setTimeout(() => {
        mathField.latex("");
        inputBox.style.visibility = "visible";
    }, 10);
}

export function message(textId, focus, cut, variable, exception) {
    inputBoxFocus(focus);
    clearTimeout(messageTimeout);
    clearTimeout(messageTransitionTimeout);
    cut = variable >= exception || cut; 
    messageBox.innerText = cut === true || window.innerWidth <= cut ? getMessage(variable)[textId] : getMessage(variable)[textId].replace("\n", " ");
    if (!showMessage) messageBox.style.transition = "transform 0.2s ease-out";
    showMessage = true;
    messageBox.style.visibility = "visible";
    messageBox.style.transform = "translateY(" + messageShowPosition + ")";
    messageTransitionTimeout = setTimeout(() => {
        messageBox.style.transition = "none";
    }, 200)
    messageTimeout = setTimeout(() => {
        showMessage = false;
        messageBox.style.visibility = "hidden";
        messageBox.style.transform = "translateY(" + messageHidePosition + ")";
    }, 2000);
}


function getMessage(length) {
    return [
        "Commands via \\ are disabled",
        "Input limit reached",
        "Input limit exceeded by " + (length - safetyInputLimit) + " characters,\ninput may be deleted",
        "Input cleared - limit exceeded\nby " + (length - safetyInputLimit) + " characters",
        "Pasting text would exceed input limit\nby " + (length - safetyInputLimit) + " characters",
        "Input limit exceeded " + (length - safetyInputLimit) + " characters",
        "Expressions limit exceeded by " + (outputLenght - outputLimit) + "\ncharacters, input is temporarily disabled"
    ]
}

export function copiedLatex(text, event) {
    if (text.latex() === "") return;
    clearTimeout(copyMessageBoxAnimationTm);
    clearTimeout(copyMessageBoxTm);
    navigator.clipboard.writeText(text.latex());
    let x = event.pageX - Math.round(window.innerWidth / 2);
    let y = event.pageY - header.offsetHeight - compactContainer.offsetHeight + 1;
    copyMessageBox.style.transition = "none";
    copyMessageBox.style.maxWidth = "0px";
    copyMessageBox.style.padding = "0px";
    copyMessageBox.style.transform = "translate(" + x + "px, " + y + "px)";
    copyMessageBoxAnimationTm = setTimeout(() => {
        copyMessageBox.style.transition = "max-width 0.2s ease-in-out, padding 0.2s ease-in-out";
        copyMessageBox.style.maxWidth = "170px";
        copyMessageBox.style.padding = "7px";
    }, 10);
    copyMessageBoxTm = setTimeout(hideCopyMessage, 1000);
}

export function hideCopyMessage() {
    copyMessageBox.style.transition = "none";
    copyMessageBox.style.maxWidth = "0px";
    copyMessageBox.style.padding = "0px";
}

export function inputBoxFocus(active) {
    focus = active;
    if (active) {
        mathField.focus();
        inputBoxPlaceholder.style.border = "1px solid var(--primary-color)";
        inputBoxPlaceholder.style.outline = "2px solid var(--primary-color-light)";
    } else {
        mathField.blur();
        inputBoxPlaceholder.style.border = "1px solid var(--text-color)";
        inputBoxPlaceholder.style.outline = "none";
    }
}

const inputBoxResizeObserver = new ResizeObserver(() => {
    elementsPosition(false);
    const height = inputBox.offsetHeight;
    inputBoxPlaceholder.style.height = height + "px";
    const outputBoxPosition = height + 50;
    outputBox.style.transform = "translateY(" + outputBoxPosition + "px)";
    if (window.innerWidth <= 1350) {
        const compactMathSymbolsTop = height - 50 + "px";
        mathSymbolsHideout.style.top = compactMathSymbolsTop;
        moveThroughText.style.top = compactMathSymbolsTop;
        mathSymbolsCompact1.style.top = compactMathSymbolsTop;
        mathSymbolsCompact2.style.top = compactMathSymbolsTop;
    } 

    messageShowPosition = height + 50 + "px";
    messageHidePosition = height - 30 + "px";
    if (showMessage) {
        messageBox.style.transform = "translateY(" + messageShowPosition + ")";
    } else if (!showMessage) {
        messageBox.style.transform = "translateY(" + messageHidePosition + ")";
    }
});
inputBoxResizeObserver.observe(inputBox);