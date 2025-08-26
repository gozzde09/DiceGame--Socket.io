const socket = io();
//USER FORM
const formUser = document.querySelector("#formUser");
const inputUser = document.querySelector("#inputUser");
const userContainer = document.querySelector("#userContainer");

let myUser;
formUser.addEventListener("submit", function (e) {
  e.preventDefault();
  myUser = inputUser.value;
  userContainer.innerHTML = "<h2>Välkommen " + myUser + "!</h2>";
  document.getElementById("message").style.display = "block";
  document.getElementById("messages").style.display = "block";
  inputUser.value = " ";
});
document.addEventListener("DOMContentLoaded", function () {
  inputUser.value = ""; // Rensar inmatningsfältet vid laddning av sidan
});

//MESSAGE FORM
const formMessage = document.querySelector("#formMessage");
const inputMessage = document.querySelector("#inputMessage");

const messages = document.querySelector("#messages");

formMessage.addEventListener("submit", function (e) {
  e.preventDefault();
  if (inputMessage.value) {
    socket.emit("chatMessage", { user: myUser, message: inputMessage.value });
    inputMessage.value = "";
  }
});

socket.on("newChatMessage", function (msg) {
  let item = document.createElement("p");
  item.innerHTML = `<strong>${msg.user}</strong>: ${msg.message}`;
  messages.appendChild(item);
});

//TÄRNING
let totalPoang = 0;
let kastNummer = 1;

// Funktion för att kasta en tärning
function kastaTarning() {
  return Math.floor(Math.random() * 6) + 1;
}

// Funktion för att uppdatera spelet vid varje knapptryckning
function uppdateraTarningsspel() {
  if (totalPoang < 21) {
    let kast = kastaTarning();
    totalPoang += kast;
    const resultContainer = document.getElementById("result");
    const resultText = `<strong>Kast ${kastNummer}: </strong> Du fick ${kast}. Din totala poäng blev ${totalPoang}.`;
    const resultTextmessage = `<i>Kast ${kastNummer}: ${myUser} fick ${kast}. Totalt: ${totalPoang}</i>`;
    resultContainer.innerHTML = resultText;

    socket.emit("diceRoll", resultTextmessage);
    kastNummer++;
    if (totalPoang >= 21) {
      if (totalPoang === 21) {
        resultContainer.innerHTML += " Grattis! Du har exakt 21 poäng!";
      } else {
        resultContainer.innerHTML += ` Spelet är över! Du fick ${totalPoang} poäng.`;
      }
      document.getElementById("diceButton").disabled = true; // Inaktivera knappen när spelet är över
    }
  }
}

// Event listener för knappen
document
  .getElementById("diceButton")
  .addEventListener("click", uppdateraTarningsspel);

socket.on("newDiceRoll", function (result) {
  let item = document.createElement("p");
  item.innerHTML = result.data;
  item.style.color = result.color;
  messages.appendChild(item);
});
