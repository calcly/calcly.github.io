const display = document.getElementById("display");

const buttons = document.querySelectorAll("button");

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
                currentNumber = currentNumber + ".";

                if (operator === "") {
                    display.textContent = currentNumber;
                } else {
                    display.textContent = firstNumber + " " + operator + " " + currentNumber;
                }
            }
        }

        if (value === "+" || value === "-" || value === "*" || value === "/") {
            firstNumber = currentNumber;
            operator = value;
            currentNumber = "";

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

        if (value === "=") {

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

            display.textContent = result;

            currentNumber = result.toString();
            firstNumber = "";
            operator = "";
        }

    });
});