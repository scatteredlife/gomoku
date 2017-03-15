import { Template } from 'meteor/templating';
import { Rooms } from '/imports/api/rooms.js';
import './board.html';

Template.board.events({
    'click .grid__cell': function(event) {
        let x = parseInt(event.target.dataset.row);
        let y = parseInt(event.target.dataset.col);

        Meteor.call('rooms.updateAfterMove', x, y, Session.get("playerType"), function(err) {
            if (err) {
                alert(err.message);
            }
        });
    }
});
