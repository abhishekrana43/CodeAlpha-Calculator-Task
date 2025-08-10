let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

const currentDisplay = document.getElementById('currentDisplay');
const previousDisplay = document.getElementById('previousDisplay');

function updateDisplay() {
    currentDisplay.textContent = currentInput;
    if (operator) {
        previousDisplay.textContent = `${previousInput} ${getOperatorSymbol(operator)}`;
    } else {
        previousDisplay.textContent = '';
    }
}

function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };
    return symbols[op] || op;
}

function appendNumber(number) {
    if (currentDisplay.classList.contains('error')) {
        clearAll();
    }
    
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (number === '.' && currentInput.includes('.')) return;
    
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    
    updateDisplay();
}

function appendOperator(op) {
    if (currentDisplay.classList.contains('error')) {
        clearAll();
    }
    
    if (operator && !shouldResetDisplay) {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (!operator || shouldResetDisplay) return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                currentDisplay.classList.add('error');
                previousDisplay.textContent = '';
                currentDisplay.textContent = currentInput;
                operator = '';
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Handle floating point precision
    result = Math.round(result * 1000000000000) / 1000000000000;
    
    currentInput = result.toString();
    operator = '';
    previousInput = '';
    shouldResetDisplay = true;
    
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    currentDisplay.classList.remove('error');
    updateDisplay();
}

function deleteLast() {
    if (currentDisplay.classList.contains('error')) {
        clearAll();
        return;
    }
    
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Visual feedback for button presses
document.querySelectorAll('.btn').forEach(btn => {
    const key = btn.getAttribute('data-key');
    if (key) {
        document.addEventListener('keydown', (e) => {
            if (e.key === key || (e.key === 'Enter' && key === '=')) {
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 150);
            }
        });
    }
});

// Initialize display
updateDisplay();