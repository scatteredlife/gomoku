import { Template } from 'meteor/templating';
import { Rooms } from '/imports/api/rooms.js';
import './rooms.html';

Template.rooms.helpers({
    rooms: function() {
        return Rooms.find({});
    }
});