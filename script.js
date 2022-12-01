const Player = (sign) => {
  let _sign = sign;
  const getSign = () => _sign;
  return {
    getSign,
  };
};

const gameBoard = (() => {
  const _board = new Array(9).fill("");

  const getField = (index) => _board[index];

  const setField = (index, sign) => (_board[index] = sign);

  const reset = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = "";
    }
  };

  return { getField, setField, reset };
})();

const displayController = (() => {
  const fieldElements = document.querySelectorAll(".field");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  fieldElements.forEach((field) =>
    field.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
    })
  );

  restartButton.addEventListener("click", (e) => {
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    setMessageElement("Player X's Turn");
  });

  const updateGameboard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].textContent = gameBoard.getField(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      setMessageElement("It's a draw!");
    } else {
      setMessageElement(`Player ${winner} has won!`);
    }
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };
})();

const gameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let round = 1;
  let isOver = false;

  const playRound = (fieldIndex) => {
    gameBoard.setField(fieldIndex, getCurrentPlayerSign());
    if (checkWinner(fieldIndex)) {
      displayController.setResultMessage(getCurrentPlayerSign());
      isOver = true;
      return;
    }
    if (round === 9) {
      displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageElement(
      `Player ${getCurrentPlayerSign()}'s turn`
    );
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 0 ? playerO.getSign() : playerX.getSign();
  };

  const checkWinner = (fieldIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((subCombination) =>
        subCombination.every(
          (index) => gameBoard.getField(index) === getCurrentPlayerSign()
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, reset };
})();
