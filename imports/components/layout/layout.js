import { Template } from 'meteor/templating';
import './layout.html';
import './header.html';
import './loading.html';
import './notlogin.html';

Template.layout.helpers({
    authInProcess: function() {
        return Meteor.loggingIn();
    },

    hasLogin: function() {
        return !!Meteor.user();
    },

    currentUser: function() {
        return Meteor.user();
    }
});

Accounts.onLogin(function() {
    var path = FlowRouter.current().path;
    
    if (path === "/login") {
        FlowRouter.go("/");
    }
});