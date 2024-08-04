import { useState } from 'react';

// Функциональный компонент React для рендеринга отдельного квадрата на доске
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // Функция обработки события клика по квадрату
  function handleClick(i) {
    // Проверяем, был ли определен победитель или квадрат уже был выбран
    // Если любое из этих условий выполняется, то возвращаемся, чтобы избежать дальнейших действий
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Создаем копию массива squares, чтобы избежать мутации оригинального массива
    const nextSquares = squares.slice();
    // В зависимости оттого, чей ход, устанавливаем значение квадрата как 'X' или 'O'
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // Вызываем функцию onPlay, чтобы обновить состояние игры с новым массивом squares
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Функция calculateWinner принимает массив squares, представляющий текущее состояние игрового поля 3x3.

function calculateWinner(squares) {
  // Массив lines содержит все возможные комбинации выигрышных линий в игре крестики-нолики на доске 3x3.
  const lines = [
    [0, 1, 2], // горизонтальные линии
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // вертикальные линии
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // диагональные линии
    [2, 4, 6],
  ];

  // Перебираем все возможные выигрышные линии.
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];              // Для текущей линии извлекаем индексы элементов

    // Проверяем, что элементы в данных индексах не являются пустыми (null, undefined, false, 0, пустая строка)
    // и все три элемента равны между собой.

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Возвращаем символ (X или O), который образует выигрышную линию.
    }
  }

  // Если ни одна из выигрышных линий не выполнена, возвращаем null, что означает отсутствие победителя.

  return null;
}

