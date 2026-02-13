"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let deckId = "";
let playerScore = 0;
let dealerScore = 0;
let dealerHiddenCard = null;
let gameOver = false;
async function startGame() {
    playerScore = 0;
    dealerScore = 0;
    dealerHiddenCard = null;
    gameOver = false;
    updateUI();
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    const data = await response.json();
    deckId = data.deck_id;
    await drawCard("player");
    await drawCard("player");
    await drawCard("dealer");
    await drawHiddenDealerCard();
}
async function drawCard(who) {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await response.json();
    const card = data.cards[0];
    const img = document.createElement("img");
    img.src = card.image;
    img.style.width = "80px";
    img.classList.add("me-2");
    if (who === "player") {
        document.getElementById("player-cards")?.appendChild(img);
        playerScore += getCardValue(card.value);
        if (playerScore > 21) {
            updateScores();
            endGame("Vesztettél! 💀");
            return;
        }
    }
    else {
        document.getElementById("dealer-cards")?.appendChild(img);
        dealerScore += getCardValue(card.value);
    }
    updateScores();
}
async function drawHiddenDealerCard() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await response.json();
    dealerHiddenCard = data.cards[0];
    const img = document.createElement("img");
    img.src = "https://deckofcardsapi.com/static/img/back.png";
    img.id = "hidden-card";
    img.style.width = "80px";
    img.classList.add("me-2");
    document.getElementById("dealer-cards")?.appendChild(img);
}
function hit() {
    if (!gameOver) {
        drawCard("player");
    }
}
async function stand() {
    if (gameOver)
        return;
    revealDealerCard();
    while (dealerScore < 17) {
        await drawCard("dealer");
    }
    checkWinner();
}
function revealDealerCard() {
    if (!dealerHiddenCard)
        return;
    const hiddenImg = document.getElementById("hidden-card");
    hiddenImg.src = dealerHiddenCard.image;
    dealerScore += getCardValue(dealerHiddenCard.value);
    updateScores();
}
function checkWinner() {
    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame("Nyertél! 🎉");
    }
    else if (playerScore < dealerScore) {
        endGame("Vesztettél! 💀");
    }
    else {
        endGame("Döntetlen 🤝");
    }
}
function endGame(message) {
    gameOver = true;
    const result = document.getElementById("result");
    if (result)
        result.innerText = message;
}
function getCardValue(value) {
    if (value === "ACE")
        return 11;
    if (["KING", "QUEEN", "JACK"].includes(value))
        return 10;
    return parseInt(value);
}
function updateScores() {
    const player = document.getElementById("player-score");
    const dealer = document.getElementById("dealer-score");
    if (player)
        player.innerText = playerScore.toString();
    if (dealer)
        dealer.innerText = dealerScore.toString();
}
function updateUI() {
    document.getElementById("player-cards").innerHTML = "";
    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("player-score").innerText = "0";
    document.getElementById("dealer-score").innerText = "0";
    document.getElementById("result").innerText = "";
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("hit-btn")?.addEventListener("click", hit);
    document.getElementById("stand-btn")?.addEventListener("click", stand);
    document.getElementById("start-btn")?.addEventListener("click", startGame);
});
//# sourceMappingURL=main.js.map