const API_URL = 'http://localhost:8080/api';
const MINES_URL = API_URL + '/mines';
let field;
let scores = [];
let comments = [];

class Score {
  id = -1;
  game = 'mines';
  player;
  points;
  playedOn;

  constructor(player, points) {
    this.player = player;
    this.points = points;
    this.playedOn = JSON.parse(JSON.stringify(Date.now()));
  }
}

class Comment {
  id = -1;
  game = 'mines';
  player;
  comment;
  commentedOn;

  constructor(player, comment, commentedOn) {
    this.player = player;
    this.comment = comment;
    this.commentedOn = commentedOn;
  }

  get id() {
    return this.id;
  }

  set id(value) {
    this.id = value;
  }

  get game() {
    return this.game;
  }

  set game(value) {
    this.game = value;
  }

  get player() {
    return this.player;
  }

  set player(value) {
    this.player = value;
  }

  get comment() {
    return this.comment;
  }

  set comment(value) {
    this.comment = value;
  }

  get commentedOn() {
    return this.commentedOn;
  }

  set commentedOn(value) {
    this.commentedOn = value;
  }
}

const renderField = () => {
  // <div class="tile tile-1" row="0" col="0">1</div>
  // <div class="tile closed"></div>
  // <div class="tile marked"></div>
  // <div class="tile mine"></div>
  const mineFieldElem = document.querySelector("#minefield");
  mineFieldElem.innerHTML = ""; //reset the playing field in the UI
  mineFieldElem.setAttribute("style", "grid-template-columns: " + "0fr ".repeat(field.columnCount));

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const tile = field.tiles[r][c];
      const tileElem = document.createElement("div");

      if(tile.value === undefined && tile.state === "OPEN") {
        tileElem.setAttribute("class", "tile mine " + tile.state.toLowerCase());
      } else {
        tileElem.setAttribute("class", "tile tile-" + tile.value + " " + tile.state.toLowerCase());
        if(tile.state === "OPEN" && tile.value !== 0) {
          tileElem.innerHTML = tile.value;
        }
      }

      tileElem.addEventListener("click", () => openTile(r, c));
      tileElem.addEventListener("contextmenu", () => markTile(r, c, event));

      mineFieldElem.appendChild(tileElem);
    }
  }
};

const renderScores = () => {
  const scoresElem = document.querySelector("#scores");
  scoresElem.innerHTML = ""; //reset the score table in the UI

  for (const s of scores) {
    scoresElem.innerHTML += `
      <tr>
        <td>${s.player}</td>
        <td>${s.points}</td>
        <td>${new Date(s.playedOn).toLocaleString()}</td>
      </tr>
    `;
  }
};
const renderComments = () => {
  const commentsElem = document.querySelector("#comments");
  commentsElem.innerHTML = ""; //reset the score table in the UI

  for (const c of comments) {
    commentsElem.innerHTML += `
      <tr>
        <td>${c.player}</td>
        <td>${c.comment}</td>
        <td>${new Date(c.commentedOn).toLocaleString()}</td>
      </tr>
    `;
  }
};

const checkGameState = async () => {
  if(field.state !== "PLAYING") {
    const modalElem = document.querySelector("#winLoseModal");
    const modalTitle = document.querySelector("#modalHeader");
    const modalBody = document.querySelector("#modalContent");

    const title = field.state === "FAILED" ? 'You lost!' : 'You won!';
    const text = title + ' Do you want to play again?';

    if(field.state === "SOLVED") addScore();

    modalTitle.innerHTML = title;
    modalBody.innerHTML = text;

    // modalElem.classList.toggle('hidden');
    modalElem.setAttribute('style', 'opacity: 1;');
    modalElem.setAttribute('aria-hidden', 'false');
  }
}

const openTile = async (row, col) => {
  if(field.state !== "PLAYING") return;

  try {
    const response = await fetch(`${MINES_URL}/open?row=${row}&col=${col}`);
    if(response.status === 200) {
      field = await response.json();
      renderField();
      checkGameState();
    }
  } catch(err) {
    console.error("Sorry, an error occured", err);
  }
}
const markTile = async (row, col, event) => {
  event.preventDefault();
  if(field.state !== "PLAYING") return;

  try {
    const response = await fetch(`${MINES_URL}/mark?row=${row}&col=${col}`).then(
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
    console.error("Sorry, an error occured", err);
  }
}

// async function getDataFromAPI() {...}
const newGame = async (event) => {
  if(event)
    event.preventDefault(); //prevent browser refresh on form submit

  let rows = document.newGameForm.rows.value;
  let cols = document.newGameForm.cols.value;
  let mines = document.newGameForm.mines.value;

  if(!rows) rows = 10;
  if(!cols) cols = 10;
  if(!mines) mines = 10;

  try {
    const response = await fetch(`${MINES_URL}/new?rows=${rows}&cols=${cols}&mines=${mines}`);
    if(response.status === 200) {
      field = await response.json();
      renderField();
    }
  } catch(err) {
    console.error("Sorry, an error occured", err);
  }
};

const loadScores = async () => {
  try {
    const response = await fetch(API_URL +  '/score/mines');
    if(response.status === 200) {
      scores = await response.json();
      renderScores();
    }
  } catch(err) {
    console.error("Sorry, an error occured", err);
  }
}
const loadComments = async () => {
  try {
    const response = await fetch(API_URL +  '/comment/mines');
    if(response.status === 200) {
      comments = await response.json();
      renderComments();
    }
  } catch(err) {
    console.error("Sorry, an error occured", err);
  }
}

const addScore = async () => {
  let score = new Score('miska', 1000);
  console.log(score);
};

const addComment = async () => {
  const player = commentForm.name.value;
  const message = commentForm.comment.value;

  // const comment = {
  //   'game': 'mines',
  //   'player': player,
  //   'comment': message,
  //   'commentedOn': JSON.parse(JSON.stringify(Date.now()))
  // };

  const comment = new Comment(player, message, JSON.parse(JSON.stringify(Date.now())));
  delete comment.id;
  console.log(comment);

  try {
    const response = await fetch(`${API_URL}/comment`, {
      method: 'post',
      body: JSON.stringify(comment),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      console.log("Comment successfully added!");
      await loadComments();
    }
  } catch (error) {
    console.error(error);
  }
};

const newGameModal = async () => {
  newGame();
  closeModal();
}
const closeModal = async () => {
  const modalElem = document.querySelector("#winLoseModal");
  // modalElem.classList.toggle('hidden');
  modalElem.setAttribute('style', 'opacity: 0; z-index: -10;');
  modalElem.setAttribute('aria-hidden', 'true');
}

window.onload = () => {
  loadScores();
  loadComments();
  //loadRating();
  newGame();
}//when DOM is ready and all content, including images, is loaded
// window.addEventListener("load", renderField);
// $(document).ready(renderField); //when the DOM is ready //you have to have jquery added in head
// document.addEventListener("DOMContentLoaded", newGame);