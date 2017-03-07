import { Template } from 'meteor/templating';
import './register.html';

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var username = event.target.username.value;
        var password = event.target.password.value;

        if (!username || !password) {
            alert("Username and Password is required");
            return;
        }

        Accounts.createUser({
            username: username,
            password: password
        }, function(err) {
            if (err) {
                console.log(err);
                alert(err.reason);
            } else {
                FlowRouter.go("/");
            }
        });
    }
});