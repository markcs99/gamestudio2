const renderField = () => {
  // <div class="tile tile-1" row="0" col="0">1</div>
  // <div class="tile closed"></div>
  // <div class="tile marked"></div>
  // <div class="tile connect"></div>
  const connectFieldElem = document.querySelector("#connectfield");
  connectFieldElem.innerHTML = "";
  connectFieldElem.setAttribute("style", "grid-template-columns: " + "0fr ".repeat(field.cols));

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const tile = field.tiles[r][c];
      const tileElem = document.createElement("div");
        tileElem.setAttribute("class", "tile tile-" + tile.player);
        tileElem.innerHTML = tile.player;
      tileElem.addEventListener("click", () => openTile(r, c));
      tileElem.addEventListener("contextmenu", () => markTile(r, c, event));
      connectFieldElem.appendChild(tileElem);
    }
  }
};

const openTile = async (row, col) => {
  try {
    const response = await fetch(`${CONNECT_URL}/move?col=${col}`);
    if(response.status === 200) {
      field = await response.json();
      renderField();
    }
  } catch(err) {
    console.error("Sorry, an error occured", err); }
}

const markTile = async (row, col, event) => {
  event.preventDefault();
  try {
    const response = await fetch(`${CONNECT_URL}/mark?row=${row}&col=${col}`).then(
      response => {
        if(response.status === 200) {
          response.json().then(data => {
            field = data;
            renderField();
          });
        }
      }
    )
  } catch(err) {
    console.error("Sorry, an error occured", err); }
}

const CONNECT_URL =
  'http://localhost:8080/api/connect';
let field;

// async function getDataFromAPI() {...}
const newGame = async () => {
  try {
    const response = await fetch(CONNECT_URL +  '/new?rows=10&cols=10');
    if(response.status === 200) {
      field = await response.json();
      renderField();
    }
  } catch(err) {
    console.error("Sorry, an error occured", err); }
};

window.onload = newGame; //when DOM is ready and all content, including images, is loaded
// window.addEventListener("load", renderField);
// $(document).ready(renderField); //when the DOM is ready //you have to have jquery added in head
// document.addEventListener("DOMContentLoaded", newGame);