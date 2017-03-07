import { Template } from 'meteor/templating';
import './login.html';

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var username = event.target.username.value;
        var password = event.target.password.value;

        Meteor.loginWithPassword({username: username}, password, function(err) {
            if (err) {
                console.log(err);
                alert(err.reason);
            }
        });
    }
});