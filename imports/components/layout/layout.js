import { Template } from 'meteor/templating';
import './layout.html';
import './header.html';

Template.layout.helpers({
    authInProcess: function() {
        return Meteor.loggingIn();
    },

    hasLogin: function() {
        return !!Meteor.user();
    },

    currentUser: function() {
        console.log(Meteor.user());
        return Meteor.user();
    }
});

Accounts.onLogin(function() {
    var path = FlowRouter.current().path;
    
    if (path === "/login") {
        FlowRouter.go("/");
    }
});