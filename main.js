import { activateSettings } from "./ui/script/settings.js";
import { activateMathSymbols } from "./ui/script/math-symbols.js";
import { activateInputBox } from "./ui/script/input-box.js";
import { activateOutputBox } from "./ui/script/output-box.js";
import { enableResizer } from "./ui/script/window-resize.js";

if (window.matchMedia("(prefers-color-scheme: light)").matches) document.documentElement.dataset.theme = "light";

window.onload = () => {
    activateSettings();
    activateMathSymbols();
    activateInputBox();
    activateOutputBox();
    enableResizer();
    document.documentElement.style.opacity = 1;
}

// TJC boot.dev;
// DHH is right about everything;