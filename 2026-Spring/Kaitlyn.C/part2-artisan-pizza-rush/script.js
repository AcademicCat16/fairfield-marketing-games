(() => {
  const TOPPINGS = [
    { id: "pepperoni", label: "Pepperoni" },
    { id: "mushroom", label: "Mushroom" },
    { id: "olive", label: "Olives" },
    { id: "onion", label: "Onion" },
    { id: "basil", label: "Basil" }
  ];

  const state = {
    score: 0, streak: 0, done: 0, total: 10,
    currentOrder: null,
    pizza: { size: "md", sauce: "tomato", cheese: "yes", toppings: new Set() }
  };

  function initRound() {
    state.currentOrder = {
      size: ["sm", "md", "lg"][Math.floor(Math.random() * 3)],
      sauce: ["tomato", "alfredo", "pesto"][Math.floor(Math.random() * 3)],
      cheese: ["yes", "no"][Math.floor(Math.random() * 2)],
      toppings: new Set([TOPPINGS[Math.floor(Math.random() * TOPPINGS.length)].id])
    };
    renderOrder();
  }

  function renderOrder() {
    document.getElementById("orderSize").textContent = state.currentOrder.size.toUpperCase();
    document.getElementById("orderSauce").textContent = state.currentOrder.sauce;
    document.getElementById("orderCheese").textContent = state.currentOrder.cheese;
    document.getElementById("orderToppings").textContent = Array.from(state.currentOrder.toppings).join(", ");
  }

  function toggleTopping(id) {
    if (state.pizza.toppings.has(id)) state.pizza.toppings.delete(id);
    else state.pizza.toppings.add(id);
    renderPizza();
  }

  function renderPizza() {
    const layer = document.getElementById("toppingLayer");
    layer.innerHTML = "";
    state.pizza.toppings.forEach(t => {
      for (let i = 0; i < 8; i++) {
        const d = document.createElement("div");
        d.className = `topping ${t}`;
        d.style.left = Math.random() * 80 + 10 + "%";
        d.style.top = Math.random() * 80 + 10 + "%";
        layer.appendChild(d);
      }
    });
    
    const p = document.getElementById("pizza");
    p.className = `pizza size-${state.pizza.size} sauce-${state.pizza.sauce} cheese-${state.pizza.cheese}`;
  }

  document.querySelectorAll(".segBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const d = e.target.dataset;
      if (d.size) state.pizza.size = d.size;
      if (d.sauce) state.pizza.sauce = d.sauce;
      if (d.cheese) state.pizza.cheese = d.cheese;
      
      e.target.parentElement.querySelectorAll(".segBtn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      renderPizza();
    });
  });

  document.getElementById("serveBtn").addEventListener("click", () => {
    const o = state.currentOrder;
    const p = state.pizza;
    const win = o.size === p.size && o.sauce === p.sauce && o.cheese === p.cheese;
    
    const chef = document.getElementById("chef");
    const chefText = document.getElementById("chefText");
    chef.classList.remove("hidden");
    
    if (win) {
      state.score += 10;
      state.done++;
      chefText.textContent = "Bellissimo! Perfect Pizza!";
      initRound();
    } else {
      chefText.textContent = "Mamma Mia! That's not what I ordered!";
    }
    
    document.getElementById("score").textContent = state.score;
    document.getElementById("done").textContent = state.done;
  });

  document.getElementById("chefClose").onclick = () => document.getElementById("chef").classList.add("hidden");

  // Init Topping Buttons
  const tBtns = document.getElementById("toppingButtons");
  TOPPINGS.forEach(t => {
    const b = document.createElement("button");
    b.className = "toppingBtn";
    b.textContent = t.label;
    b.onclick = () => {
      b.classList.toggle("active");
      toggleTopping(t.id);
    };
    tBtns.appendChild(b);
  });

  initRound();
})();
