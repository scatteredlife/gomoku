import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
 
export const Rooms = new Mongo.Collection('rooms');

Meteor.methods({
    'rooms.create'(name) {
        check(name, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Rooms.insert({
            name: name,
            createAt: new Date(),
            player1: this.userId,
            player1Name: Meteor.user().username,
            player2: "",
            player2Name: "",
            boardGrid: boardGrid(),
            lastMoveBy: "",
            status: "Waiting for other player"
        }, function(err, id) {
            if (err) {
                throw new Meteor.Error(err);
            }
        });
    },

    'rooms.remove'(id) {
        check(id, String);
        
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let room = Rooms.find({$or: [{player1: this.userId}, {player2: this.userId}]}).fetch()[0];
        if (room) {
            Rooms.remove({ _id: id });
        } else {
            throw new Meteor.Error('you don\'t have permission to remove this room');
        }
    },

    'rooms.join'(room) {
        check(room._id, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        
        Rooms.update(room._id, {
            $set: {
                player2: this.userId,
                player2Name: Meteor.user().username,
                status: "Playing"
            },
        }, function(err) {
            if (err) {
                throw new Error(err);
            }
        });
    },

    'rooms.updateAfterMove'(x, y, playerType) {
        check(x, Match.Integer);
        check(y, Match.Integer);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let currentRoom = Rooms.find({$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]}).fetch()[0];

        if (currentRoom.lastMoveBy != this.userId && !currentRoom.boardGrid[x][y].type && !!currentRoom.player2) {
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
                    lastMoveBy: this.userId,
                    winner: winner,
                    status: status
                },
            },
            function(err, id) {
                if (err) {
                    throw new Meteor.Error(err);
                }
            });
        } else if (currentRoom.lastMoveBy == Meteor.userId()) {
            throw new Meteor.Error('not your turn');
        }
    },
});

function boardGrid() {
    let size = 16;
    let grid = [];

    for (var i = 0; i < size; i++) {
        let row = [];

        for (var j = 0; j < size; j++) {
            let cell = {
                type: ""
            };
            row.push(cell);
        }
        grid.push(row)
    }

    return grid;
}


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
