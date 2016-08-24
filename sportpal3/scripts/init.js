var site_url = 'http://srv.sportpal.io/index.php/';
var own,
    owncontact,
    owntoken,
    ownfirstname,
    ownlastname,
    ownemail,
    ownbirthday,
    owncity,
    ownbio,
    ownphoto,
    owncolor,
    ownmobile,
    ownlanguage,
    data_select;
var dataSourceattendees,
    dataSourceattendeesconfirmed,
    dataSourcemyactivities,
    dataSourceserach,
    dataSourcecontacts;
var viewModelProfile;
var validator_formNewActivity,
    validator_formNewContact,
    validator_formSignup,
    validator_formSignin;
var privateactivity_switch,
    online_switch;
var current_id_activity = 0,
    current_sporttype = 2,
    attendees_list = new Array;
var listViewSearch;

function logout(e) {
    localStorage.clear();
    owntoken = "";
    ownfirstname = "";
    ownlastname = "";
    ownemail = "";
    ownbirthday = "";
    owncity = "";
    ownbio = "";
    ownphoto = "";
    owncolor = "";
    ownmobile = "";
    ownlanguage = "";
    own = 0;
    owncontact = 0;
    app.mobileApp.navigate("components/landing/1.html");        	    
}
if (localStorage.getItem('sportpalv10connect')) {
    own = localStorage.getItem('sportpalv10own');
    owncontact = localStorage.getItem('sportpalv10owncontact');
    owntoken = localStorage.getItem('sportpalv10owntoken');
    ownfirstname = localStorage.getItem('sportpalv10ownfirstname');
    ownlastname = localStorage.getItem('sportpalv10ownlastname');
    ownemail = localStorage.getItem('sportpalv10ownemail');
    ownbirthday = localStorage.getItem('sportpalv10ownbirthday');
    owncity = localStorage.getItem('sportpalv10owncity');
    ownbio = localStorage.getItem('sportpalv10ownbio');
    ownphoto = localStorage.getItem('sportpalv10ownphoto');
    owncolor = localStorage.getItem('sportpalv10owncolor');
    ownmobile = localStorage.getItem('sportpalv10ownmobile');
    ownlanguage = localStorage.getItem('sportpalv10ownlanguage');
    initDataSource();
}

function initOwnParams(result) {
    localStorage.setItem('sportpalv10owntoken', result.token);
    localStorage.setItem('sportpalv10ownfirstname', result.firstname);
    localStorage.setItem('sportpalv10ownlastname', result.lastname);
    localStorage.setItem('sportpalv10ownemail', result.email);
    localStorage.setItem('sportpalv10ownbirthday', result.birthday);
    localStorage.setItem('sportpalv10owncity', result.city);
    localStorage.setItem('sportpalv10ownbio', result.bio);
    localStorage.setItem('sportpalv10ownphoto', result.photo);
    localStorage.setItem('sportpalv10owncolor', result.color);
    localStorage.setItem('sportpalv10ownmobile', result.mobile);
    localStorage.setItem('sportpalv10ownlanguage', result.language);
    owntoken = result.token;
    ownfirstname = result.firstname;
    ownlastname = result.lastname;
    ownemail = result.email;
    ownbirthday = result.birthday;
    owncity = result.city;
    ownbio = result.bio;
    ownphoto = result.photo;
    owncolor = result.color;
    ownmobile = result.mobile;
    ownlanguage = result.language;

    initDataSource();
}
