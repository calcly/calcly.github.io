const display = document.getElementById("display");
const history = document.getElementById("history");
const clearHistory = document.getElementById("clear-history");
const copyButton = document.getElementById("copy-button");

const clock = document.getElementById("clock");

function updateClock() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}

updateClock();
setInterval(updateClock, 1000);

const buttons = document.querySelectorAll(".calculator .buttons button");

clearHistory.addEventListener("click", function() {
    const historyItems = history.querySelectorAll(".history-item");

    historyItems.forEach(function(item) {
        item.remove();
    });
});

copyButton.addEventListener("click", function() {
    navigator.clipboard.writeText(display.textContent);
});

let currentNumber = "";
let firstNumber = "";
let operator = "";

buttons.forEach(function(button) {
    button.addEventListener("click", function() {

        const value = button.textContent;

        if (value >= "0" && value <= "9") {
            currentNumber = currentNumber + value;

            if (operator === "") {
                display.textContent = currentNumber;
            } else {
                display.textContent = firstNumber + " " + operator + " " + currentNumber;
            }
        }

        if (value === ".") {
            if (!currentNumber.includes(".")) {

                if (currentNumber === "") {
                    currentNumber = "0.";
                } else {
                    currentNumber = currentNumber + ".";
                }

                if (operator === "") {
                    display.textContent = currentNumber;
                } else {
                    display.textContent = firstNumber + " " + operator + " " + currentNumber;
                }
            }
        }

        if (value === "+" || value === "-" || value === "*" || value === "/") {

            if (value === "-" && currentNumber === "" && firstNumber === "" && operator === "") {
                currentNumber = "-";
                display.textContent = currentNumber;
                return;
            }

            if (currentNumber !== "") {
                firstNumber = currentNumber;
                currentNumber = "";
            }

            operator = value;

            display.textContent = firstNumber + " " + operator;
        }

        if (value === "c") {
            currentNumber = "";
            firstNumber = "";
            operator = "";

            display.textContent = "0";
        }

        if (value === "⌫") {
            currentNumber = currentNumber.slice(0, -1);

            if (currentNumber === "") {
                display.textContent = "0";
            } else if (operator === "") {
                display.textContent = currentNumber;
            } else {
                display.textContent = firstNumber + " " + operator + " " + currentNumber;
            }
        }

        if (value === "±") {
            if (currentNumber !== "") {

                if (currentNumber.startsWith("-")) {
                    currentNumber = currentNumber.slice(1);
                } else {
                    currentNumber = "-" + currentNumber;
                }

                if (operator === "") {
                    display.textContent = currentNumber;
                } else {
                    display.textContent = firstNumber + " " + operator + " " + currentNumber;
                }
            }
        }

        if (value === "%") {
            if (currentNumber !== "") {
                currentNumber = (Number(currentNumber) / 100).toString();

                if (operator === "") {
                    display.textContent = currentNumber;
                } else {
                    display.textContent = firstNumber + " " + operator + " " + currentNumber;
                }
            }
        }

        if (value === "=") {

            if (operator === "") {
                display.textContent = currentNumber;
                return;
            }

            if (currentNumber === "") {
                display.textContent = firstNumber + " " + operator;
                return;
            }

            const number1 = Number(firstNumber);
            const number2 = Number(currentNumber);

            let result;

            if (operator === "+") {
                result = number1 + number2;
            }

            if (operator === "-") {
                result = number1 - number2;
            }

            if (operator === "*") {
                result = number1 * number2;
            }

            if (operator === "/") {
                if (number2 === 0) {
                    display.textContent = "Error";
                    currentNumber = "";
                    firstNumber = "";
                    operator = "";
                    return;
                }

                result = number1 / number2;
            }

            const historyItem = document.createElement("div");
            historyItem.className = "history-item";

            const historyText = document.createElement("span");
            historyText.textContent = firstNumber + " " + operator + " " + currentNumber + " = " + result;

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-history";
            deleteButton.textContent = "×";
            deleteButton.title = "Delete this calculation";

            deleteButton.addEventListener("click", function() {
                historyItem.remove();
            });

            historyItem.appendChild(historyText);
            historyItem.appendChild(deleteButton);
            history.insertBefore(historyItem, clearHistory);

            display.textContent = result;

            currentNumber = result.toString();
            firstNumber = "";
            operator = "";
        }

    });
});