const display = document.getElementById("display");
const history = document.getElementById("history");
const historyList = document.querySelector(".history-list");
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

function matchHistoryHeight() {
    const calculator = document.querySelector(".calculator");
    history.style.height = calculator.offsetHeight + "px";
}

matchHistoryHeight();
window.addEventListener("resize", matchHistoryHeight);

clearHistory.addEventListener("click", function() {
    historyList.innerHTML = "";

    localStorage.removeItem("calclyHistory");

    for (let i = 0; i < 10; i++) {
        const emptyItem = document.createElement("div");
        emptyItem.className = "history-item empty-history";
        historyList.appendChild(emptyItem);
    }
});

copyButton.addEventListener("click", function() {
    navigator.clipboard.writeText(display.textContent);
});

let currentNumber = "";
let firstNumber = "";
let operator = "";

function saveHistory(calculation, time) {
    let savedHistory = JSON.parse(localStorage.getItem("calclyHistory")) || [];

    savedHistory.push({
        id: Date.now(),
        calculation: calculation,
        time: time
    });

    localStorage.setItem("calclyHistory", JSON.stringify(savedHistory));
}

function loadHistory() {
    let savedHistory = JSON.parse(localStorage.getItem("calclyHistory")) || [];

    savedHistory.forEach(function(item) {
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";

        const historyText = document.createElement("span");

        let calculation;
        let calculationTime = "";
        let itemId = null;

        if (typeof item === "string") {
            calculation = item;
        } else {
            calculation = item.calculation;
            calculationTime = item.time || "";
            itemId = item.id;
        }

        historyText.textContent = calculation;
        historyItem.appendChild(historyText);

        if (calculationTime !== "") {
            const timeText = document.createElement("span");
            timeText.className = "history-time";
            timeText.textContent = calculationTime;
            historyItem.appendChild(timeText);
        }

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-history";
        deleteButton.textContent = "×";
        deleteButton.title = "Delete this calculation";

        deleteButton.addEventListener("click", function() {
            historyItem.remove();

            let currentHistory = JSON.parse(localStorage.getItem("calclyHistory")) || [];

            if (itemId !== null) {
                currentHistory = currentHistory.filter(function(savedItem) {
                    return savedItem.id !== itemId;
                });
            } else {
                currentHistory = currentHistory.filter(function(savedItem) {
                    return savedItem !== calculation;
                });
            }

            localStorage.setItem("calclyHistory", JSON.stringify(currentHistory));
        });

        historyItem.appendChild(deleteButton);

        const emptyItem = historyList.querySelector(".empty-history");

        if (emptyItem) {
            historyList.replaceChild(historyItem, emptyItem);
        } else {
            historyList.appendChild(historyItem);
        }
    });
}

loadHistory();

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
            const now = new Date();
            const calculationTime = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });

            const calculation = firstNumber + " " + operator + " " + currentNumber + " = " + result;
            historyText.textContent = calculation;

            const timeText = document.createElement("span");
            timeText.className = "history-time";
            timeText.textContent = calculationTime;

            const historyId = Date.now();

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-history";
            deleteButton.textContent = "×";
            deleteButton.title = "Delete this calculation";

            deleteButton.addEventListener("click", function() {
                historyItem.remove();

                let savedHistory = JSON.parse(localStorage.getItem("calclyHistory")) || [];

                savedHistory = savedHistory.filter(function(item) {
                    if (typeof item === "string") {
                        return item !== calculation;
                    }

                    return item.id !== historyId;
                });

                localStorage.setItem("calclyHistory", JSON.stringify(savedHistory));
            });

            historyItem.appendChild(historyText);
            historyItem.appendChild(timeText);
            historyItem.appendChild(deleteButton);

            const emptyItem = historyList.querySelector(".empty-history");

            if (emptyItem) {
                historyList.replaceChild(historyItem, emptyItem);
            } else {
                historyList.appendChild(historyItem);
            }

            display.textContent = result;

            saveHistory(calculation, calculationTime);

            currentNumber = result.toString();
            firstNumber = "";
            operator = "";
        }

    });
});

document.addEventListener("keydown", function(event) {
    let value = event.key;

    if (value === "Enter") {
        value = "=";
    }

    if (value === "Backspace") {
        value = "⌫";
    }

    if (value === "Escape") {
        value = "c";
    }

    if (value === "C") {
        value = "c";
    }

    const allowedKeys = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        ".", "+", "-", "*", "/", "%", "=", "c", "⌫"
    ];

    if (!allowedKeys.includes(value)) {
        return;
    }

    event.preventDefault();

    const matchingButton = Array.from(buttons).find(function(button) {
        return button.textContent === value;
    });

    if (matchingButton) {
        matchingButton.click();
    }
});