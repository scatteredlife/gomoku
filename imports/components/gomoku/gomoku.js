import { Template } from 'meteor/templating';
import { Rooms } from '../../api/rooms.js';
import './gomoku.html';

Template.gomoku.helpers({
    currentRoom: function() {
        return Rooms.find({$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]}).fetch()[0];
    },

    playerType: function() {
        return Session.get("playerType");
    }
});

Template.gomoku.events({
    'submit .create-room': function(event) {
        event.preventDefault();

        let now = new Date();
        let _self = this;
        let roomName = event.target.roomName.value;

        if (!roomName) {
            alert("room name is required");
            return;
        }

        Rooms.insert({
            name: roomName,
            createAt: now.getTime(),
            player1: Meteor.userId(),
            player1Name: Meteor.user().username,
            player2: "",
            player2Name: "",
            boardGrid: boardGrid(),
            lastMoveBy: "",
            status: "Waiting for other player"
        }, function(err, id) {
            Session.set("playerType", "type-o");
        });
    },

    'click .actions__button--leave': function(event) {
        let currentRoomId = event.target.dataset.roomid;
        Rooms.remove({_id: currentRoomId});
    }
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