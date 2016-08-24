function initDataSource() {
    data_select = {
        own: own,
        models: {
            own: own,
            contact: owncontact
        }
    };
    viewModelProfile = kendo.observable({
        fullname: ownfirstname + ' ' + ownlastname,
        email: ownemail,
        birthday: kendo.parseDate(ownbirthday, "yyyy-MM-dd"),
        birthdayText: kendo.toString(kendo.parseDate(ownbirthday, "yyyy-MM-dd"), "MMM dd yyyy"),
        city: owncity,
        bio: ownbio,
        photo: ownphoto,
        color: owncolor,
        mobile: ownmobile,
        showphoto: false,
        showcolor: true,
        language: ownlanguage,
        online: true
    });

    dataSourceattendees = new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://srv.sportpal.io/index.php/attendee_c/r",
                dataType: "jsonp",
                data: {
                    models: {
                        own: own,
                        contact: owncontact,
                        activity: 0
                    }
                }
            }
        },
        sort: {
            field: "firstname",
            dir: "status"
        },
        pageSize: 50
    });

    dataSourcecontacts = new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://srv.sportpal.io/index.php/contact_c/r",
                dataType: "jsonp",
                data: data_select
            }
        },
        sort: {
            field: "firstname",
            dir: "id"
        },
        pageSize: 50
    });

    dataSourcemyactivities = new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://srv.sportpal.io/index.php/activity_c/myactivities",
                dataType: "jsonp",
                data: data_select
            }
        },
        sort: {
            field: "title",
            dir: "id"
        },
        pageSize: 50
    });

    dataSourceserach = new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://srv.sportpal.io/index.php/activity_c/pubactivities",
                dataType: "jsonp",
                data: data_select
            }
        },
        sort: {
            field: "title",
            dir: "id"
        },
        pageSize: 50,
    });
    
    dataSourcemessages= new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://srv.sportpal.io/index.php/message_c/notifs",
                dataType: "jsonp",
                data: data_select
            }
        },
        sort: {
            field: "title",
            dir: "id"
        },
        pageSize: 50
    });

    dataSourcefavorites = new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://srv.sportpal.io/index.php/activity_c/favortieactivities",
                dataType: "jsonp",
                data: {
                    models: {
                        sender: own
                    }
                }
            }
        },
        sort: {
            field: "title",
            dir: "id"
        },
        pageSize: 50
    });
}
app.signup = kendo.observable({
    onInit: function () {
        validator_formSignup = $("#formSignup").kendoValidator().data("kendoValidator");
        $("#signupMessageError .wrong-pass img").click(function () {
            $("#signupMessageError").hide();
        });
    },
    onShow: function () {},
    afterShow: function () {}
});

app.signin = kendo.observable({
    onInit: function () {
        validator_formSignin = $("#formSignin").kendoValidator().data("kendoValidator");
        $("#signinMessageError .wrong-pass img").click(function () {
            $("#signinMessageError").hide();
        });
    },
    onShow: function () {},
    afterShow: function () {}
});

app.profile = kendo.observable({
    onInit: function () {
        dataSourceserach.read();
        dataSourcemyactivities.read();
        kendo.bind($("#profile"), viewModelProfile);
    },
    onShow: function () {
        dataSourceserach.read();
        dataSourcemyactivities.read();
        kendo.bind($("#profile"), viewModelProfile);
        finishNewActivity();
    },
    afterShow: function () {
        dataSourceserach.read();
        dataSourcemyactivities.read();
        kendo.bind($("#profile"), viewModelProfile);
    }
});

app.updateProfile = kendo.observable({
    onInit: function () {
        kendo.bind($("#updateProfile"), viewModelProfile);
    },
    onShow: function () {
        kendo.bind($("#updateProfile"), viewModelProfile);
        finishNewActivity();
    },
    afterShow: function () { }
});

app.sporttype = kendo.observable({
    onInit: function () {},
    onShow: function () {
        var viewModelSporttype = kendo.observable({
            sporttype: current_sporttype,
        });
        kendo.bind($("#formSelectSport"), viewModelSporttype);
    },
    afterShow: function () {}
});

app.messages = kendo.observable({
    onInit: function () {
        $("#notifications-listview").kendoMobileListView({
            dataSource: dataSourcemessages,
            template: $("#notifications-listview-template").text(),
            filterable: {
                field: "title",
                operator: "startswith"
            },
            pullToRefresh: true,
            endlessScroll: true
        });
    },
    onShow: function () {
        var listView = $("#notifications-listview").data("kendoMobileListView");
        listView.setDataSource(dataSourcemessages);
        dataSourcemessages.read();
        console.log(dataSourcemessages);
        finishNewActivity();
    },
    afterShow: function () {}
});

app.newcontact = kendo.observable({
    onInit: function () {
        //$("#buttonSendNewContact").hide();
        validator_formNewContact = $("#formNewContact").kendoValidator().data("kendoValidator");
        $("#ncemail,#ncphone,#ncmessage").blur(function () {
            if (validator_formNewContact.validate()) $("#buttonSendNewContact").show();
        });
    },
    onShow: function () {
        //$("#buttonSendNewContact").hide();
    },
    afterShow: function () {}
});

app.new = kendo.observable({
    onInit: function () {
        $("#buttonAddNewStepOne").hide();
        privateactivity_switch = $("#privateactivity").data("kendoMobileSwitch");
        validator_formNewActivity = $("#formNewActivity").kendoValidator().data("kendoValidator");
        $("#title,#starttime,#endtime,#address,#participants,#description").blur(function () {
            if (validator_formNewActivity.validate()) $("#buttonAddNewStepOne").show();
        });
    },
    onShow: function () {
        $("#buttonAddNewStepOne").hide();
        if (current_id_activity) {
            $("#buttonAddNewStepOne").show();
            var idx = getIndexById(dataSourceserach.data(), 'id', current_id_activity);
            var data = dataSourceserach.data()[idx];
            if (idx == null) {
                idx = getIndexById(dataSourcemyactivities.data(), 'id', current_id_activity);
                data = dataSourcemyactivities.data()[idx];
            }
            if (parseInt(data['owner']) == own) $("#buttonEditSigneActivity").show();
            if (parseInt(data['privateactivity'])) data['privateactivity'] = true;
            else data['privateactivity'] = false;
            current_sporttype = data['sporttype'];
            var viewModelNewActivity = kendo.observable({
                title: data['title'],
                ownername: data['firstname'] + ' ' + data['lastname'],
                starttime: kendo.parseDate(data['starttime'], "yyyy-MM-dd HH:mm:ss"),
                endtime: kendo.parseDate(data['endtime'], "yyyy-MM-dd HH:mm:ss"),
                address: data['address'],
                participants: data['participants'],
                description: data['description'],
                privateactivity: data['privateactivity'],
                imageSrc: "http://srv.sportpal.io/index.php/assets/img/lib/" + data['sporttype'] + ".png",
                imageAlt: "",
                imageTitle: ""
            });
            kendo.bind($("#formNewActivity"), viewModelNewActivity);
        }
        else
        {
            //Default values for starttime and endtime
            var currentDate = new Date();
            roundMinutes(currentDate);
            var timezoneOffset = currentDate.getTimezoneOffset() * 60 * 1000;
            var localDate = new Date(currentDate.getTime() - timezoneOffset);
            var localDateISOString = localDate.toISOString().replace('Z', '');
            $('#starttime').val(localDateISOString);
            $('#endtime').val(localDateISOString);
            document.getElementById("endtime").stepUp(120);
            document.getElementById("starttime").stepUp(10);
            document.getElementById("starttime").stepDown(10);
            document.getElementById("starttime").min = document.getElementById("starttime").value;
            document.getElementById("endtime").min = document.getElementById("starttime").value;
            $('#starttime').on('input', function () {
                $('#endtime').val($(this).val());
                document.getElementById("endtime").stepUp(120);
            });
        }
    },
    afterShow: function () {}
});

app.invite = kendo.observable({
    onInit: function () {
        $("#attendees-listview").kendoMobileListView({
            dataSource: dataSourceattendees,
            template: $("#attendees-listview-template").text(),
            filterable: {
                field: "firstname",
                operator: "startswith"
            },
            pullToRefresh: false,
            endlessScroll: true,
            click: function (e) {
                var status = e.dataItem.status;                  
                switch (parseInt(status)) {
                    case -1:
                        {                            
                            $.ajax({
                                url: "http://srv.sportpal.io/index.php/attendee_c/c",
                                dataType: 'jsonp',
                                data: {
                                    models: {
                                        contact: e.dataItem.ac_id,
                                        sender: own,
                                        activity: current_id_activity
                                    }
                                },
                                success: function (result) {
                                    e.dataItem.ai_id = result.id;
                                }
                            });
                            e.dataItem.status = 0;       
                           	$(".status_"+e.dataItem.ac_id).hide();
                            $("#status_"+e.dataItem.ac_id).removeClass().addClass("fa fa-paper-plane fa-2x status sent");
                        }
                        break;
                    case 0:
                        {
                            $.ajax({
                                url: "http://srv.sportpal.io/index.php/attendee_c/d",
                                dataType: 'jsonp',
                                data: {
                                    models: {
                                        id: e.dataItem.ai_id,
                                    }
                                },
                                success: function (result) {}
                            });
                            e.dataItem.status = -1;
                            
                            $(".status_"+e.dataItem.ac_id).hide();                         
                            $("#status_"+e.dataItem.ac_id).removeClass();
                        }
                        break;
                    case 2:
                        {                            
                            $.ajax({
                                url: "http://srv.sportpal.io/index.php/attendee_c/u",
                                dataType: 'jsonp',
                                data: {
                                    id: e.dataItem.ai_id,
                                    models: {
                                        status: 1
                                    }
                                },
                                success: function (result) {}
                            });
                            e.dataItem.status = 1;
                            $(".status_"+e.dataItem.ac_id).hide();
                            $("#status_"+e.dataItem.ac_id).removeClass().addClass("fa fa-check fa-2x status checked ");
                        }
                        break;
                }
            }
        });
    },
    onShow: function () {
        dataSourceattendees.read({
            models: {
                own: own,
                contact: owncontact,
                activity: current_id_activity
            }
        });
    },
    afterShow: function () {}
});

app.singleActivity = kendo.observable({
    onInit: function () {
        $("#buttonImIn").show();
        $("#buttonAF").show();
        $("#buttonRF").hide();
        $("#buttonEditSigneActivity").hide();
        privateactivity_switch = $("#privateactivity").data("kendoMobileSwitch");
        $("#privateactivityedit").kendoMobileSwitch({
            checked: true
        });
    },
    onShow: function (e) {
        current_id_activity = e.view.params.id;
        $("#buttonImIn").show();
        $("#buttonAF").show();
        $("#buttonRF").hide();
        dataSourcefavorites.read();
        for (var j = 0; j < dataSourcefavorites.data().length; j++) {
            if (dataSourcefavorites.data()[j]['id'] == current_id_activity) {
                $("#buttonAF").hide();
                $("#buttonRF").show();
            }
        }
        $("#buttonEditSigneActivity").hide();
        var idx = getIndexById(dataSourceserach.data(), 'id', current_id_activity);
        var data = dataSourceserach.data()[idx];
        if (idx == null) {
            idx = getIndexById(dataSourcemyactivities.data(), 'id', current_id_activity);
            data = dataSourcemyactivities.data()[idx];
        }
        if (parseInt(data['owner']) == own) {
            $("#buttonEditSigneActivity").show();
        }
        //Calculate the duration of the event : endtime-starttime
        var starttime = (kendo.parseDate(data['starttime'], "yyyy-MM-dd HH:mm:ss")).getTime() / 1000;
        var endtime = (kendo.parseDate(data['endtime'], "yyyy-MM-dd HH:mm:ss")).getTime() / 1000;
        var duration = (endtime - starttime).toString().toHHMMSS().substr(0, 5);

        var viewModelEditActivity = kendo.observable({
            title: data['title'],
            ownername: data['firstname'] + ' ' + data['lastname'],
            ownerphoto: data['auphoto'],
            starttime: kendo.toString(kendo.parseDate(data['starttime'], "yyyy-MM-dd HH:mm:ss"), "MMM dd HH:mm"),
            endtime: kendo.toString(kendo.parseDate(data['endtime'], "yyyy-MM-dd HH:mm:ss"), "MMM dd HH:mm"),
            duration: duration,
            address: data['address'],
            participants: data['participants'],
            description: data['description'],
            sporttype: data['sporttype'],
            privatactivity: data['privatactivity'],
            icon: data['icon'],
            photo: 'url("' + data['photo'] + '")'
        });
        kendo.bind($("#singleActivity"), viewModelEditActivity);
        var data = {
            own: own,
            models: {
                own: own,
                activity: current_id_activity
            }
        };
        dataSourceattendeesconfirmed = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://srv.sportpal.io/index.php/attendee_c/rc",
                    dataType: "jsonp",
                    data: data
                }
            },
            sort: {
                field: "firstname",
                dir: "id"
            },
            pageSize: 50,
            change: function () {
            //Check if the user is on the attendee list
            var data = this.data();
            for (var i = 0; i < data.length; i++) {
                attendeeFullname = data[i].firstname + ' ' + data[i].lastname;
                if (viewModelProfile.fullname == attendeeFullname)
                {
                    $("#buttonImIn").hide();
                }
            }
        }
        });
        //console.log(dataSourceserach.at(idx));
        var placesLeft = data.at(idx).participants - data.at(idx).confirmedplaces;
        //Check if there is no places left
        if (placesLeft < 1)
        {
            $("#buttonImIn").hide();
        }

        $("#contacts-attendees-listview").kendoMobileListView({
            dataSource: dataSourceattendeesconfirmed,
            template: $("#contacts-attendees-listview-template").text(),
            pullToRefresh: false,
            endlessScroll: false
        });

        buildMap(e,data.at(idx).address);
    },
    afterShow: function () {},
});

app.myactivities = kendo.observable({
    onInit: function () {
        $("#filterable-listview").kendoMobileListView({
            dataSource: dataSourcemyactivities,
            template: $("#mobile-listview-filtering-template").text(),
            filterable: {
                field: "title",
                operator: "contains",
            },
            pullToRefresh: true,
            endlessScroll: true
        })
        //Filter on date
        var filterableListview = $("#filterable-listview").data('kendoMobileListView');
        var date = new Date();
        date = kendo.toString(kendo.parseDate(date, "yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd HH:mm:ss");
        //First filter(upcoming) when the page is rendered
        filterableListview.dataSource.filter({
            field: "starttime",
            operator: "gte",
            value: date,
        });

        function upcomingFilter() {
            filterableListview.dataSource.filter({});
            filterableListview.setDataSource(dataSourcemyactivities);
            filterableListview.dataSource.filter({
                field: "starttime",
                operator: "gte",
                value: date,
            });
            //filterableListview.dataSource.sort({ field: "starttime", dir: "desc" });
        }
        function pastFilter() {
            filterableListview.dataSource.filter({});
            filterableListview.setDataSource(dataSourcemyactivities);
            filterableListview.dataSource.filter({
                field: "starttime",
                operator: "lt",
                value: date,
            });
            //filterableListview.dataSource.sort({ field: "starttime", dir: "desc" });
        }
        function myeventsFilter() {
            filterableListview.dataSource.filter({});
            filterableListview.setDataSource(dataSourcemyactivities);
            filterableListview.dataSource.filter({
                field: "owner",
                operator: "eq",
                value: own,
            });
        }
        function favoritesFilter() {
            filterableListview.dataSource.filter({});
            dataSourcefavorites.read();
            filterableListview.setDataSource(dataSourcefavorites);
            dataSourcefavorites.read();
        }
        $('#upcoming').click(function () {
            upcomingFilter();
        });
        $('#past').click(function () {
            pastFilter();
        });
        $('#myevents').click(function () {
            myeventsFilter();
        });
        $('#favorites').click(function () {
            favoritesFilter();
        });
    },
    onShow: function () {
        //var listView = $("#filterable-listview").data("kendoMobileListView");
        //listView.setDataSource(dataSourcemyactivities);
        //dataSourcemyactivities.read();
        finishNewActivity();
    },
    afterShow: function () {}
});

app.search = kendo.observable({
    onInit: function () {
        $("#search-listview").kendoMobileListView({
            dataSource: dataSourceserach,
            template: $("#search-listview-template").text(),
            filterable: {
                field: "title",
                operator: "contains",
            },
            pullToRefresh: true,
            endlessScroll: true
        });
        //Filter on starttime and endtime

        //var filterableListview = $("#search-listview").data('kendoMobileListView');
        //var date = new Date();
        //date = kendo.toString(kendo.parseDate(date, "yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd HH:mm:ss");
        //filterableListview.dataSource.sort({ field: "starttime", dir: "desc" });

        //Filter on date between today and tomorrow

        //var filterableListview = $("#search-listview").data('kendoMobileListView');
        //var today = new Date();
        //var tomorrow = new Date();
        //tomorrow.setHours(tomorrow.getHours() + 48);
        //today = kendo.toString(kendo.parseDate(today, "yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd HH:mm:ss");
        //tomorrow = kendo.toString(kendo.parseDate(tomorrow, "yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd HH:mm:ss");
        //var filter = { logic: "and", filters: [] };
        //filter.filters.push({ field: "starttime", operator: "gt", value: today });
        //filter.filters.push({ field: "starttime", operator: "lt", value: tomorrow });
        //filterableListview.dataSource.filter(filter);
    },
    onShow: function () {
        var listView = $("#search-listview").data("kendoMobileListView");
        listView.setDataSource(dataSourceserach);
        dataSourceserach.read();
        finishNewActivity();
    },
    afterShow: function () {
        //everlive.push.notifications.create({ Message: 'SPORTPAL Push Notifications Test.' },
        //  function (data) {
        //      alert(JSON.stringify(data));
        //  },
        //  function (error) {
        //      alert(JSON.stringify(error));
        //  }
        //);
    }
});

app.contacts = kendo.observable({
    onInit: function () {
        $("#contacts-listview").kendoMobileListView({
            dataSource: dataSourcecontacts,
            template: $("#contacts-listview-template").text(),
            filterable: {
                field: "firstname",
                operator: "startswith"
            },
            pullToRefresh: true,
            endlessScroll: true
        });
    },
    onShow: function () {
        //console.log(dataSourcecontacts);
        var listView = $("#contacts-listview").data("kendoMobileListView");
        listView.setDataSource(dataSourcecontacts);
        dataSourcecontacts.read();
        finishNewActivity();
    },
    afterShow: function () {}
});