const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
    11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9,
    22, 18, 29, 7, 28, 12, 35, 3, 26
];

const colors = [
    'green', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
    'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
    'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
    'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black'
];

const sliceAngle = 360 / numbers.length;
const wheelGroup = document.getElementById('wheel');
const ball = document.getElementById('ball');
const resultElement = document.getElementById("result");
const betNumberInput = document.getElementById("bet-number");
const betColorSelect = document.getElementById("bet-color");

let betPlaced = false;
let storedBetNumber = null;
let storedBetColor = null;

function drawWheel() {
    for (let i = 0; i < numbers.length; i++) {
        const angle = i * sliceAngle;
        const largeArc = sliceAngle > 180 ? 1 : 0;
        const x1 = 200 + 190 * Math.cos(angle * Math.PI / 180);
        const y1 = 200 + 190 * Math.sin(angle * Math.PI / 180);
        const x2 = 200 + 190 * Math.cos((angle + sliceAngle) * Math.PI / 180);
        const y2 = 200 + 190 * Math.sin((angle + sliceAngle) * Math.PI / 180);

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M200,200 L${x1},${y1} A190,190 0 ${largeArc} 1 ${x2},${y2} Z`);
        path.setAttribute('fill', colors[i]);
        wheelGroup.appendChild(path);

        const textAngle = angle + sliceAngle / 2;
        const tx = 200 + 140 * Math.cos(textAngle * Math.PI / 180);
        const ty = 200 + 140 * Math.sin(textAngle * Math.PI / 180);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', tx);
        text.setAttribute('y', ty);
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '14');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'middle');
        text.setAttribute('transform', `rotate(${textAngle}, ${tx}, ${ty})`);
        text.textContent = numbers[i];
        wheelGroup.appendChild(text);
    }
}

drawWheel();

function spinBall() {
    const spins = 5;
    const targetIndex = Math.floor(Math.random() * numbers.length);
    const finalAngle = 360 * spins + (360 - targetIndex * sliceAngle - sliceAngle / 2);

    animateBall(finalAngle, () => {
        resultElement.textContent = `Result: ${numbers[targetIndex]}`;

        // Only check bet if one was placed
        if (betPlaced) {
            checkBet(targetIndex);
            betPlaced = false; // Reset after checking
        } else {
            document.getElementById("message").textContent = ""; // Clear message
        }
    });
}

function animateBall(targetAngle, callback) {
    const radius = 170;
    const duration = 5000;
    const start = performance.now();

    function frame(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);

        const easing = 1 - Math.pow(1 - progress, 3);

        const bounceFrequency = 4;
        const bounceIntensity = 0.25 * (1 - progress);
        const bounce = bounceIntensity * Math.sin(bounceFrequency * Math.PI * progress);

        const currentAngle = targetAngle * (easing + bounce);

        const rad = currentAngle * Math.PI / 180;
        const cx = 200 + radius * Math.cos(rad);
        const cy = 200 - radius * Math.sin(rad);

        ball.setAttribute('cx', cx);
        ball.setAttribute('cy', cy);

        if (progress < 1) {
            requestAnimationFrame(frame);
        } else {
            callback();
        }
    }

    requestAnimationFrame(frame);
}



function placeBet() {
    const betNumber = parseInt(betNumberInput.value);
    if (isNaN(betNumber) || betNumber < 0 || betNumber > 36) {
        alert("Please enter a valid number between 0 and 36.");
        return;
    }

    storedBetNumber = betNumber;
    betPlaced = true;
    alert(`You placed a bet on number ${betNumber}`);
}

function placeColorBet() {
    const betColor = betColorSelect.value;
    storedBetColor = betColor;
    betPlaced = true;
    alert(`You placed a bet on color ${betColor}`);
}

function checkBet(targetIndex) {
    const resultNumber = numbers[targetIndex];
    const resultColor = colors[targetIndex];
    const messageElement = document.getElementById("message");

    let numberMatch = storedBetNumber === resultNumber;
    let colorMatch = storedBetColor === resultColor;
    let message = "";

    if (numberMatch && colorMatch) {
        message = "🎉 Jackpot! You won both the number and color bets!";
    } else if (numberMatch) {
        message = "🎯 Great! You won the number bet!";
    } else if (colorMatch) {
        message = "🟥🖤 You won the color bet!";
    } else {
        message = "😞 Sorry, you lost both bets. Try again!";
    }

    messageElement.textContent = message;

    // Reset stored bets after checking
    storedBetNumber = null;
    storedBetColor = null;
}

