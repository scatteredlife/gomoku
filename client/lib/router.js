import {Meteor} from 'meteor/meteor';

FlowRouter.group({
    triggersEnter: [
        (context, redirect) => {
            if (!Meteor.userId()) {
                redirect('/admin/login');
            }
        }
    ]
});

FlowRouter.route('/', {
    name: 'index',
    action(params, queryParams) {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {main: 'layout'});
    }
});

FlowRouter.route('/login', {
    name: 'login',
    action(params, queryParams) {
        if (Meteor.userId()) {
            FlowRouter.go("/");
        } else {
            BlazeLayout.setRoot('body');
            BlazeLayout.render('App_body', {main: 'login'});
        }
    }
});

FlowRouter.route('/logout', {
    name: 'logout',
    action(params, queryParams) {
        Meteor.logout(function(err) {
            console.log(err);
            if (!err) {
                FlowRouter.go("/login");
            }
        })
    }
});

FlowRouter.route('/register', {
    name: 'register',
    action(params, queryParams) {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {main: 'register'});
    }
});