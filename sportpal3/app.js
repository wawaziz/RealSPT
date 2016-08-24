'use strict';

(function () {
    var app = {
        data: {}
    };    

    var bootstrap = function () {
        // Status bar
        StatusBar.overlaysWebView(true);
        StatusBar.backgroundColorByHexString('#000');
        StatusBar.styleLightContent();

        $(function () {
            if (localStorage.getItem('sportpalv10connect')) {                
                app.mobileApp = new kendo.mobile.Application(document.body, {
                    transition: 'slide',
                    skin: 'nova',
                    initial: 'components/home/search.html'
                });
            }
            else {
                app.mobileApp = new kendo.mobile.Application(document.body, {
                    transition: 'slide',
                    skin: 'nova',
                    initial: 'components/landing/1.html'
                });
            }
        });
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            bootstrap();

            // push notifs
            var everlive = new Everlive({
                appId: 'd178ipycu9vu40xa',
                scheme: 'http' // switch this to 'https' if you'd like to use TLS/SSL encryption and if it is included in your subscription tier
            });

            var devicePushSettings = {
                iOS: {
                    badge: 'true',
                    sound: 'true',
                    alert: 'true'
                },
                android: {
                    projectNumber: 'AIzaSyAn7wtpKMu-HTjFs0v4unR5Y5mbSR4lrGg'
                },
                wp8: {
                    channelName: 'EverlivePushChannel'
                },
                notificationCallbackIOS: onPushNotificationReceived,
                notificationCallbackAndroid: onPushNotificationReceived,
                notificationCallbackWP8: onPushNotificationReceived
            };

            everlive.push.register(devicePushSettings, function () {
                //console.log("Successful registration in Telerik Platform. You are ready to receive push notifications.");
            }, function (err) {
                console.log("Error: " + err.message);
            });
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li a.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };
}());

