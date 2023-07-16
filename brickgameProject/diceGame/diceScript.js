const randomNumber1 = Math.floor(Math.random()*6)+1;
document.querySelector('.img1').src = `imagesDice/dice${randomNumber1}.png`;

const randomNumber2 = Math.floor(Math.random()*6)+1;
document.querySelector('.img2').src = `imageDice2/dice${randomNumber2}.png`;

if (randomNumber1>randomNumber2) {
    document.querySelector('h1').innerHTML = "🏅Player One Wins"
}
else if (randomNumber2>randomNumber1) {
    document.querySelector('h1').innerHTML = "Player Two Wins🏅"
}
else {
    document.querySelector('h1').innerHTML = "Draw! 🤝"
};


