// Calculator functionality
class Calculator {
    constructor() {
        this.display = document.getElementById('calc-display');
        this.buttons = document.querySelectorAll('.calc-btn');
        this.currentInput = '';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetScreen = false;
        
        this.initializeCalculator();
    }
    
    initializeCalculator() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.dataset.value;
                this.handleInput(value);
            });
        });
    }
    
    handleInput(value) {
        if (value === 'AC') {
            this.clear();
        } else if (value === '±') {
            this.toggleSign();
        } else if (value === '%') {
            this.percentage();
        } else if (['+', '-', '×', '÷'].includes(value)) {
            this.setOperation(value);
        } else if (value === '=') {
            this.calculate();
        } else if (value === '.') {
            this.appendDecimal();
        } else {
            this.appendNumber(value);
        }
    }
    
    clear() {
        this.currentInput = '';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }
    
    toggleSign() {
        if (this.currentInput !== '') {
            this.currentInput = (parseFloat(this.currentInput) * -1).toString();
            this.updateDisplay();
        }
    }
    
    percentage() {
        if (this.currentInput !== '') {
            this.currentInput = (parseFloat(this.currentInput) / 100).toString();
            this.updateDisplay();
        }
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentInput = '';
            this.shouldResetScreen = false;
        }
        this.currentInput += number;
        this.updateDisplay();
    }
    
    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentInput = '0';
            this.shouldResetScreen = false;
        }
        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }
    
    setOperation(operation) {
        if (this.currentInput === '') return;
        
        if (this.previousInput !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousInput = this.currentInput;
        this.currentInput = '';
        this.shouldResetScreen = false;
    }
    
    calculate() {
        if (this.previousInput === '' || this.currentInput === '') return;
        
        let result;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.display.value = 'خطأ';
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        this.currentInput = result.toString();
        this.operation = null;
        this.previousInput = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.display.value = this.currentInput || '0';
    }
}

// Interactive exercises functionality
class MathExercises {
    constructor() {
        this.currentProblem = {};
        this.score = 0;
        this.totalProblems = 0;
        
        this.initializeExercises();
    }
    
    initializeExercises() {
        this.generateNewProblem();
        
        document.getElementById('check-answer').addEventListener('click', () => {
            this.checkAnswer();
        });
        
        document.getElementById('new-problem').addEventListener('click', () => {
            this.generateNewProblem();
        });
        
        // Enter key support
        document.getElementById('answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }
    
    generateNewProblem() {
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 50) + 25;
                num2 = Math.floor(Math.random() * num1) + 1;
                break;
            case '×':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                break;
        }
        
        this.currentProblem = { num1, num2, operation };
        
        document.getElementById('num1').textContent = num1;
        document.getElementById('num2').textContent = num2;
        
        // Update operation symbol
        const problemElement = document.querySelector('.exercise-problem');
        problemElement.innerHTML = `<span id="num1">${num1}</span> ${this.getOperationSymbol(operation)} <span id="num2">${num2}</span> = ?`;
        
        // Clear previous result and input
        document.getElementById('answer').value = '';
        document.getElementById('result').innerHTML = '';
        document.getElementById('result').className = 'result';
    }
    
    getOperationSymbol(operation) {
        switch (operation) {
            case '+': return '+';
            case '-': return '−';
            case '×': return '×';
            default: return '+';
        }
    }
    
    checkAnswer() {
        const userAnswer = parseInt(document.getElementById('answer').value);
        const resultElement = document.getElementById('result');
        
        if (isNaN(userAnswer)) {
            resultElement.innerHTML = 'الرجاء إدخال إجابة صحيحة';
            resultElement.className = 'result incorrect';
            return;
        }
        
        let correctAnswer;
        switch (this.currentProblem.operation) {
            case '+':
                correctAnswer = this.currentProblem.num1 + this.currentProblem.num2;
                break;
            case '-':
                correctAnswer = this.currentProblem.num1 - this.currentProblem.num2;
                break;
            case '×':
                correctAnswer = this.currentProblem.num1 * this.currentProblem.num2;
                break;
        }
        
        this.totalProblems++;
        
        if (userAnswer === correctAnswer) {
            this.score++;
            resultElement.innerHTML = `أحسنت! الإجابة صحيحة: ${correctAnswer}`;
            resultElement.className = 'result correct';
        } else {
            resultElement.innerHTML = `الإجابة خاطئة. الإجابة الصحيحة هي: ${correctAnswer}`;
            resultElement.className = 'result incorrect';
        }
        
        // Show score
        setTimeout(() => {
            if (this.totalProblems > 0) {
                const percentage = Math.round((this.score / this.totalProblems) * 100);
                resultElement.innerHTML += `<br><br>النقاط: ${this.score}/${this.totalProblems} (${percentage}%)`;
            }
        }, 1000);
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile navigation toggle
function initializeMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

// Add scroll effect to header
function initializeHeaderScrollEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Add animation on scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.lesson-card, .exercise-card, .calculator');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator
    new Calculator();
    
    // Initialize math exercises
    new MathExercises();
    
    // Initialize other functionality
    initializeSmoothScrolling();
    initializeMobileNavigation();
    initializeHeaderScrollEffect();
    initializeScrollAnimations();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    .lesson-card, .exercise-card, .calculator {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .lesson-card.animate-in, .exercise-card.animate-in, .calculator.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .header.scrolled {
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
    }
    
    body.loaded .hero {
        animation: fadeInUp 1s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: var(--shadow);
        border-top: 1px solid var(--border-color);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;

document.head.appendChild(style);
