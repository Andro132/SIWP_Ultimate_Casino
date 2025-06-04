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
let storedBetAmount = 0;
const chipButtons = document.querySelectorAll(".chip");

chipButtons.forEach(chip => {
    chip.addEventListener("click", () => {
        chipButtons.forEach(btn => btn.classList.remove("selected"));
        chip.classList.add("selected");
        storedBetAmount = parseInt(chip.getAttribute("data-value"));
    });
});

const betAmountInput = document.getElementById("bet-amount");
const sliceAngle = 360 / numbers.length;
const wheelGroup = document.getElementById('wheel');
const ball = document.getElementById('ball');
const resultElement = document.getElementById("result");
const betNumberInput = document.getElementById("bet-number");
const betColorSelect = document.getElementById("bet-color");

let storedBetAmountNumber = 0;
let storedBetAmountColor = 0;
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
        if (storedBetNumber !== null || storedBetColor !== null) {
            checkBet(targetIndex);
        } else {
            document.getElementById("message").textContent = "";
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

        const bounceFrequency = 3;
        const bounceIntensity = 0.1 * (1 - progress);
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

    if (isNaN(betNumber) || !numbers.includes(betNumber)) {
        alert("Please enter a valid number found on the roulette wheel (0–36).");
        return;
    }

    const selectedChip = document.querySelector(".chip.selected");
    if (!selectedChip) {
        alert("Please select a chip to set your bet amount.");
        return;
    }

    const amount = parseInt(selectedChip.getAttribute("data-value"));
    storedBetNumber = betNumber;
    storedBetAmountNumber = amount;
    alert(`You placed a bet of $${amount} on number ${betNumber}`);
}

function placeColorBet() {
    const betColor = betColorSelect.value;

    const selectedChip = document.querySelector(".chip.selected");
    if (!selectedChip) {
        alert("Please select a chip to set your bet amount.");
        return;
    }

    const amount = parseInt(selectedChip.getAttribute("data-value"));
    storedBetColor = betColor;
    storedBetAmountColor = amount;
    alert(`You placed a bet of $${amount} on color ${betColor}`);
}




function checkBet(targetIndex) {
    const resultNumber = numbers[targetIndex];
    const resultColor = colors[targetIndex];
    const messageElement = document.getElementById("message");

    let numberMatch = storedBetNumber === resultNumber;
    let colorMatch = storedBetColor === resultColor;

    let totalWin = 0;
    let totalLoss = 0;

    if (storedBetNumber !== null) {
        if (numberMatch) {
            totalWin += storedBetAmountNumber * 36;
        } else {
            totalLoss += storedBetAmountNumber;
        }
    }

    if (storedBetColor !== null) {
        if (colorMatch) {
            totalWin += storedBetAmountColor * 2;
        } else {
            totalLoss += storedBetAmountColor;
        }
    }

    let message = "";

    if (totalWin > 0 && totalLoss === 0) {
        message = `🎉 You won $${totalWin}!`;
    } else if (totalWin > 0 && totalLoss > 0) {
        message = `⚖️ You won $${totalWin} but lost $${totalLoss}. Net: $${totalWin - totalLoss}`;
    } else {
        message = `😞 You lost $${totalLoss}. Better luck next time!`;
    }

    messageElement.textContent = message;

    // Reset stored bets
    storedBetNumber = null;
    storedBetColor = null;
    storedBetAmountNumber = 0;
    storedBetAmountColor = 0;

    // Unselect chips
    document.querySelectorAll(".chip").forEach(btn => btn.classList.remove("selected"));
}



