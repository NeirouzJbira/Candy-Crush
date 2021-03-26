document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const scoreBoard = document.getElementById("score");
  const movesBoard = document.getElementById("moves");
  const oneStar = document.querySelector(".one-star");
  const twoStar = document.querySelector(".two-star");
  const threeStar = document.querySelector(".three-star");
  const width = 8;
  const squares = [];
  let score = 0;
  let movesLeft = 20;

  const candyColors = [
    "url(assets/img/blue.png)",
    "url(assets/img/green.png)",
    "url(assets/img/orange.png)",
    "url(assets/img/purple.png)",
    "url(assets/img/red.png)",
    "url(assets/img/yellow.png)",
  ];

  // Audio
  const resetAudio = new Audio();
  resetAudio.src = "assets/audio/reset.wav";
  const gameOverAudio = new Audio();
  gameOverAudio.src = "assets/audio/game_over.wav";
  const invalidMoveAudio = new Audio();
  invalidMoveAudio.src = "assets/audio/negative_switch.wav";
  const sugarCrushAudio = new Audio();
  sugarCrushAudio.src = "assets/audio/sugar_crush.wav";
  const deliciousAudio = new Audio();
  deliciousAudio.src = "assets/audio/delicious.wav";
  const divineAudio = new Audio();
  divineAudio.src = "assets/audio/divine.wav";
  const tastyAudio = new Audio();
  tastyAudio.src = "assets/audio/tasty.wav";
  const candyOneAudio = new Audio();
  candyOneAudio.src = "assets/audio/candy_1.wav";

  // Mute audio
  function muteAudio() {
    resetAudio.muted = true;
    gameOverAudio.muted = true;
    invalidMoveAudio.muted = true;
    sugarCrushAudio.muted = true;
    deliciousAudio.muted = true;
    divineAudio.muted = true;
    tastyAudio.muted = true;
    candyOneAudio.muted = true;
  }

  // Play audio
  function playAudio() {
    resetAudio.muted = false;
    gameOverAudio.muted = false;
    invalidMoveAudio.muted = false;
    sugarCrushAudio.muted = false;
    deliciousAudio.muted = false;
    divineAudio.muted = false;
    tastyAudio.muted = false;
    candyOneAudio.muted = false;
  }

  // Create 8x8 board and add 64 squares
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomCandy = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomCandy];
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoard();

  // Add drag features to the candies
  let candyBeingDragged;
  let candyBeingReplaced;
  let candyIdBeingDragged;
  let candyIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    candyBeingDragged = this.style.backgroundImage;
    candyIdBeingDragged = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {
    this.style.backgroundImage = candyBeingDragged;
  }

  function dragDrop() {
    candyBeingReplaced = this.style.backgroundImage;
    candyIdBeingReplaced = parseInt(this.id);
    squares[candyIdBeingDragged].style.backgroundImage = candyBeingReplaced;
    squares[candyIdBeingReplaced].style.backgroundImage = candyBeingDragged;
  }

  function dragEnd() {
    let validMoves = [
      candyIdBeingDragged - 1,
      candyIdBeingDragged - width,
      candyIdBeingDragged + 1,
      candyIdBeingDragged + width,
    ];
    let validMove = validMoves.includes(candyIdBeingReplaced);

    // If a valid move
    if (candyIdBeingReplaced && validMove) {
      let scoredRowOfThree = checkRowForThree();
      let scoredColumnOfThree = checkColumnForThree();
      let scoredRowOfFour = checkRowForFour();
      let scoredColumnOfFour = checkColumnForFour();
      let scoredRowOfFive = checkRowForFour();
      let scoredColumnOfFive = checkColumnForFive();
      // Check if any combo matches
      if (
        scoredRowOfThree ||
        scoredColumnOfThree ||
        scoredRowOfFour ||
        scoredColumnOfFour ||
        scoredRowOfFive ||
        scoredColumnOfFive
      ) {
        candyIdBeingReplaced = null;
        scoreBoard.innerHTML = score;
        candyOneAudio.play();
        if (score > 0 && score <= 30) {
          oneStar.style.color = "#fefb38";
        } else if (score > 30 && score <= 70) {
          twoStar.style.color = "#fefb38";
        } else {
          threeStar.style.color = "#fefb38";
        }
        // Update moves left
        if (movesLeft <= 0) {
          grid.style.pointerEvents = "none";
          gameOverAudio.play();
        }
        // If no combo matches
      } else if (
        !scoredRowOfThree &&
        !scoredColumnOfThree &&
        !scoredRowOfFour &&
        !scoredColumnOfFour &&
        !scoredRowOfFive &&
        !scoredColumnOfFive
      ) {
        squares[candyIdBeingDragged].style.backgroundImage = candyBeingDragged;
        squares[
          candyIdBeingReplaced
        ].style.backgroundImage = candyBeingReplaced;
        invalidMoveAudio.play();
      }
      // If move is not valid, swap the candies back
    } else if (candyIdBeingReplaced && !validMove) {
      squares[candyIdBeingDragged].style.backgroundImage = candyBeingDragged;
      squares[candyIdBeingReplaced].style.backgroundImage = candyBeingReplaced;
      invalidMoveAudio.play();
    } else {
      squares[candyIdBeingDragged].style.backgroundImage = candyBeingDragged;
    }
  }

  // Drop candies to the bottom
  function dropCandies() {
    // Loop through the first 7 rows
    for (let i = 0; i < 55; i++) {
      if (squares[i + width].style.backgroundImage == "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
      }
    }
  }

  // Check for matches
  // Check for row of three
  function checkRowForThree() {
    for (let i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let firstCandy = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === firstCandy && !isBlank
        )
      ) {
        score += 3;
        scoreBoard.innerHTML = score;
        movesBoard.innerHTML = movesLeft--;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
        return true;
      }
    }
    return false;
  }

  // Check for column of three
  function checkColumnForThree() {
    for (let i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let firstCandy = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      if (
        columnOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === firstCandy && !isBlank
        )
      ) {
        score += 3;
        scoreBoard.innerHTML = score;
        movesBoard.innerHTML = movesLeft--;
        columnOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
        return true;
      }
    }
    return false;
  }

  // Check for row of four
  function checkRowForFour() {
    for (let i = 0; i < 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let firstCandy = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      const notValid = [
        5,
        6,
        7,
        13,
        14,
        15,
        22,
        23,
        29,
        30,
        31,
        37,
        38,
        39,
        45,
        46,
        47,
        53,
        54,
        55,
      ];
      if (notValid.includes(i)) continue;
      if (
        rowOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === firstCandy && !isBlank
        )
      ) {
        sugarCrushAudio.play();
        score += 4;
        scoreBoard.innerHTML = score;
        movesBoard.innerHTML = movesLeft--;
        rowOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
        return true;
      }
    }
    return false;
  }

  // Check for column of four
  function checkColumnForFour() {
    for (let i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let firstCandy = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      if (
        columnOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === firstCandy && !isBlank
        )
      ) {
        sugarCrushAudio.play();
        score += 4;
        scoreBoard.innerHTML = score;
        movesBoard.innerHTML = movesLeft--;
        columnOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
        return true;
      }
    }
    return false;
  }

  // Check for row of five
  function checkRowForFive() {
    for (let i = 0; i < 58; i++) {
      let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
      let firstCandy = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      const notValid = [
        4,
        5,
        6,
        7,
        12,
        13,
        14,
        15,
        20,
        21,
        22,
        23,
        28,
        29,
        30,
        31,
        36,
        37,
        38,
        39,
        44,
        45,
        46,
        47,
        52,
        53,
        54,
        55,
      ];
      if (notValid.includes(i)) continue;
      if (
        rowOfFive.every(
          (index) =>
            squares[index].style.backgroundImage === firstCandy && !isBlank
        )
      ) {
        score += 5;
        scoreBoard.innerHTML = score;
        movesBoard.innerHTML = movesLeft--;
        rowOfFive.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
        return true;
      }
    }
    return false;
  }

  // Check for column of five
  function checkColumnForFive() {
    for (let i = 0; i < 39; i++) {
      let columnOfFive = [
        i,
        i + width,
        i + width * 2,
        i + width * 3,
        i + width * 4,
      ];
      let firstCandy = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      if (
        columnOfFive.every(
          (index) =>
            squares[index].style.backgroundImage === firstCandy && !isBlank
        )
      ) {
        score += 5;
        scoreBoard.innerHTML = score;
        movesBoard.innerHTML = moves--;
        columnOfFive.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
        return true;
      }
    }
    return false;
  }

  // Reset game
  document.querySelector(".reset-btn").addEventListener("click", () => {
    resetAudio.play();
    grid.style.pointerEvents = "auto";
    score = 0;
    scoreBoard.innerHTML = score;
    movesLeft = 20;
    movesBoard.innerHTML = movesLeft;
    oneStar.style.color = "";
    twoStar.style.color = "";
    threeStar.style.color = "";
  });

  document.querySelector(".mute").addEventListener("click", muteAudio);
  document.querySelector(".play").addEventListener("click", playAudio);

  window.setInterval(() => {
    for (let i = 0; i < 8; i++) {
      if (squares[i].style.backgroundImage === "") {
        let randomCandy = Math.floor(Math.random() * candyColors.length);
        squares[i].style.backgroundImage = candyColors[randomCandy];
      }
    }
    dropCandies();
    checkRowForFive();
    checkColumnForFive();
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
  }, 100);
});
