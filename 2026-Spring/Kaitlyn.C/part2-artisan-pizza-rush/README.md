# 🍕 Artisan Pizza Rush

**Artisan Pizza Rush** is a fast-paced, interactive pizza assembly game. Players act as a line cook in a busy pizzeria, tasked with matching specific orders for size, sauce, cheese, and toppings before serving them to a demanding (but fair) Italian chef.

---

## 🎮 How to Play

1. **Check the Ticket**: Look at the "Current Order" panel on the left. It specifies the **Size**, **Sauce**, **Cheese**, and specific **Toppings** required.
2. **Build the Base**: 
   - Choose the correct **Size** (Small, Medium, Large).
   - Apply the requested **Sauce** (Tomato, Alfredo, or Pesto).
   - Toggle **Cheese** on or off based on the order.
3. **Add Toppings**: Click the topping buttons to toggle ingredients. Note: Extra toppings are just as bad as missing toppings!
4. **Serve**: Once your pizza matches the ticket exactly, hit **Serve**.
5. **Score**: Earn points for perfect orders and build a **Streak** to get a higher score multiplier.

---

## 🛠️ Technical Breakdown

### 1. Visual Layering System
The game uses a "Stacking Logic" to render the pizza. Each selection (sauce, cheese, toppings) exists as a separate DOM layer that updates dynamically through CSS classes and JavaScript.



### 2. Topping Distribution Algorithm
To avoid toppings clumping together or overlapping perfectly, the game uses a **Sunflower Spiral (Vogel’s Spiral)** distribution logic. 
- It calculates normalized coordinates within a circle.
- It applies a slight "jitter" (randomized offset) to each coordinate to ensure the pepperoni and mushrooms look hand-placed rather than machine-generated.

### 3. State-Driven UI
The entire game runs off a single `state` object that tracks:
- **Game Progress**: Done vs. Total orders.
- **Scoring**: Base points + streak bonuses.
- **Pizza Configuration**: A `Set()` for toppings to ensure instant lookups and prevent duplicates.

---

## 📂 File Structure

* `index.html`: The semantic structure, HUD, and the pizza "oven" area.
* `style.css`: Modern CSS with radial gradients for realistic food textures and a "dark mode" kitchen aesthetic.
* `script.js`: The engine handling randomized order generation, scoring math, and the Chef's feedback logic.

---

## 🚀 Installation & Setup

1. Copy the **HTML**, **CSS**, and **JS** code provided into three separate files.
2. Ensure they are named `index.html`, `style.css`, and `script.js` respectively.
3. Keep all files in the **same folder**.
4. Open `index.html` in your web browser.

---

## 🔮 Future Roadmap

* **Timed Mode**: Orders will expire if not served within a specific time limit.
* **Complex Recipes**: Special "House Pizzas" (like a Margherita or Meat Lovers) that require specific combos.
* **Animated Chef**: Adding movement to the chef figure based on your performance.

---
*Built with ❤️ for pizza lovers and developers.*
