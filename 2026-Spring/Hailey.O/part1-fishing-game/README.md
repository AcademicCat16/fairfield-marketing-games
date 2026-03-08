### JS Settings – External Script Required

This game uses **GSAP (TweenMax)** for the success screen animations.

To add it in CodePen:

1. Click the **gear ⚙️ icon** on the JS panel
2. Under **"Add External Scripts"**, paste this URL:

```
https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js
```

3. Click **Save & Close**

> ⚠️ Without this, the game will crash when you win and throw a `TweenMax is not defined` error in the console.
