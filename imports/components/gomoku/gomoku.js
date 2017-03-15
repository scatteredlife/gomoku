import { Template } from 'meteor/templating';
import { Rooms } from '/imports/api/rooms.js';
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

        Meteor.call("rooms.create", roomName, function(err, result) {
            if (err) {
                alert(err.message);
            } else {
                Session.set("playerType", "type-o");
            }
        })
    },

    'click .actions__button--leave': function(event) {
        let currentRoomId = event.target.dataset.roomid;

        Meteor.call("rooms.remove", currentRoomId, function(err) {
            if (err) {
                alert(err.message);
            }
        });
    }
});