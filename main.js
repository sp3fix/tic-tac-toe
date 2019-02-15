const gameBoard = (() => {
    let container = document.querySelector('.container');
    const createSquare = () => {
        for(j = 0; j < 9; j++) {
            let newSquare = document.createElement('div');
            newSquare.setAttribute('class',"gridElement");
            newSquare.setAttribute('id',`el${j}`);
            tokenSpace = document.createElement('span');
            newSquare.appendChild(tokenSpace);
            newSquare.addEventListener('click', function() {game.playerMove(newSquare.firstChild);}, false)
            container.appendChild(newSquare);
        }
    }
    const editableButtons = () => {
        let editButtons = document.querySelectorAll('.edit');
        Array.from(editButtons).map(button => button.addEventListener('keypress', function(evt) {
        if (evt.which === 13) { evt.preventDefault(); }
        if (this.textContent.length >= 10 ) { evt.preventDefault(); }
        (this.id == 'player1') ? players.player1.name = this.textContent : players.player2.name = this.textContent;
        }));
    }
    const createWinScreen = () => {
        winScreen = document.createElement('div');
        winScreen.setAttribute('id', 'winScreen');
        winText = document.createElement('div');
        winText.setAttribute('id', 'winText');
        resetButton = document.createElement('div');
        resetButton.setAttribute('id', 'resetButton');
        resetButton.addEventListener('click', game.resetGame)
        winScreen.appendChild(winText);
        winScreen.appendChild(resetButton);
        winScreen.setAttribute('style','display: none')
        document.querySelector('.grid').appendChild(winScreen);
    }
    return { createSquare, editableButtons, createWinScreen}
})();
  
const players = (() => {
    const player1 = {name : 'Player 1', token : 'X'};
    const player2 = {name : 'Player 2', token : 'O'};
    return {player1, player2};
})();

const game = (() => {
    let round = 1;
    const horizontal = [0,3,6].map(i=>{return[i,i+1,i+2]});
    const vertical = [0,1,2].map(i=>{return[i,i+3,i+6]});
    const diagonal = [[0,4,8],[2,4,6]];
    var allwins = [].concat(horizontal).concat(vertical).concat(diagonal);
    const playerMove = (node) => {
        let currentPlayer = (round % 2) ? players.player1 : players.player2;
        if (node.textContent == "") {
            editSquare(node,currentPlayer);
            winScreenVisible(node,currentPlayer);
            changeFontColor(node, round);
        }
    }

    const editSquare = (node,currentPlayer) => {
        node.textContent = currentPlayer.token;
        round ++;
    }

    const changeFontColor = (node, round) => {
        node.setAttribute('class', (round % 2) ? 'red' : 'blue')
    }

    const winScreenVisible = (node,currentPlayer) => {
        let arr = [];
            let board = Array.from(document.querySelectorAll('.gridElement'));
            for(i = 0; i < 9; i++) {(board[i].textContent == '') ? arr += '.' : arr += board[i].textContent;}
            if (checkWin(node.textContent,arr)) { 
                document.getElementById('winText').textContent = `${currentPlayer.name} wins the Game !`;
                document.getElementById('winScreen').setAttribute('style', 'display: true');
            } else if (arr.split('.').length < 2) {
                document.getElementById('winText').textContent = `That is a draw !`;
                document.getElementById('winScreen').setAttribute('style', 'display: true');
            }
    }

    const checkWin = (player,arr) => {
        let res = allwins.some(indices => { return arr[indices[0]] == player && arr[indices[1]] == player && arr[indices[2]] == player })
        return res;
    }
    const resetGame = () => {
        round = 1;
        let board = document.querySelector('.container');
        while (board.firstElementChild) { board.removeChild(board.firstElementChild); }
        document.getElementById('winScreen').setAttribute('style', 'display: none');
        gameBoard.createSquare();
    }
    return {playerMove, round, resetGame}
})();

gameBoard.createSquare();
gameBoard.createWinScreen();
gameBoard.editableButtons();