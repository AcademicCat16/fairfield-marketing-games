const dog = document.getElementById("dog");
const bowl = document.getElementById("bowl");
const world = document.getElementById("world");
const message = document.getElementById("message");
const walls = document.querySelectorAll(".wall");
 
let pos = { x: 20, y: 300 };
const speed = 8;
let won = false;
 
document.addEventListener("keydown", (e) => {
  if (won) return;
 
  let dx = 0;
  let dy = 0;
 
  if (e.key === "ArrowRight") dx = speed;
  if (e.key === "ArrowLeft") dx = -speed;
  if (e.key === "ArrowUp") dy = -speed;
  if (e.key === "ArrowDown") dy = speed;
 
  moveDog(dx, dy);
  checkWin();
});
 
function moveDog(dx, dy) {
  const newPos = {
	x: pos.x + dx,
	y: pos.y + dy
  };
 
  if (!hitsWall(newPos)) {
	pos = newPos;
	dog.style.left = pos.x + "px";
	dog.style.top = pos.y + "px";
  }
}
 
function hitsWall(position) {
  const dogRect = {
	left: position.x,
	top: position.y,
	right: position.x + dog.offsetWidth,
	bottom: position.y + dog.offsetHeight
  };
 
  for (let wall of walls) {
	const w = wall.getBoundingClientRect();
	const worldRect = world.getBoundingClientRect();
 
	const wallRect = {
  	left: w.left - worldRect.left,
  	top: w.top - worldRect.top,
  	right: w.right - worldRect.left,
  	bottom: w.bottom - worldRect.top
	};
 
	if (
  	dogRect.left < wallRect.right &&
  	dogRect.right > wallRect.left &&
  	dogRect.top < wallRect.bottom &&
  	dogRect.bottom > wallRect.top
	) {
  	return true;
	}
  }
  return false;
}
 
function checkWin() {
  const dogRect = dog.getBoundingClientRect();
  const bowlRect = bowl.getBoundingClientRect();
 
  if (
	dogRect.left < bowlRect.right &&
	dogRect.right > bowlRect.left &&
	dogRect.top < bowlRect.bottom &&
	dogRect.bottom > bowlRect.top
  ) {
	won = true;
	message.textContent = "You made it! Dinner time! 🐶✨";
	launchConfetti();
  }
}
 
function launchConfetti() {
  for (let i = 0; i < 80; i++) {
	const confetti = document.createElement("div");
	confetti.classList.add("confetti");
	confetti.style.left = Math.random() * 600 + "px";
	confetti.style.top = Math.random() * 50 + "px";
	confetti.style.background = `hsl(${Math.random()*360},70%,60%)`;
 
	world.appendChild(confetti);
	setTimeout(() => confetti.remove(), 1500);
  }
}

