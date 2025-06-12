// Roulette Game Configuration
const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
    11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9,
    22, 18, 29, 7, 28, 12, 35, 3, 26
];

// Game State
let gameState = {
    balance: 1000,
    selectedChipValue: 0,
    activeBets: [],
    totalBetAmount: 0,
    isSpinning: false,
    lastResult: null
};

// DOM Elements
const elements = {
    wheel: document.getElementById('wheel'),
    roulette: document.getElementById('roulette'),
    spinBtn: document.getElementById('spinBtn'),
    spinText: document.getElementById('spinText'),
    clearBetsBtn: document.getElementById('clearBetsBtn'),
    result: document.getElementById('result'),
    message: document.getElementById('message'),
    balance: document.getElementById('balance'),
    totalBet: document.getElementById('totalBet'),
    activeBets: document.getElementById('activeBets'),
    betNumber: document.getElementById('betNumber'),
    chipButtons: document.querySelectorAll('.chip-btn'),
    navbar: document.getElementById('navbar'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navbarNav: document.getElementById('navbarNav'),
    loginModal: document.getElementById('loginModal'),
    notifications: document.getElementById('notifications')
};

// Utility Functions
function getNumberColor(num) {
    if (num === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? 'red' : 'black';
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    elements.notifications.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    if (elements.navbarNav) {
        elements.navbarNav.classList.remove('active');
    }
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.classList.remove('active');
    }
}

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    drawRouletteWheel();
    updateDisplay();
    
    // Welcome message
    setTimeout(() => {
        showNotification('Welcome to Royal Casino! Select your chips and place your bets.', 'info');
    }, 1000);
}

function setupEventListeners() {
    // Chip selection
    elements.chipButtons.forEach(chip => {
        chip.addEventListener('click', () => selectChip(chip));
    });
    
    // Game controls
    if (elements.spinBtn) {
        elements.spinBtn.addEventListener('click', spinWheel);
    }
    if (elements.clearBetsBtn) {
        elements.clearBetsBtn.addEventListener('click', clearAllBets);
    }
    
    // Mobile menu
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.navbar && !elements.navbar.contains(e.target)) {
            if (elements.navbarNav) {
                elements.navbarNav.classList.remove('active');
            }
            if (elements.mobileMenuBtn) {
                elements.mobileMenuBtn.classList.remove('active');
            }
        }
    });
    
    // Close modal when clicking outside
    if (elements.loginModal) {
        elements.loginModal.addEventListener('click', (e) => {
            if (e.target === elements.loginModal) {
                hideLoginModal();
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideLoginModal();
        }
        if (e.key === ' ' && !gameState.isSpinning && gameState.activeBets.length > 0) {
            e.preventDefault();
            spinWheel();
        }
    });
}

function toggleMobileMenu() {
    if (elements.navbarNav) {
        elements.navbarNav.classList.toggle('active');
    }
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.classList.toggle('active');
    }
}

function handleNavbarScroll() {
    if (elements.navbar) {
        if (window.scrollY > 50) {
            elements.navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            elements.navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        }
    }
}

function drawRouletteWheel() {
    if (!elements.wheel) return;
    
    const sliceAngle = 360 / numbers.length;
    
    for (let i = 0; i < numbers.length; i++) {
        const angle = i * sliceAngle;
        const largeArc = sliceAngle > 180 ? 1 : 0;
        
        // Calculate path coordinates for larger wheel (500x500 instead of 400x400)
        const centerX = 250;
        const centerY = 250;
        const radius = 220;
        
        const x1 = centerX + radius * Math.cos(angle * Math.PI / 180);
        const y1 = centerY + radius * Math.sin(angle * Math.PI / 180);
        const x2 = centerX + radius * Math.cos((angle + sliceAngle) * Math.PI / 180);
        const y2 = centerY + radius * Math.sin((angle + sliceAngle) * Math.PI / 180);
        
        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`);
        
        // Set color based on number
        const color = getNumberColor(numbers[i]);
        let fillColor;
        if (color === 'red') {
            fillColor = '#DC3545';
        } else if (color === 'black') {
            fillColor = '#212529';
        } else {
            fillColor = '#198754'; // green for 0
        }
        
        path.setAttribute('fill', fillColor);
        path.setAttribute('stroke', '#FFD700');
        path.setAttribute('stroke-width', '1');
        elements.wheel.appendChild(path);
        
        // Add number text
        const textAngle = angle + sliceAngle / 2;
        const textRadius = 170;
        const tx = centerX + textRadius * Math.cos(textAngle * Math.PI / 180);
        const ty = centerY + textRadius * Math.sin(textAngle * Math.PI / 180);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', tx);
        text.setAttribute('y', ty);
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'middle');
        text.setAttribute('transform', `rotate(${textAngle}, ${tx}, ${ty})`);
        text.textContent = numbers[i];
        elements.wheel.appendChild(text);
    }
}

function selectChip(chipElement) {
    // Remove selection from all chips
    elements.chipButtons.forEach(chip => chip.classList.remove('selected'));
    
    // Select clicked chip
    chipElement.classList.add('selected');
    gameState.selectedChipValue = parseInt(chipElement.getAttribute('data-value'));
    
    showNotification(`Selected $${gameState.selectedChipValue} chip`, 'info', 2000);
}

function placeBet(betType, betValue = null) {
    if (gameState.selectedChipValue === 0) {
        showNotification('Please select a chip value first!', 'error');
        return;
    }
    
    if (gameState.isSpinning) {
        showNotification('Cannot place bets while wheel is spinning!', 'error');
        return;
    }
    
    if (gameState.balance < gameState.selectedChipValue) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    let bet = {
        type: betType,
        value: betValue,
        amount: gameState.selectedChipValue,
        id: Date.now()
    };
    
    // Handle different bet types
    switch (betType) {
        case 'number':
            const numberInput = elements.betNumber ? elements.betNumber.value : null;
            if (!numberInput || numberInput < 0 || numberInput > 36) {
                showNotification('Please enter a valid number (0-36)!', 'error');
                return;
            }
            bet.value = parseInt(numberInput);
            bet.display = `Number ${bet.value}`;
            bet.odds = 35;
            if (elements.betNumber) {
                elements.betNumber.value = ''; // Clear input
            }
            break;
            
        case 'red':
        case 'black':
            bet.display = `Color ${betType.charAt(0).toUpperCase() + betType.slice(1)}`;
            bet.odds = 1;
            break;
            
        case 'even':
        case 'odd':
            bet.display = betType.charAt(0).toUpperCase() + betType.slice(1);
            bet.odds = 1;
            break;
    }
    
    // Add bet to active bets
    gameState.activeBets.push(bet);
    gameState.balance -= gameState.selectedChipValue;
    gameState.totalBetAmount += gameState.selectedChipValue;
    
    updateDisplay();
    showNotification(`Placed $${gameState.selectedChipValue} bet on ${bet.display}`, 'success', 2000);
}

function spinWheel() {
    if (gameState.isSpinning) return;
    
    if (gameState.activeBets.length === 0) {
        showNotification('Please place at least one bet before spinning!', 'error');
        return;
    }
    
    gameState.isSpinning = true;
    if (elements.spinBtn) {
        elements.spinBtn.disabled = true;
    }
    if (elements.clearBetsBtn) {
        elements.clearBetsBtn.disabled = true;
    }
    if (elements.spinText) {
        elements.spinText.textContent = 'Spinning...';
    }
    
    // Clear previous results
    if (elements.result) {
        elements.result.innerHTML = '';
    }
    if (elements.message) {
        elements.message.innerHTML = '';
    }
    
    // Pick the winning number first
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const winningNumber = numbers[randomIndex];
    const winningColor = getNumberColor(winningNumber);
    
    // Store the result
    gameState.lastResult = {
        number: winningNumber,
        color: winningColor,
        index: randomIndex
    };
    
    // Get ball element
    const ballElement = document.querySelector('#roulette circle[r="10"]');
    if (!ballElement) {
        console.error('Ball element not found');
        processResults();
        resetSpinState();
        return;
    }
    
    // Calculate target position using EXACT same logic as wheel drawing
    const sliceAngle = 360 / numbers.length;
    const centerX = 250;
    const centerY = 250;
    const ballRadius = 210;
    
    // Use the exact same angle calculation as the text positioning in drawRouletteWheel
    const targetAngle = randomIndex * sliceAngle + sliceAngle / 2;
    
    // Calculate current ball position (starts at top, which is -90 degrees in our coordinate system)
    const currentAngle = -90; // Ball starts at top (12 o'clock)
    
    // Calculate how much we need to rotate
    // Add multiple full rotations (5-8 spins) plus the target angle
    const fullRotations = 5 + Math.random() * 3; // Random between 5-8 spins
    const totalRotation = fullRotations * 360 + (targetAngle - currentAngle);
    
    // Apply CSS transition for smooth spinning
    ballElement.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    ballElement.style.transformOrigin = `${centerX}px ${centerY}px`;
    ballElement.style.transform = `rotate(${totalRotation}deg)`;
    
    // After animation completes, position ball at exact coordinates and show results
    setTimeout(() => {
        // Calculate final ball position coordinates
        const ballX = centerX + ballRadius * Math.cos(targetAngle * Math.PI / 180);
        const ballY = centerY + ballRadius * Math.sin(targetAngle * Math.PI / 180);
        
        // Remove transition and set exact position
        ballElement.style.transition = 'none';
        ballElement.style.transform = 'none';
        ballElement.setAttribute('cx', ballX);
        ballElement.setAttribute('cy', ballY);
        
        // Process results
        processResults();
        resetSpinState();
    }, 4000); // Match the 4s transition duration
}

function resetSpinState() {
    gameState.isSpinning = false;
    if (elements.spinBtn) {
        elements.spinBtn.disabled = false;
    }
    if (elements.clearBetsBtn) {
        elements.clearBetsBtn.disabled = false;
    }
    if (elements.spinText) {
        elements.spinText.textContent = 'Spin Wheel';
    }
}

function processResults() {
    const result = gameState.lastResult;
    let totalWinnings = 0;
    let winningBets = [];
    
    // Check each bet
    gameState.activeBets.forEach(bet => {
        let isWinner = false;
        
        switch (bet.type) {
            case 'number':
                isWinner = bet.value === result.number;
                break;
            case 'red':
            case 'black':
                isWinner = bet.type === result.color;
                break;
            case 'even':
                isWinner = result.number !== 0 && result.number % 2 === 0;
                break;
            case 'odd':
                isWinner = result.number !== 0 && result.number % 2 === 1;
                break;
        }
        
        if (isWinner) {
            const winAmount = bet.amount * (bet.odds + 1); // Include original bet
            totalWinnings += winAmount;
            winningBets.push({...bet, winAmount});
        }
    });
    
    // Update balance
    gameState.balance += totalWinnings;
    
    // Display results
    displayResults(result, totalWinnings, winningBets);
    
    // Clear bets
    gameState.activeBets = [];
    gameState.totalBetAmount = 0;
    
    updateDisplay();
}

function displayResults(result, totalWinnings, winningBets) {
    // Show result number
    const resultColor = result.color === 'red' ? '#DC3545' : 
                       result.color === 'black' ? '#212529' : '#198754';
    
    if (elements.result) {
        elements.result.innerHTML = `
            <div style="color: ${resultColor}; font-size: 2rem; font-weight: 700;">
                ${result.number}
            </div>
        `;
    }
    
    // Show win/loss message
    if (elements.message) {
        if (totalWinnings > 0) {
            elements.message.innerHTML = `
                <div class="win-message">
                    🎉 Congratulations! You won $${totalWinnings}!
                    ${winningBets.length > 0 ? `<br><small>Winning bets: ${winningBets.map(b => b.display).join(', ')}</small>` : ''}
                </div>
            `;
            elements.message.classList.add('bounce');
            showNotification(`🎉 You won $${totalWinnings}!`, 'success', 5000);
        } else {
            elements.message.innerHTML = `
                <div class="lose-message">
                    Better luck next time! You lost $${gameState.totalBetAmount}.
                </div>
            `;
            showNotification('Better luck next time!', 'info', 3000);
        }
        
        // Remove animation class after animation completes
        setTimeout(() => {
            if (elements.message) {
                elements.message.classList.remove('bounce');
            }
        }, 1000);
    }
}

function clearAllBets() {
    if (gameState.isSpinning) {
        showNotification('Cannot clear bets while wheel is spinning!', 'error');
        return;
    }
    
    if (gameState.activeBets.length === 0) {
        showNotification('No bets to clear!', 'info');
        return;
    }
    
    // Refund all bets
    gameState.activeBets.forEach(bet => {
        gameState.balance += bet.amount;
    });
    
    gameState.activeBets = [];
    gameState.totalBetAmount = 0;
    
    updateDisplay();
    showNotification('All bets cleared and refunded', 'info');
}

function updateDisplay() {
    // Update balance and total bet
    if (elements.balance) {
        elements.balance.textContent = `$${gameState.balance}`;
    }
    if (elements.totalBet) {
        elements.totalBet.textContent = `$${gameState.totalBetAmount}`;
    }
    
    // Update active bets display
    if (elements.activeBets) {
        if (gameState.activeBets.length === 0) {
            elements.activeBets.innerHTML = '<p class="no-bets">No active bets</p>';
        } else {
            elements.activeBets.innerHTML = gameState.activeBets.map(bet => `
                <div class="bet-item">
                    <span>${bet.display}</span>
                    <span>$${bet.amount}</span>
                </div>
            `).join('');
        }
    }
}

// Modal Functions
function showLoginModal() {
    if (elements.loginModal) {
        elements.loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideLoginModal() {
    if (elements.loginModal) {
        elements.loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleLogin() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (!email || !password || !email.value || !password.value) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }
    
    // Demo login
    showNotification('Demo login successful! Welcome to Royal Casino!', 'success');
    hideLoginModal();
    
    // Clear form
    email.value = '';
    password.value = '';
}

// Keyboard Shortcuts Info
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard shortcut info
    setTimeout(() => {
        showNotification('💡 Tip: Press SPACE to spin the wheel!', 'info', 4000);
    }, 5000);
});

// Prevent form submission on Enter in bet input
document.addEventListener('DOMContentLoaded', () => {
    const betNumberInput = document.getElementById('betNumber');
    if (betNumberInput) {
        betNumberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                placeBet('number');
            }
        });
    }
});

// Auto-save game state to localStorage
function saveGameState() {
    localStorage.setItem('royalCasinoGameState', JSON.stringify({
        balance: gameState.balance,
        lastPlayed: Date.now()
    }));
}

function loadGameState() {
    const saved = localStorage.getItem('royalCasinoGameState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // Only restore balance if last played within 24 hours
            if (Date.now() - data.lastPlayed < 24 * 60 * 60 * 1000) {
                gameState.balance = data.balance;
                updateDisplay();
                showNotification('Welcome back! Your balance has been restored.', 'success');
            }
        } catch (e) {
            console.log('Could not load saved game state');
        }
    }
}

// Save game state when balance changes
const originalUpdateDisplay = updateDisplay;
updateDisplay = function() {
    originalUpdateDisplay();
    saveGameState();
};

// Load game state on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadGameState, 1000);
});

// Add some fun easter eggs
let clickCount = 0;
document.addEventListener('DOMContentLoaded', () => {
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        navbarBrand.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                gameState.balance += 100;
                updateDisplay();
                showNotification('🎁 Bonus! You found a secret reward!', 'success');
                clickCount = 0;
            }
        });
    }
});

// Expose functions globally for onclick handlers
window.scrollToSection = scrollToSection;
window.placeBet = placeBet;
window.showLoginModal = showLoginModal;
window.hideLoginModal = hideLoginModal;
window.handleLogin = handleLogin;