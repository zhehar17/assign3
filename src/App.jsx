import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

const { Badge, Button, Card } = ReactBootstrap

import { useState } from 'react';
import { createWebSocketModuleRunnerTransport } from 'vite/module-runner';

function Square({ value, onSquareClick }) {
  return (<button onClick={onSquareClick} className="square">{value}</button>);
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [firstClick, setFirstClick] = useState(null);
  const turn = squares.filter(p => p === 'O').length + 1;

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner ${winner}`;
  } else {
    status = `Next player ${xIsNext ? 'X' : 'O'}`;
  }


  function handleClick(i) {
    if ((squares[i] && turn <= 3) || calculateWinner(squares)) return;

    const nextSquares = squares.slice();

    if (turn > 3) {
      if (firstClick === null) {
        setFirstClick(i);
        return;
      }

      nextSquares[firstClick] = null;
      setFirstClick(null);

      if ((squares[firstClick] !== 'X' && xIsNext) || (squares[firstClick] !== 'O' && !xIsNext) || squares[i] !== null) return;
      if (!checkAdjacent(firstClick, i)) return;
    }
    nextSquares[i] = xIsNext ? 'X' : 'O';

    if (turn > 3) {
      if (!calculateWinner(nextSquares) && ((xIsNext && squares[4] === 'X' && nextSquares[4] === 'X') || (!xIsNext && squares[4] === 'O' && nextSquares[4] === 'O'))) return;
    }

    setSquares(nextSquares);
    setXIsNext(prev => !prev);
  }

  return (
    <>
      <div className="status">{`Turn ${turn}`}</div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
}

function checkAdjacent(firstClick, i) {
  const tileIndices = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];

  const fi = Math.floor(firstClick / 3);
  const fj = firstClick % 3;

  return (fi < 2 && i === tileIndices[fi + 1][fj]) || (fi > 0 && i === tileIndices [fi - 1][fj]) || fj < 2 && (i === tileIndices[fi][fj + 1]) || (fj > 0 && i === tileIndices[fi][fj - 1]) || (fi < 2 && fj > 0 && i === tileIndices[fi + 1][fj - 1]) || (fi < 2 && fj < 2 && i === tileIndices[fi + 1][fj + 1]) || (fi > 0 && fj > 0 && i === tileIndices[fi - 1][fj - 1]) || (fi > 0 && fj < 2 && i === tileIndices[fi - 1][fj + 1]);
}