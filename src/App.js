import { useState } from 'react';
import './App.css'
    
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, cubesize }) {
  const buildBoard = () => {
    const cubevalue = cubesize ? cubesize : 3 
    const board = [];
    for (let rowNumber = 0; rowNumber < cubevalue; rowNumber++) {
      const rowStart = rowNumber * cubevalue;
      const newRow = [];
      for (let columnNumber = 0; columnNumber < cubevalue; columnNumber++) {
        const squareIndex = rowStart + columnNumber;
        newRow.push(
          <Square
            value={squares[squareIndex]}
            onSquareClick={() => handleClick(squareIndex)}
          />
        );
      }
      board.push(
        <div key={rowNumber} className='row'>
          {newRow}
        </div>
      );
    }
    return board;
  };

  function handleClick(i) {
    if (calculateWinner(squares, cubesize) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, cubesize);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {buildBoard()}
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [cube, setCube] = useState(3);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }



  return (
    <div className="game">
    <div className="header"> 
      <h1>React Tic Tac toe</h1>
    </div>
      <div className="header">
        <input type="number" value={cube} onChange={(e)=>setCube(e.target.value)} min="3"/>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} cubesize={cube} />
      </div>
      <div className="game-info">
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, cubesize) {
  const lines = [];


  for (let i = 0; i < cubesize; i++) {
    const row = [];
    for (let j = 0; j < cubesize; j++) {
      row.push(i * cubesize + j);
    }
    lines.push(row);
  }

  for (let i = 0; i < cubesize; i++) {
    const col = [];
    for (let j = 0; j < cubesize; j++) {
      col.push(j * cubesize + i);
    }
    lines.push(col);
  }


  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < cubesize; i++) {
    diag1.push(i * cubesize + i);
    diag2.push(i * cubesize + (cubesize - i - 1));
  }
  lines.push(diag1);
  lines.push(diag2);


  for (let i = 0; i < lines.length; i++) {
    const [a, ...rest] = lines[i];
    if (squares[a] && rest.every(index => squares[index] === squares[a])) {
      return squares[a];
    }
  }
  return null;
}
