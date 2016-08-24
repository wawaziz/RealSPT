var OAUTHIO_PUBLIC_API_KEY = "qbLKUjq9dbkk__Pfd8G2EU3fixQ";
document.addEventListener("deviceready", function () {
    OAuth.initialize("qbLKUjq9dbkk__Pfd8G2EU3fixQ");
});

(function (global) {
    var DemoViewModel,
        app = global.app = global.app || {};

    DemoViewModel = kendo.data.ObservableObject.extend({
        loginWithTwitter: function () {
            this.loginWithProvider("twitter");
        },
        loginWithFacebook: function () {
            this.loginWithProvider("facebook");
        },
        loginWithGoole: function () {
            this.loginWithProvider("google");
        },
        clearOAuthCache: function () {
            OAuth.clearCache();
        },
        dataFromTwitter: function () {            
            if (!this.checkSimulator()) {
                OAuth.popup('twitter', {
                    cache: true
                }).done(function (result) {
                    result.get('1.1/account/verify_credentials.json?include_email=true&skip_status=true')
                        .done(function (response) {
                            //alert("Me " + ":\n\n" + JSON.stringify(response));
                        var fullname = response.name;
                            var res = fullname.split(" ");
                            var firstname = res[0];
                            var lastname = '';
                            if (res.length > 1) lastname = res[1];
                            for (var i = 2; i < res.length; i++) {
                                lastname += ' ' + res[i];
                            }
                            var datauser = {
                                models: {
                                    firstname: firstname,
                                    lastname: lastname,
                                    email: response.screen_name+'@twitter.com',
                                    provider: 'twitter',
                                    photo: response.profile_image_url_https,
                                    city: response.location,
                                    bio: response.description,                                    
                                    extid : response.id,
                                    status: 1
                                }
                            };                            
                            createuser(datauser);
                        })
                        .fail(function (err) {
                            console.log(err);
                        });
                }).fail(function (err) {
                    console.log(err);
                });
            }
            /** "1.1/statuses/user_timeline.json?count=1" **/
        },
        dataFromFacebook: function () {
            if (!this.checkSimulator()) {
                OAuth.popup('facebook', {
                    cache: true
                }).done(function (result) {
                    result.me()
                        .done(function (response) {                        
                            var datauser = {
                                models: {
                                    firstname: response.firstname,
                                    lastname: response.lastname,
                                    email: response.email,
                                    provider: 'facebook',
                                    photo: response.avatar,
                                    extid : response.id,
                                    status: 1
                                }
                            };                        
                            createuser(datauser);
                        })
                        .fail(function (err) {
                            console.log(err);
                            //alert("Me " + ":\n\n" + JSON.stringify(err));
                        });
                }).fail(function (err) {
                    console.log(err);
                });
            }
            /** "/me" **/
        },
        dataFromGoogle: function () {
            if (!this.checkSimulator()) {
                OAuth.popup('google', {
                    cache: true
                }).done(function (result) {
                    result.get('oauth2/v1/userinfo')
                        .done(function (response) {
                            var datauser = {
                                models: {
                                    firstname: response.given_name,
                                    lastname: response.family_name,
                                    email: response.email,
                                    provider: 'google',
                                    photo: response.picture,
                                    extid : response.id,
                                    status: 1
                                }
                            };
                            createuser(datauser);
                        })
                        .fail(function (err) {
                            console.log(err);
                        });
                }).fail(function (err) {
                    console.log(err);
                });
            }
        },
        loginWithProvider: function (provider) {
            if (!this.checkSimulator()) {
                OAuth.popup(provider, {
                        cache: true
                    })
                    .done(function (result) {
                        alert("Success: " + JSON.stringify(result));
                    })
                    .fail(function (err) {
                        alert(err);
                    });
            }
        },
        checkSimulator: function () {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (window.screen === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }
    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);