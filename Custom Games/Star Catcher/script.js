let score = 0;
let time = 30;
let gameInterval;
let starInterval;
function startGame(){
score = 0;
time = 30;
document.getElementById("score").textContent = score;
document.getElementById("time").textContent = time;
const board = document.getElementById("board");
board.innerHTML = "";
gameInterval = setInterval(function(){
time--;
document.getElementById("time").textContent = time;
if(time <= 0){
clearInterval(gameInterval);
clearInterval(starInterval);
alert("Game Over! You caught " + score + " stars ⭐");
}
},1000);
starInterval = setInterval(createStar,800);
}
function createStar(){
const board = document.getElementById("board");
const star = document.createElement("div");
star.textContent = "⭐";
star.classList.add("star");
const x = Math.random() * 360;
const y = Math.random() * 360;
star.style.left = x + "px";
star.style.top = y + "px";
star.onclick = function(){
score++;
document.getElementById("score").textContent = score;
star.remove();
}
board.appendChild(star);
setTimeout(function(){
star.remove();
},1500);
}
