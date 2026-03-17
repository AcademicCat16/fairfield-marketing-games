let gold = 50
let wood = 0
let herbs = 0
let potions = 0
let planks = 0

function updateUI(){
  document.getElementById("gold").innerText = gold
  document.getElementById("wood").innerText = wood
  document.getElementById("herbs").innerText = herbs
  document.getElementById("potions").innerText = potions
  document.getElementById("planks").innerText = planks
}

function gatherWood(){
  wood++
  updateUI()
}

function gatherHerbs(){
  herbs++
  updateUI()
}

function craftPotion(){
  if(herbs >= 2){
    herbs -= 2
    potions++
  }else{
    alert("Not enough herbs")
  }
  updateUI()
}

function craftPlank(){
  if(wood >= 2){
    wood -= 2
    planks++
  }else{
    alert("Not enough wood")
  }
  updateUI()
}

function sellPotion(){
  if(potions > 0){
    potions--
    gold += 15
  }
  updateUI()
}

function sellPlank(){
  if(planks > 0){
    planks--
    gold += 10
  }
  updateUI()
}

updateUI()
