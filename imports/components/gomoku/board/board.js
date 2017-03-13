import { Template } from 'meteor/templating';
import { Rooms } from '/imports/api/rooms.js';
import './board.html';

Template.board.helpers({
    currentRoom: function() {
        return Session.get("currentRoom");
    }
});

Template.board.events({
    'click .grid__cell': function(event) {
        let x = parseInt(event.target.dataset.row);
        let y = parseInt(event.target.dataset.col);

        let currentRoom = Template.instance().data.room;
        let playerType =  Session.get("playerType");

        if (currentRoom.lastMoveBy != Meteor.userId() && !currentRoom.boardGrid[x][y].type && !!currentRoom.player2) {
            currentRoom.boardGrid[x][y].type = playerType;

            let result = checkState(currentRoom.boardGrid, x, y);
            let winner = "";

            if (result == "type-o") {
                winner = currentRoom.player1Name;
            } else if (result == "type-x") {
                winner = currentRoom.player2Name;
            }

            let nextPlayer = Meteor.userId() == currentRoom.player1 ? currentRoom.player2Name : currentRoom.player1Name;
            let status = !!winner ? `Player ${winner} has won!!` : `waiting for ${nextPlayer}'s move`;

            Rooms.update(currentRoom._id, {
                $set: {
                    boardGrid: currentRoom.boardGrid,
                    lastMoveBy: Meteor.userId(),
                    winner: winner,
                    status: status
                },
            }, function(err, id) {
                if (err) {
                    console.log(err);
                    alert(arr);
                }
            });
        } else if (currentRoom.lastMoveBy == Meteor.userId()) {
            alert('not your turn');
        }
    }
});

function checkDirection(boardGird, startX, startY, directionX, directionY) {
    let starRow = startX - 4 >= 0 ? startX - 4 : 0;
    let endRow = startX + 4 < 16 ? startX + 4 : 15;
    let starCol = startY - 4 >= 0 ? startY - 4 : 0;
    let endCol = startY + 4 < 16 ? startY + 4 : 15;

    let count = 0;
    for (var i = 0; i < 9; i++) {
        let row = startX + i*directionX - 4*directionX;
        let col = startY + i*directionY - 4*directionY;

        if (row <= endRow && row >= 0 && col >= 0 && col <= endCol) {
            if (boardGird[row][col].type === boardGird[startX][startY].type) {
                count++;

                if (count === 5) {
                    return boardGird[startX][startY].type;
                }

            } else {
                count = 0;
            }
        }
    }

    return false;
}

function checkState(boardGrid, x, y) {

    let result = checkDirection(boardGrid, x, y, 0, 1);

    if (result) {
        return result;
    }

    result = checkDirection(boardGrid, x, y, 1, 0);

    if (result) {
        return result;
    }

    result = checkDirection(boardGrid, x, y, 1, 1);

    if (result) {
        return result;
    }

    result = checkDirection(boardGrid, x, y, -1, 1);

    return result;
}