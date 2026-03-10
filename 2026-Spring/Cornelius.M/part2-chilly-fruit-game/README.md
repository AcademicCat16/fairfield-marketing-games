# 🍓 Chilly Fruit Game

**Chilly Fruit Game** is a polished, interactive drag-and-drop web experience. Players are tasked with organizing a digital kitchen by moving fresh fruit from a "Stock Fridge" on the left into a new "Empty Fridge" on the right. 

This project demonstrates fluid **DOM manipulation**, the modern **Pointer API**, and dynamic **coordinate system transformation** between parent elements.

---

## 🎮 How to Play

1. **The Goal**: Successfully move all 5 fruits (🍎, 🍌, 🍇, 🍓, 🍊) from the left fridge to the right fridge.
2. **Dragging**: Click and hold (or touch) any fruit to pick it up. The fruit will "pop" slightly to show it's active.
3. **Dropping**: Move the fruit over the right fridge. You will notice the target fridge **glows and scales up** when you are in the valid drop zone.
4. **Win Condition**: Once all fruit is transferred, the status message will update to celebrate your organizational skills!
5. **Reset**: Click "Restock Fridge" to clear the shelves and start over.

---

## 🛠️ Technical Breakdown

### 1. Coordinate Transformation
A common issue with web drag-and-drop is "jumping"—where an element snaps to the top-left corner when moved to a new container. To fix this, the game calculates the **local offset** at the moment of the drop.



When the fruit is appended to the `rightOverlay`, we use the following logic to maintain its position:
- `x = clientX - parentRect.left - startX`
- `y = clientY - parentRect.top - startY`

### 2. The Pointer API
Instead of using separate logic for Mouse and Touch, this game utilizes the **Pointer API**.
- **setPointerCapture**: This ensures the fruit stays "attached" to the cursor even if you move the mouse faster than the browser can update the element's position.
- **Touch-Action**: CSS `touch-action: none` is applied to prevent the screen from scrolling while you are trying to move fruit on mobile devices.

### 3. Scalable Vector Graphics (SVG)
The fridges are built entirely using **inline SVG code**. 



- **Resolution Independent**: The graphics remain crisp on any screen size or zoom level.
- **Zero External Assets**: No `.png` or `.jpg` files are required, leading to instant load times.

---

## 📂 File Structure

* `index.html`: The structural backbone and SVG appliance designs.
* `style.css`: The "frosted" glass aesthetic, layout grid, and hover animations.
* `script.js`: The engine handling drag logic, coordinate math, and game state.

---

## 🚀 Installation & Setup

1. Copy the **HTML**, **CSS**, and **JS** code into three separate files named `index.html`, `style.css`, and `script.js`.
2. Place all three files in the **same folder**.
3. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, or Edge).

---

## 🔮 Future Roadmap

* **Physics Layer**: Adding gravity so fruits stack realistically on the shelves.
* **Spoilage Timer**: A "Chilly Meter" that depletes if the fridge doors stay "open" too long.
* **Sound Effects**: Adding satisfying "clicks" and "thuds" for fruit movement.

---
Created with ❤️ for organized kitchens everywhere.
