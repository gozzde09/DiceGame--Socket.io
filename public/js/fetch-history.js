function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

const ulMessages = document.getElementById("allMessages");
const urlM = "https://dicegame-socket.onrender.com/messages";
// const urlM = "http://localhost:3000//messages";

fetch(urlM)
  .then((resp) => resp.json())
  .then(function (data) {
    // console.log(data);
    let message = data;
    return message.map(function (data) {
      let li = createNode("li");
      li.innerHTML = `<strong>${data.user}:</strong>  ${
        data.message
      } - <i>${new Date(data.date).toLocaleString("sv-SE")} <i>`;
      append(ulMessages, li);
    });
  })
  .catch(function (error) {
    console.log(error);
  });

function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

const ulResults = document.getElementById("allResults");
const urlR = "https://dicegame-socket.onrender.com/results";
// const urlR = "http://localhost:3000//results";

fetch(urlR)
  .then((resp) => resp.json())
  .then(function (data) {
    // console.log(data);
    let result = data;
    return result.map(function (data) {
      let li = createNode("li");
      li.innerHTML = `<strong>${data.userName}:</strong> Kastnr ${
        data.kastNummer
      } : ${data.kastPoang} / Totalt ${data.totalPoang}   <i>(${new Date(
        data.date
      ).toLocaleString("sv-SE")})<i>`;
      append(ulResults, li);
    });
  })
  .catch(function (error) {
    console.log(error);
  });
