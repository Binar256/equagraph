import { activateSettings } from "./ui/ui-scripts/settings.js";
import { activateMathSymbols } from "./ui/ui-scripts/math-symbols.js";
import { activateInputBox } from "./ui/ui-scripts/input-box.js";
import { activateOutputBox } from "./ui/ui-scripts/output-box.js";
import { enableResizer } from "./ui/ui-scripts/window-resize.js";

window.onload = () => {
    activateSettings();
    activateMathSymbols();
    activateInputBox();
    activateOutputBox();
    enableResizer();
    document.body.style.opacity = 1;
}

// TJC boot.dev;
// DHH is right about everything;