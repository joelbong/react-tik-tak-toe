import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button 
            className="square"
            style={props.style}
            onClick={props.onClick}
        >
          {props.value}
        </button>
      );
  }
  
class Board extends React.Component {
    renderSquare(i, style) {
        return (
            <Square
                style={style}
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderBoard(rowMax, colMax, winningSet) {
        let board = [];
        for(let row = 0; row < rowMax; row++) {
            let squares = []
            for(let col = 0; col < colMax; col++) {
                let squareNumber = col+row*3;
                let style = {}
                if (winningSet.includes(squareNumber)) {
                    style ={color:'red'}
                }
                squares.push(this.renderSquare(squareNumber, style))
            }
            board.push(<div className="board-row" key={row}>{squares}</div>)
        }

        return board
    }
  
    render() {
        return (
            <div>
                {this.renderBoard(3, 3, this.props.winningSet)}
            </div>
        );
    }
  }
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: {
                    row: null,
                    column: null
                }
            }],
            xIsNext: true,
            stepNumber:0,
            reverse: false
        }
    }

    handleSwitch() {
        this.setState({
            reverse: !this.state.reverse,
        })
    }

    makeList(history) {
        return history.map((step, move) => {
            const desc = !(step.location.row == null)? 
                'Go to move #' + move + '(' + step.location.column.toString(10) + ',' + step.location.row.toString(10) + ')':
                'Go to game start';
            
                return (
                    <li key={move}>
                        <button 
                            onClick={() => this.jumpTo(move)} 
                            style={move===this.state.stepNumber ? {'fontWeight': 'bold'}:{}}
                        >{desc}</button>
                    </li>
                )
        })
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); 
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: {
                    row: Math.floor(i/3),
                    column: i%3,
                }
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        let winningSet = [];
        if (winner) {
            status = 'Winner ' + winner.winner;
            winningSet = winner.winningSet;
        } else if(!(current.squares.includes(null))){
            status = 'Draw';
        }else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');    
        }
        
        const moves = this.makeList(history)

        return (
            <div className="game">
            <div className="game-board">
                <Board
                    winningSet={winningSet}
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{this.state.reverse ? moves.reverse(): moves}</ol>
                <button className="btn-switch" onClick={this.handleSwitch.bind(this)}>{this.state.reverse ? 'Ascending': 'Descending'}</button>
            </div>
            </div>
        );
    }
  }
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
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
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
            winner: squares[a],
            winningSet: lines[i]
        };
      }
    }
    return null;
  }
  