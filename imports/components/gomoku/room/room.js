import { Template } from 'meteor/templating';
import { Rooms } from '/imports/api/rooms.js';
import './room.html';

Template.rooms.events({
    'click .actions__button--join': function(event) {
        let room = Blaze.getData(event.target);
        joinRoom(room);
    }
});

function joinRoom(room) {
    Meteor.call('rooms.join', room, function(err) {
        if (err) {
            alert(err.message);
        } else {
            Session.set("playerType", "type-x");
        }
    })
}