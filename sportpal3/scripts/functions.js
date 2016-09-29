function createuser(data) {

    $.ajax({
        url: "http://srv.sportpal.io/index.php/admin/createjsonp",
        dataType: 'jsonp',
        data: data,
        success: function (result) {            
            if (result.connect) {
                localStorage.setItem('sportpalv10connect', true);
                localStorage.setItem('sportpalv10own', result.own);
                localStorage.setItem('sportpalv10owncontact', result.contact);
                own = result.own;
                owncontact = result.contact;
                initOwnParams(result);
                app.mobileApp.navigate("components/home/search.html");
            } else {
                $("#signupMessageError span").text(result.message);
                $("#signupMessageError").show();
            }
        }
    });
}

function loginuser(data) {
    $.ajax({
        url: "http://srv.sportpal.io/index.php/login/srfjsonp",
        dataType: 'jsonp',
        data: data,
        success: function (result) {
            if (result.connect) {
                localStorage.setItem('sportpalv10connect', true);
                localStorage.setItem('sportpalv10own', result.own);
                localStorage.setItem('sportpalv10owncontact', result.contact);
                own = result.own;
                owncontact = result.contact;
                initOwnParams(result);
                app.mobileApp.navigate("components/home/search.html");
            } else {
                $("#signinMessageError span").text(result.message);
                $("#signinMessageError").show();
            }
        }
    });
}



function getIndexById(currentdatasource, item, id) {
    for (var j = 0; j < currentdatasource.length; j++) {
        if (currentdatasource[j][item] == id) return j;
    }
    return null;
}

function signup(e) {
    e.preventDefault();
    if (validator_formSignup.validate()) {
        var fullname = $("#sufullname").val();
        var res = fullname.split(" ");
        var firstname = res[0];
        var lastname = '';
        if (res.length > 1) lastname = res[1];
        for (var i = 2; i < res.length; i++) {
            lastname += ' ' + res[i];
        }
        var password = CryptoJS.SHA512($("#supassword").val().toString()).toString();
        var data = {
            models: {
                firstname: firstname,
                lastname: lastname,
                email: $("#suemail").val(),
                password: password
            }
        };
        createuser(data);
    }
}

function signin(e) {
    e.preventDefault();
    if (validator_formSignin.validate()) {
        var password = CryptoJS.SHA512($("#sipassword").val().toString()).toString();
        var data = {
            models: {
                email: $("#siemail").val(),
                password: password
            }
        };
        loginuser(data);
    }
}

function saveNewContact(e) {
    e.preventDefault();
    var message = $("#ncmessage").val();
    if (message.length == 0)
    {
        message = $("#ncfirstname").val() + " has invited you to join the Sportpal app."
    }
    var models = {
        sender: own,
        firstname: $("#ncfirstname").val(),
        email: $("#ncemail").val(),
        phone: $("#ncphone").val(),
        message: message
    };
    var data = {
        own: own,
        models: models
    };
    $.ajax({
        url: "http://srv.sportpal.io/index.php/contact_c/c",
        dataType: 'jsonp',
        data: data,
        success: function (result) {
            if (result.success) {
                app.mobileApp.navigate("components/home/contacts.html");
                $("#formNewContact").find("input, textarea").val("");
            }
            else {
                $("#newContactMessageError").show();
            }
        }
    });
}

function saveNewActivity(e) {
    var city = "";
    retrieveCityFromAddress($("#address").val(), function (location) {
        //console.log(location);
        if (location == "")
        {
            city = "Brussels";
        }
        else
        {
            city = location;
        }
        var privatactivity = 0;
        if (privateactivity_switch.check()) privatactivity = 1;
        //console.log(privateactivity_switch);
        //console.log(privateactivity_switch.check());
        if (!current_id_activity) {
            var sporttype = $("input[name='sporttype']:checked").attr('id');
            //var iconlink = "http://srv.sportpal.io/index.php/assets/img/lib/" + sporttype + ".png";
            var iconlink = "https://sportpal.io/assets/img/lib/" + sporttype + ".png";
            //var photolink = "http://srv.sportpal.io/index.php/assets/img/lib/bp/" + sporttype + ".png";
            var photolink = "https://sportpal.io/assets/img/lib/bp/" + sporttype + ".png";
            var models = {
                user: own,
                title: $("#title").val(),
                starttime: $("#starttime").val(),
                endtime: $("#endtime").val(),
                address: $("#address").val(),
                participants: $("#participants").val(),
                city: city,
                sporttype: sporttype,
                description: $("#description").val(),
                privateactivity: privatactivity,
                icon: iconlink,
                photo: photolink
            };
            var data = {
                own: own,
                models: models
            };
            $.ajax({
                url: "http://srv.sportpal.io/index.php/activity_c/c",
                dataType: 'jsonp',
                data: data,
                success: function (result) {
                    current_id_activity = result.id;
                    var models = {
                        sender: own,
                        contact: owncontact,
                        activity: current_id_activity,
                        status: 1
                    };
                    var data = {
                        own: own,
                        models: models
                    };
                    $.ajax({
                        url: "http://srv.sportpal.io/index.php/attendee_c/c",
                        dataType: 'jsonp',
                        data: data,
                        success: function (result) {
                            dataSourceattendees.read({
                                models: {
                                    own: own,
                                    contact: owncontact,
                                    activity: current_id_activity
                                }
                            });
                            if (dataSourcemyactivities) dataSourcemyactivities.read();
                            if (dataSourceserach) dataSourceserach.read();
                        }
                    });
                }
            });
        } else {
            var sporttype = $("input[name='sporttype']:checked").attr('id');
            //var iconlink = "http://srv.sportpal.io/index.php/assets/img/lib/" + sporttype + ".png";
            var iconlink = "https://sportpal.io/assets/img/lib/" + sporttype + ".png";
            //var photolink = "http://srv.sportpal.io/index.php/assets/img/lib/bp/" + sporttype + ".png";
            var photolink = "https://sportpal.io/assets/img/lib/bp/" + sporttype + ".png";
            var models = {
                user: own,
                title: $("#title").val(),
                starttime: $("#starttime").val(),
                endtime: $("#endtime").val(),
                address: $("#address").val(),
                participants: $("#participants").val(),
                city: city,
                sporttype: sporttype,
                description: $("#description").val(),
                privateactivity: privatactivity,
                icon: iconlink,
                photo: photolink
            };
            var data = {
                own: own,
                models: models,
                id: current_id_activity
            };
            $.ajax({
                url: "http://srv.sportpal.io/index.php/activity_c/u",
                dataType: 'jsonp',
                data: data,
                success: function (result) {
                    dataSourceattendees.read({
                        models: {
                            own: own,
                            contact: owncontact,
                            activity: current_id_activity
                        }
                    });
                    if (dataSourcemyactivities) dataSourcemyactivities.read();
                    if (dataSourceserach) dataSourceserach.read();
                }
            });
        }
    });
}

function finishNewActivity(e) {
    $("#formNewActivity").find("input, textarea").val("");
    current_id_activity = 0;
}

function getAttendees(activity) {
    // $('[id^=send_]').hide();
    // $('[id^=check_]').hide();
    // $('[id^=deny_]').hide();
    // attendees_list = new Array;
    // var models = {
    //     own: own,
    //     activity: activity
    // };
    // var data = {
    //     own: own,
    //     models: models
    // };
    // $.ajax({
    //     url: "http://srv.sportpal.io/index.php/attendee_c/r",
    //     dataType: 'jsonp',
    //     data: data,
    //     success: function (result) {
    //         $.each(result, function (key, val) {
    //             switch (parseInt(val.status)) {
    //                 case 0:
    //                     $("#send_" + val.ac_id).show();
    //                     break;
    //                 case 1:
    //                     $("#check_" + val.ac_id).show();
    //                     break;
    //                 case 2:
    //                     $("#deny_" + val.ac_id).show();
    //                     break;
    //             }
    //             attendees_list[attendees_list.length] = val.ac_id;
    //         });
    //     }
    // });
}

function updateProfile(e) {
    var fullname = $("#pfullname").val();
    var res = fullname.split(" ");
    var firstname = res[0];
    var lastname = '';
    if (res.length > 1) lastname = res[1];
    for (var i = 2; i < res.length; i++) {
        lastname += ' ' + res[i];
    }
    var photo = '';
    if (photo.length > 0) {
        var models = {
            email: $("#pemail").val(),
            firstname: firstname,
            lastname: lastname,
            mobile: $("#pmobile").val(),
            birthday: $("#pbirthday").val(),
            city: $("#pcity").val(),
            bio: $("#pbio").val(),
            photo: photo
        };
    }
    else {
        var models = {
            email: $("#pemail").val(),
            firstname: firstname,
            lastname: lastname,
            mobile: $("#pmobile").val(),
            birthday: $("#pbirthday").val(),
            city: $("#pcity").val(),
            bio: $("#pbio").val()
        };
    }

    if ($("#ppassword").val() != "_Frr98klOI_345") {
        var password = CryptoJS.SHA512($("#ppassword").val().toString()).toString();
        models.password = password;
    }
    //console.log(viewModelProfile);
    var data = {
        own: own,
        models: models
    };
    $.ajax({
        url: "http://srv.sportpal.io/index.php/usr_c/u",
        dataType: 'jsonp',
        data: data,
        success: function (result) {
            initOwnParams(result);
            app.mobileApp.navigate("components/home/profile.html");
        }
    });
}
// ImagePicker widget to update profile picture from device photo album(not working yet)
function updateProfilePicture(e) {
    imagePicker.getPictures(
        function (result) {
            JSON.stringify(result);
            for (var i = 0; i < result.length; i++) {
                //alert(result[i]);
                var photo = "data:image/jpeg;base64," + result[i];
                //$("#profilepic").attr("src", photo);
            }
        },
        function (error) {
            console.log('Error: ' + error);
        },
        { // options object, all optional
            maximumImagesCount: 1, // Android only since plugin version 2.1.1, default no limit
            quality: 50, // 0-100, default 100 which is highest quality
            width: 400,  // proportionally rescale image to this width, default no rescale
            height: 400, // same for height
            outputType: imagePicker.OutputType.BASE64_STRING // default .FILE_URI
        }
    );
}

function addAttendee(e) {
    var models = {
        sender: own,
        contact: owncontact,
        activity: current_id_activity,
        status: 1
    };
    var data = {
        own: own,
        models: models
    }
    $.ajax({
        url: "http://srv.sportpal.io/index.php/attendee_c/c",
        dataType: 'jsonp',
        data: data,
        success: function (result) {
            dataSourceattendees.read({
                models: {
                    own: own,
                    contact: owncontact,
                    activity: current_id_activity
                }
            });
        }
    });
    $("#buttonImIn").hide();
    //$("#abuttonImIn").replaceWith("<span style='width:50%;margin: 0 auto;text-align:center;color:#34A853;'>You are in!</span>");
    dataSourceattendeesconfirmed.read();
}
// Build google map using geocoder
function buildMap(e,activityAddress) {
    var geocoder;
    var map;
    var address = activityAddress;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(50.8503, 4.3517);
    var myOptions = {
        zoom: 14,
        center: latlng,
        //mapTypeControl: true,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        //navigationControl: true,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        //streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    if (geocoder) {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    map.setCenter(results[0].geometry.location);

                    var infowindow = new google.maps.InfoWindow(
                        {
                            content: '<b>' + address + '</b>',
                            size: new google.maps.Size(150, 50)
                        });

                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        title: address
                    });
                    // Surrounding the address with link to native maps app
                    // Google maps
                    //var url = "http://maps.google.com/maps?q=" + results[0].geometry.location.lat() + "," + results[0].geometry.location.lng();
                    // Apple maps
                    var url = "http://maps.apple.com/?q=" + results[0].geometry.location.lat() + "," + results[0].geometry.location.lng();
                    $('#activityAddress').each(function () {
                        var link = "<a style='color:white;text-decoration:underline;' href='" + url + "' onclick='window.open(" + url + ");'>" + $(this).text() + "</a>";
                        $(this).html(link);
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                        //map.setZoom(15);
                        //map.setCenter(marker.getPosition());
                        // Opening the address in native maps app
                        window.open(url);
                    });

                } else {
                    console.log("No results found");
                }
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        });
    }
}
// Retrieve city from address using geocoder
function retrieveCityFromAddress(activityAddress, fn) {
    var geocoder = new google.maps.Geocoder();
    var address = activityAddress;
    var city;
    if (geocoder) {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    if (results[0]) {
                        //formatted address
                        //console.log(results[0].formatted_address);
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                                if (results[0].address_components[i].types[b] == "locality") {
                                    city = results[0].address_components[i];
                                    break;
                                }
                            }
                        }
                        //city data
                        //console.log(city);
                        //console.log(city.short_name);
                        fn(city.short_name);
                    }
                } else {
                    console.log("No results found");
                }
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        });
    }
}
function addToFavorites() {
    var models = {
        activity: current_id_activity,
        sender: own,
    };
    var data = {
        own: own,
        models: models
    }
    $.ajax({
        url: "http://srv.sportpal.io/index.php/activity_c/af",
        dataType: 'jsonp',
        data: data,
        success: function (result) {
            dataSourcefavorites.read({
                models: {
                    sender: own
                }
            });
        }
    });
    $("#buttonAF").hide();
    $("#buttonRF").show();
    dataSourcefavorites.read();
}
function RemoveFromFavorites() {
    var models = {
        activity: current_id_activity,
        sender: own,
    };
    var data = {
        own: own,
        models: models
    }
    $.ajax({
        url: "http://srv.sportpal.io/index.php/activity_c/rf",
        dataType: 'jsonp',
        data: data,
        success: function (result) {
            dataSourcefavorites.read({
                models: {
                    sender: own
                }
            });
        }
    });
    $("#buttonAF").show();
    $("#buttonRF").hide();
    dataSourcefavorites.read();
}
function FriendsFromFacebook() {
    OAuth.popup('facebook', {
        cache: true
    }).done(function (result) {
        result.get('/me/friends')
            .done(function (response) {
                //console.log(JSON.stringify(response.data));
                for (var i = 0; i < JSON.stringify(response.data.length); i++) {
                    //console.log(JSON.stringify(response.data[i]));
                    var fbname = JSON.stringify(response.data[i].name);
                    var fbuid = JSON.stringify(response.data[i].id);
                    //requete
                }
                //alert success
            })
            .fail(function (err) {
                console.log(err);
                //alert fail
            });
    }).fail(function (err) {
        console.log(err);
        //alert fail
    });
}
function ContactsFromDevice() {
    navigator.contacts.pickContact(function (contact) {
        //alert(JSON.stringify(contact));
        var firstname = JSON.stringify(contact.name.formatted);
        var phone = JSON.stringify(contact.phoneNumbers[0].value);
        firstname = firstname.substring(1, firstname.length - 1);
        phone = phone.substring(1, phone.length - 1);
        if (contact.phoneNumbers != null) {
            var message = viewModelProfile.fullname + " has invited you to join the Sportpal app.";
            var models = {
                sender: own,
                firstname: firstname,
                email: '',
                phone: phone,
                message: message
            };
            var data = {
                own: own,
                models: models
            };
            $.ajax({
                url: "http://srv.sportpal.io/index.php/contact_c/c",
                dataType: 'jsonp',
                data: data,
                success: function (result) {
                    if (result.success) {
                        app.mobileApp.navigate("components/home/contacts.html");
                    }
                }
            });
        }
        else {
            alert('Please select a contact that has a phone number.');
        }
    },function(err){
        console.log('Error: ' + err);
    });
}
// Convert seconds to HHMMSS
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}
// Round date to nearest hour
function roundMinutes(date) {
    date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
    date.setMinutes(0);
    return date;
}
function onPushNotificationReceived(e) {
    alert(JSON.stringify(e));
};