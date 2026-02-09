const root = document.documentElement;

const body = document.getElementById("body")
const nav = document.getElementById("nav")
const Main = document.getElementById("main")

const mashine_box = document.getElementById("mashine_box")
const slot1 = document.getElementById("slot1");
const slot1_border = document.getElementById("slot1_border");
const slot2 = document.getElementById("slot2");
const slot2_border = document.getElementById("slot2_border");
const slot3 = document.getElementById("slot3");
const slot3_border = document.getElementById("slot3_border");
const message_text = document.getElementById("message_text");

const balance_elem = document.getElementById("balance");
const bet_elem = document.getElementById("bet");
const spin = document.getElementById("spin");

const container = document.getElementById("container")

const coins = document.getElementsByClassName("coin")
const m05 = document.getElementById("m05")
const win_box = document.getElementById("win_box")
const won_win_condition_label = document.getElementById("won_win_condition_label")
const win_amount_label = document.getElementById("win_amount_label")

const wheel = document.getElementById("wheel");

const slot_rotation_speed = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slot_rotation_speed"));

let balance = {value:3000};
const slot_speed = 1000;
let spinning = false;

const money_prefix = "£";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
balance_elem.textContent = "Your balance: " + money_prefix + balance.value;
async function update_balance(amount, operation) {
  const start = balance.value;
  if (operation === "+") {
    balance.value = start + amount;
    for (let i = 0; i <= amount; i+=5) {
      balance_elem.textContent = "Your balance: " + money_prefix + (start + i);
      await sleep(5);
    }
  } else {
    balance.value = start - amount;
    for (let i = 0; i <= amount; i+=10) {
      balance_elem.textContent = "Your balance: " + money_prefix + (start - i);
      await sleep(1);
    }
  }
}


async function falling_coins_effect(ms_life_time){
  m05.style.display = "flex"
  nav.style.zIndex = "120"
  m05.style.backgroundColor = "rgba(0, 0, 0,0)"
  async function flip_coin(coin) {
    await sleep(Math.floor(Math.random() * 3001 + 1000))
    const duration = Math.floor(Math.random() * 1301 + 700)
    coin.style.animation = `fall ${duration}ms linear infinite`
    await sleep(ms_life_time)
    coin.style.animation = "none"
    await sleep(ms_life_time)
    coins[i].style.opacity = "0"
  }

  for (let i = 0; i < coins.length; i++) {
    flip_coin(coins[i]);
  }
  await sleep(ms_life_time+3000)
}

let zoomM = 0.025
let zoomV = 1.0
async function resize_text_effect(elem){
  zoomV += zoomM
  zoomM *= 2
  await sleep(450)
  elem.style.fontSize = "200pt"
  elem.style.lineHeight = "0.7"
  Main.style.transform = "scale("+zoomV+")"
  console.log(zoomM)
  await sleep(500)
  elem.style.fontSize = "130pt"
  elem.style.lineHeight = "1.3"
}


async function explosion_effect(){
  resize_text_effect(slot1)
  setTimeout(() => resize_text_effect(slot2), 1000);
  setTimeout(() => resize_text_effect(slot3), 2000);
  await sleep(100)
  m05.style.backgroundColor = "rgba(0, 0, 0,0.8)"
  nav.style.zIndex = "80"
  body.style.overflowY= "hidden"
  m05.style.display = "flex"
  window.moveTo(0,0)
  await sleep(3500)
  Main.style.transform = "scale(1)"
}

function waitForClick() {
  return new Promise(resolve => {
    document.onclick = () => resolve();
  });
}


async function show_amount(amount_won,w_con) {
  await sleep(100)
  m05.style.zIndex = "84"
  m05.style.backgroundColor = "rgba(0, 0, 0,0.8)"
  nav.style.zIndex = "80"
  body.style.overflowY= "hidden"
  m05.style.display = "flex"
  await sleep(100)
  win_box.style.opacity = "1"
  won_win_condition_label.textContent = w_con
  win_amount_label.textContent = "Won "+money_prefix+String(amount_won)
  won_win_condition_label.style.animation = "appear_from_bottom 2s ease forwards"
  win_amount_label.style.animation = "appear_from_top 2s ease forwards"
  await waitForClick()
  win_box.style.opacity = "0"
  await sleep(1000)
}

window.moveTo(0,0)
async function win_effect(bet,multipier) {
  const amount_won = bet*multipier;
  m05.style.display = "flex"
  nav.style.zIndex = "120"
  m05.style.zIndex = "81"
  Main.style.zIndex = "83"
  m05.style.backgroundColor = "rgba(0, 0, 0,0)"
  let w_con = null;
  switch(multipier){
    case 2:{
      w_con = "Three of a kind"
      await show_amount(amount_won,w_con)
      await falling_coins_effect(3000)
      break;
    }
    case 3:{
      w_con = "Three of zero"
      await explosion_effect()
      await show_amount(amount_won,w_con)
      //await falling_coins_effect(3000)
      break;
    }
    case 7:{
      w_con = "Three of seven"
      await explosion_effect()
      await show_amount(amount_won,w_con)
      await falling_coins_effect(6000)
      break;
    }
  }
  
  m05.style.backgroundColor = "rgba(0, 0, 0,0)"
  win_box.style.opacity = "0"
  await sleep(1000)
  m05.style.zIndex = "83"
  nav.style.zIndex = "120"
  m05.style.display = "none"
  body.style.overflowY = "scroll"
  zoomV = 1.0
  zoomM = 0.05
}



async function roll_slot(number, slot, slot_border) {
  slot.style.transform = "scaleY(-.3)";
  slot_border.style.justifyContent = "flex-start";
  slot.style.height = "0%";
  slot.style.opacity = "0";
  slot.style.transform = "scaleY(.3)";
  slot.style.opacity = "0";

  await sleep(slot_rotation_speed);
  slot.style.height = "100%";
  slot.textContent = number;
  slot_border.style.justifyContent = "flex-end";
  slot.style.opacity = "1";
  slot.style.transform = "scaleY(1)";
  await sleep(slot_rotation_speed);
}

const mx = 7
const mn = 7
async function main(balance, bet, delay, rounds,win_nums) {
  const r1 = win_nums.r1;
  const r2 = win_nums.r2;
  const r3 = win_nums.r3;
  //if (!spinning) console.log("Current combination: "+r1+" | "+r2+" | "+r3)
  spinning = true;
  delay.value += (delay.value / slot_speed);
  rounds.value += 1;   



  let dr1 = Math.floor(Math.random() * (mx-mn) +mn)
  let dr2 = Math.floor(Math.random() * (mx-mn) +mn);
  let dr3 = Math.floor(Math.random() * (mx-mn) +mn);

  roll_slot(dr1, slot1, slot1_border)
  setTimeout(() => roll_slot(dr2, slot2, slot2_border), 1000)
  setTimeout(() => roll_slot(dr3, slot3, slot3_border), 2000)

  await sleep(delay.value);

  if(rounds.value === 35){

    if(r1===r2 && r2===r3){
      if(r1 === 0){
        win_effect(bet,3)
      }else if(r1===7){
        win_effect(bet,7)
      }
    }

  }

  if (rounds.value < 40) {
    main(balance, bet, delay, rounds,win_nums);
  } else {
    spinning = false;
    await sleep(100)
    for(i=0;i<40;i++){
      slot1.textContent = r1
      slot2.textContent = r2
      slot3.textContent = r3
      await sleep(80)
    }
    const t = 1800;

    if (r1 === r2 && r2 === r3) {
      if (r1 === 7) {
        await sleep(t)
        update_balance(bet * 7, "+");
      } else if (r1 === 0) {
        await sleep(t)
        update_balance(bet * 3, "+");
      } else {
        await sleep(t)
        win_effect(bet,2)
        update_balance(bet * 2, "+");
      }
    } else if ((r1 === r2 && r3 === 0) || (r2 === r3 && r1 === 0) || (r1 === r3 && r2 === 0)) {
      await sleep(t)
      update_balance(bet * 1.3, "+");
    } else if ((r1 === r2 && r3 === 7) || (r2 === r3 && r1 === 7) || (r1 === r3 && r2 === 7)) {
      await sleep(t)
      update_balance(bet * 1.7, "+");
    } else if ((r1 === r2) || (r2 === r3) || (r1 === r3)) {
      await sleep(t)
      update_balance(bet * 0.5, "+");
    }
  }
}


spin.onclick = async () => {
  if (!spinning) {
    let rounds = {value: 0};
    let delay = {value: 110};

    const win_nums = {
      "r1":Math.floor(Math.random() * (mx-mn) +mn),
      "r2":Math.floor(Math.random() * (mx-mn) +mn),
      "r3":Math.floor(Math.random() *(mx-mn) +mn),
    } 

    wheel.style.transition = "none";
    wheel.style.transform = `translate(-50%, -50%) rotate(0deg)`;
    wheel.offsetHeight;
    wheel.style.transition = "all var(--wheel_rotation_speed) ease-out";
    root.style.setProperty("--slot_rotation_speed", "200ms");
    document.documentElement.style.setProperty('--wheel_rotation_speed', '1.3s');
  
    let bet = parseInt(bet_elem.value) || 0;
    bet_elem.value = "";

    if (balance.value <= 0) {
      //flicker_effect("No money to spin");
    } else {
      if (bet <= balance.value && bet > 0) {
        wheel.style.transform = `translate(-50%, -50%) rotate(-120deg)`;
        await sleep(400)
        document.documentElement.style.setProperty('--wheel_rotation_speed', '800ms');
        wheel.style.transform = `translate(-50%, -50%) rotate(360deg)`;
        update_balance(bet, "-");
        main(balance, bet, delay,rounds,win_nums);
      } else {
        //flicker_effect("Bet needs to be lower or equal");
      }
    }
  }else{
    console.log("Spinning")
  }
};
