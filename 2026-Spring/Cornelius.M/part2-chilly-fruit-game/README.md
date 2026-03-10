🍓 Chilly Fruit Game
Chilly Fruit Game is a polished, interactive drag-and-drop web game. Players must move a set of fresh fruit from a "Full Fridge" on the left to an "Empty Fridge" on the right.

This project demonstrates the use of the Pointer API for fluid dragging and dynamic DOM coordinate transformation to handle moving elements between different parent containers.

🎮 How to Play
The Goal: Move all 5 fruits (🍎, 🍌, 🍇, 🍓, 🍊) to the right-hand fridge.

Dragging: Click and hold (or touch) any fruit to pick it up.

Dropping: Drag the fruit over the right fridge. You will see the fridge glow and scale up to let you know it's a valid drop zone.

Win Condition: Once all fruit is transferred, a success message will appear.

Reset: Use the "Restock Fridge" button to start over at any time.

🛠️ Technical Breakdown
1. Coordinate Transformation
One of the hardest parts of drag-and-drop is moving an element from one container (the left fridge) to another (the right fridge) without it "jumping" or "teleporting."

This game uses getBoundingClientRect() to calculate the cursor's position relative to the target container at the exact moment of the drop. This allows the fruit to land exactly where your cursor is released.

2. Pointer API
Instead of using older "MouseEvents," this game uses the modern Pointer API (pointerdown, pointermove, pointerup).

setPointerCapture: This ensures that even if you move your mouse very fast and leave the fruit's boundaries, the game doesn't "lose" the fruit.

Touch Support: Because it uses Pointer Events, the game works natively on tablets and smartphones.

3. SVG Graphics
The fridges are built entirely with inline SVG.

No external image files are needed.

The graphics are perfectly crisp on high-resolution (Retina) displays.

Colors and shelf positions are easily adjustable via the HTML code.

📂 File Structure
index.html: The structural layout and the SVG fridge designs.

style.css: The "frosted" glass aesthetic, layout grid, and drag-over animations.

script.js: The game engine, drag logic, and win-state tracking.

🚀 Installation & Setup
Copy the HTML, CSS, and JS code into three separate files named index.html, style.css, and script.js.

Place all three files in the same folder.

Open index.html in your web browser.

🔮 Future Roadmap
Physics Engine: Adding gravity so fruits stack on the shelves.

Timed Mode: A "Door Open" timer that buzzes if you don't finish before the fridge loses its cold air.

Categorization: Adding vegetables and requiring the player to sort them into specific drawers.
