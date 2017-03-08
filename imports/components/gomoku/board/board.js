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

            let result = checkState(currentRoom.boardGrid);
            let winner = "";

            if (result == "type-o") {
                winner = currentRoom.player1Name;
            } else if (result == "type-x") {
                winner = currentRoom.player1Name;
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

function checkRow(boardGrid) {
    for (var row = 0; row < boardGrid.length; row ++) {
        for (var col = 0; col < boardGrid[row].length - 4; col++) {
            var firstCell = boardGrid[row][col];

            if (firstCell.type) {
                var i = 0;

                while (firstCell.type === boardGrid[row][col+i].type && i < 5) {
                    i++;
                }

                if (i === 5) {
                    return firstCell.type;
                }
            }
        }
    }

    return false;
}

function checkColumn(boardGrid) {
    for (var col = 0; col < boardGrid[0].length; col ++) {
        for (var row = 0; row < boardGrid[col].length - 4; row++) {
            var firstCell = boardGrid[row][col];

            if (firstCell.type) {
                var i = 0;

                while (firstCell.type === boardGrid[row + i][col].type && i < 5) {
                    i++;
                }

                if (i === 5) {
                    return firstCell.type;
                }
            }
        }
    }

    return false;
}

function checkDiagonal(boardGrid) {
    for (var row = 0; row < boardGrid.length; row ++) {
        for (var col = 0; col < boardGrid[row].length - 4; col++) {
            var firstCell = boardGrid[row][col];

            if (firstCell.type) {
                var i = 0;

                while (firstCell.type === boardGrid[row+ i][col+i].type && i < 5) {
                    i++;
                }

                if (i === 5) {
                    return firstCell.type;
                }
            }
        }
    }

    return false;
}

function checkAntiDiagonal(boardGrid) {
    for (var row = 4; row < boardGrid.length; row ++) {
        for (var col = 0; col < boardGrid[row].length - 4; col++) {
            var firstCell = boardGrid[row][col];

            if (firstCell.type) {
                var i = 0;

                while (firstCell.type === boardGrid[row - i][col + i].type && i < 5) {
                    i++;
                }

                if (i === 5) {
                    return firstCell.type;
                }
            }
        }
    }

    return false;
}

function checkState(boardGrid) {
    let result = checkRow(boardGrid);

    if (result) {
        return result;
    }

    result = checkColumn(boardGrid);

    if (result) {
        return result;
    }

    result = checkDiagonal(boardGrid);

    if (result) {
        return result;
    }

    result = checkAntiDiagonal(boardGrid);

    return result;
}