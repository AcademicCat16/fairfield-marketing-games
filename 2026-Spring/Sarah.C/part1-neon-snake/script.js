const frame_size_x = 720;
const frame_size_y = 480;
const grid = 10;
const difficulty = 25;
let snake;
let direction = "RIGHT";
let change_to = "RIGHT";
let food;
let score = 0;
let scoreText;
class SnakeGame extends Phaser.Scene {
constructor(){
super("SnakeGame");
}
create(){
this.cameras.main.setBackgroundColor("#1b0033");
snake = [
{x:100,y:50},
{x:90,y:50},
{x:80,y:50}
];
food = this.spawnFood();
score = 0;
scoreText = this.add.text(
10,
10,
"Score : 0",
{
font:"20px Arial",
fill:"#ff9de6" // pink score
}
);
this.keys = this.input.keyboard.addKeys({
up:Phaser.Input.Keyboard.KeyCodes.UP,
down:Phaser.Input.Keyboard.KeyCodes.DOWN,
left:Phaser.Input.Keyboard.KeyCodes.LEFT,
right:Phaser.Input.Keyboard.KeyCodes.RIGHT,
w:Phaser.Input.Keyboard.KeyCodes.W,
a:Phaser.Input.Keyboard.KeyCodes.A,
s:Phaser.Input.Keyboard.KeyCodes.S,
d:Phaser.Input.Keyboard.KeyCodes.D
});
this.time.addEvent({
delay:1000/difficulty,
loop:true,
callback:()=>this.moveSnake()
});
}
spawnFood(){
return {
x:Phaser.Math.Between(1,frame_size_x/grid-1)*grid,
y:Phaser.Math.Between(1,frame_size_y/grid-1)*grid
};
}
moveSnake(){
if(this.keys.up.isDown || this.keys.w.isDown){
if(direction!=="DOWN") change_to="UP";
}
if(this.keys.down.isDown || this.keys.s.isDown){
if(direction!=="UP") change_to="DOWN";
}
if(this.keys.left.isDown || this.keys.a.isDown){
if(direction!=="RIGHT") change_to="LEFT";
}
if(this.keys.right.isDown || this.keys.d.isDown){
if(direction!=="LEFT") change_to="RIGHT";
}
direction = change_to;
let head = {...snake[0]};
if(direction==="UP") head.y-=grid;
if(direction==="DOWN") head.y+=grid;
if(direction==="LEFT") head.x-=grid;
if(direction==="RIGHT") head.x+=grid;
// WALL COLLISION
if(
head.x < 0 ||
head.y < 0 ||
head.x > frame_size_x-grid ||
head.y > frame_size_y-grid
){
this.gameOver();
return;
}
// BODY COLLISION
for(let i=1;i<snake.length;i++){
if(head.x===snake[i].x &&
head.y===snake[i].y){
this.gameOver();
return;
}
}
snake.unshift(head);
// FOOD
if(head.x===food.x &&
head.y===food.y){
score++;
food = this.spawnFood();
}else{
snake.pop();
}
this.drawGame();
}
drawGame(){
this.children.removeAll();
this.cameras.main.setBackgroundColor("#1b0033");
scoreText = this.add.text(
10,
10,
"Score : "+score,
{
font:"20px Arial",
fill:"#ff9de6"
}
);
// SNAKE (PURPLE)
snake.forEach(seg=>{
this.add.rectangle(
seg.x+5,
seg.y+5,
10,
10,
0xb266ff // purple snake
);
});
// FOOD (HOT PINK)
this.add.rectangle(
food.x+5,
food.y+5,
10,
10,
0xff4fcf // pink food
);
}
gameOver(){
this.children.removeAll();
this.add.text(
frame_size_x/2,
frame_size_y/4,
"YOU DIED",
{
font:"80px Arial",
fill:"#ff4fcf"
}
).setOrigin(.5);
this.add.text(
frame_size_x/2,
frame_size_y/1.25,
"Score : "+score,
{
font:"25px Arial",
fill:"#e6b3ff"
}
).setOrigin(.5);
this.time.removeAllEvents();
}
}
new Phaser.Game({
type:Phaser.AUTO,
width:frame_size_x,
height:frame_size_y,
parent:"game",
scene:[SnakeGame]
});
