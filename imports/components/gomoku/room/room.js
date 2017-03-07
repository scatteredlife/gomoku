import { Template } from 'meteor/templating';
import { Rooms } from '../../../api/rooms.js';
import './room.html';

Template.room.helpers({

});

Template.rooms.events({
    'click .actions__button--join': function(event) {
        let room = Blaze.getData(event.target);
        joinRoom(room);
    },

    'click .actions__button--delete': function(event) {
        let room = Blaze.getData(event.target);
        Rooms.remove({ _id: room._id });
    }
});

function joinRoom(room) {
    Rooms.update(room._id,
    {
        $set: {
            player2: Meteor.userId(),
            player2Name: Meteor.user().username,
            status: "Playing"
        },
    });
    Session.set("playerType", "type-x");
}