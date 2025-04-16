const cmd = {};
const command = {};
const commandsList = ["list", "clear", "history"];
const commandObjects = [cmd, command];
let cmdExecuted = false;

// commnads

    commandObjects.forEach((obj) => {
        commandsList.forEach((command) => {
            Object.defineProperty(obj, command, {
                get: function() {
                    commandHandler(command);
                    if (cmdExecuted) {
                        cmdExecuted = false;
                        return "Command executed";
                    } else {
                        return "Command failed to execute";
                    }
                }
            });
        });
    });
    
    function commandHandler(command) {
        switch (command) {
            case "list":
                getCommandsList();
                break;
            case "clear":
                clearOutputBox_History();
                break;
            case "history":
                showExpHistory();
                break;
        }
    }

    function getCommandsList() {
        console.log("Commands: " + commandsList.join(", "));
        cmdExecuted = true;
    }

    function clearOutputBox_History() {
        outputBox.innerHTML = "";
        exp.length = 0;
        currentExp = 0;
        expCount = 0;
        pressedExpId = 0;
        pressedExpCountId = 0;
        expAmount = 0;
        newExp = false;
        storeAvailable = false;
        expInputHistory.length = 0
        expHistoryPosition = 0;
        lastInput = "";

        cmdExecuted = true;
    }

    function showExpHistory() {
        for (let expression = 0; expression < exp.length; expression++) {
            console.log("Expression: " + expression)
            for (let i = 0; i < exp[expression].expHistory.length; i++) {
                console.log(exp[expression].expHistory[i])
                console.log(exp[expression].expCalcHistory[i]);
                console.log()
            }
        }
        cmdExecuted = true;
    }
    