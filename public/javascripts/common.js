var PAGE_LIMIT = 10;
var strINT = "0123456789";
var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var MonthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var login_email = "breannacrowley@gmail.com";
var password = "a89e30a5cc6d1e69eed6959911e69926";

function getNumber(str) {
	for( i = 0; i < str.length; i++) {
		if(strINT.indexOf(str.substr(i, 1)) == -1) {
			str = str.replace(str.substr(i, 1), "");
			i--;
		}
	}	 
	return str;
}

// This is for jQuery Object
function checkNumber(obj) {
    str = obj.val();
    for( i = 0; i < str.length; i++) {
    	console.log(str.substr(i, 1));
        if(strINT.indexOf(str.substr(i, 1)) == -1) {
            str = str.replace(str.substr(i, 1), "");
            i--;
        }
    }     
    obj.val(str);
}

function checkEmail(emailAddress) {
	var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	return pattern.test(emailAddress);
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function parseDate(dateString) {
	var dt = dateString.split(" ");
	var d = dt[0].split(/-/);
	var newDate = new Date(d[0],parseInt( d[1], 10)-1,d[2]);
	if(dt[1]) {
		h = dt[1].split(':');
		newDate.setHours(h[0], h[1]);
	}
	
	return newDate;
}

function getMonday(date) {
	var w = date.getDay();
	date.setDate(date.getDate()-w);
	
	return date;
}

function set_cookie(data) {
	$.cookie("setster.session.id", data.SessionId, {path: '/'});
	$.cookie("setster.store.id", data.StoreId, {path: '/'});
}

function set_cookie_name(store_name) {
	$.cookie("setster.store.name", store_name, {path: '/'});
}

function load_cookie() {
	SESSION_ID = $.cookie("setster.session.id");
	STORE_ID = $.cookie("setster.store.id");
	$("#welcome_name").html($.cookie("setster.store.name"));
	
	//console.log(SESSION_ID);
	//console.log(STORE_ID);

	if(!SESSION_ID || SESSION_ID == "" || !STORE_ID || STORE_ID == "")
		location.href="../businesslogin.html";
}

function logout() {
	$.cookie("setster.session.id", "", {path: '/'});
	$.cookie("setster.store.id", "", {path: '/'});
	$.cookie("setster.store.name", "", {path: '/'});
	location.href="../index.html";
}