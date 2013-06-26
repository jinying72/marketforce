//validation
var errorClass = 'error';
var successClass = 'success';
var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var regPhone = /^[0-9]+$/;
var successFlag = true;

$('#login-page').live( 'pageshow', function(event,ui){
	initSetting();
});

$('#appointments-page').live( 'pageshow', function(event,ui){
	//localStorage['appointment_start'] = 0;
	getAppointments();
});

$('#locations-page').live( 'pageshow', function(event,ui){
	getLocations();
});

$('#employees-page').live( 'pageshow', function(event,ui){
	getEmployees();
});

$('#services-page').live( 'pageshow', function(event,ui){
	getServices();
});

$('#calendar-page').live( 'pageshow', function(event,ui){
	//getDays();
	getAvailabilityDays(new Date());
});

$('#times-page').live( 'pageshow', function(event,ui){
	getAvailabilityTimes();
});

$('#book-page').live( 'pageshow', function(event,ui){
	getBook();
});

/*
$(document).ready(function(){
	if($('#locations-page').length>0) {
		getLocations();
	}

	if($('#employees-page').length>0) {
		getEmployees();
	}

	if($('#services-page').length>0) {
		getServices();
	}
	
	if($('#calendar-page').length>0) {
		var now = new Date;
		var startDate = parseDate(now.getFullYear(), now.getMonth(),1);
		var endDate = parseDate(now.getFullYear(), now.getMonth()+1,1);
		var endDate = parseDate(endDate - 1);
		
		getDays( startDate, endDate );
	}

	if($('#times-page').length>0) {
		getTimes();
	}
	
	if($('#book-page').length>0) {
		getBook();
	}
});
*/

// form validation function
function validateForm(form) {
	var inputs = form.find('input[type=text], input[type=password], input[type=email]');
	successFlag = true;
	
	inputs.each(checkField);
	
	if(!successFlag) {
		return false;
	}
}

// check field
function checkField(i, obj) {
	var currentObject = $(obj);
	var currentParent = currentObject.parents('div.row-area');
	
	// not empty fields
	if(currentObject.hasClass('required')) {
		setState(currentParent, currentObject, !currentObject.val().length || currentObject.val() === currentObject.prop('defaultValue'));
	}
	// correct email fields
	if(currentObject.hasClass('required-email')) {
		setState(currentParent, currentObject, !regEmail.test(currentObject.val()));
	}
	// correct number fields
	if(currentObject.hasClass('required-number')) {
		setState(currentParent, currentObject, !regPhone.test(currentObject.val()));
	}
	// something selected
	if(currentObject.hasClass('required-select')) {
		setState(currentParent, currentObject, currentObject.get(0).selectedIndex === 0);
	}
	// correct password
	if(currentObject.hasClass('password-area')) {
		var error = true;
		var cur = currentObject.find('.curPassword');
		var comf = currentObject.find('.comfPassword');
		if(cur.val() == comf.val() && !comf.val() == 0 && cur.val().length >= 6) {
			error = false;
		}
		setState(currentObject, currentObject, error);
	}
}

// set state
function setState(hold, field, error) {
	hold.removeClass(errorClass).removeClass(successClass);
	if(error) {
		hold.addClass(errorClass);
		field.one('focus',function(){hold.removeClass(errorClass).removeClass(successClass);});
		successFlag = false;
	} else {
		hold.addClass(successClass);
	}
}

function checkOpen(day) {
	var openDays = [];
	if(localStorage['open_days'])
		openDays = JSON.parse(localStorage['open_days']);
	
	for(var i=0; i<openDays.length; i++) {
		var startDate = parseDate(openDays[i]);
		if(day.getFullYear()==startDate.getFullYear() && day.getMonth()==startDate.getMonth() && day.getDate()==startDate.getDate()) {
			return [true, 'open-day'];
		}
	}
	return [true, ''];
	
}

function changeMonthYear(year, month) {
	if(localStorage['open_days'])
		localStorage.removeItem('open_days');
	
	var now = new Date();
	if(now.getFullYear()>year || now.getFullYear()==year && (now.getMonth()+1)>month)
		return;
	if(now.getFullYear()==year && (now.getMonth()+1)==month)
		getAvailabilityDays(now);
	else {
		now.setFullYear(year);
		now.setMonth(month-1);
		now.setDate(1);
		getAvailabilityDays(now);
	}
	return;
}

function go_back(to) {
	jQuery.mobile.changePage(to, {transition:"slide", reverse:true});
}

function location_next() {
	var location_id, location_name;
	$("#locations-page .check-list input[type=radio]").each(function(){
		if(this.checked) {
			location_id = $(this).parent().attr("id").substring(9);
			location_name = $(this).parent().find(".title").html();
		}
	});
	
	if(location_id) {
		localStorage["location_id"] = location_id;
		localStorage["location_name"] = location_name;
		jQuery.mobile.changePage("employees.html", {transition:"slide"});
	}
	else {
		alert("Please choise location");
		
	}
	
	return false;
}

function employee_next() {
	var employee_id, employee_name;
	$("#employees-page .check-list input[type=radio]").each(function(){
		if(this.checked) {
			employee_id = $(this).parent().attr("id").substring(9);
			employee_name = $(this).parent().find(".title").html();
		}
	});
	
	if(employee_id) {
		localStorage["employee_id"] = employee_id;
		localStorage["employee_name"] = employee_name;
		jQuery.mobile.changePage("services.html", {transition:"slide"});
	}
	else {
		alert("Please choise provider");
		
	}
	
	return false;
}

function service_next() {
	var service_id, service_name;
	$("#services-page .check-list input[type=radio]").each(function(){
		if(this.checked) {
			service_id = $(this).parent().attr("id").substring(8);
			service_name = $(this).parent().find(".title").html();
		}
	});
	
	if(service_id) {
		localStorage["service_id"] = service_id;
		localStorage["service_name"] = service_name;
		jQuery.mobile.changePage("days.html", {transition:"slide"});
	}
	else {
		alert("Please choise service");
		
	}
	
	return false;
}

function day_next() {
	var open_day = $("#txt_open_day").val();
	if($(".ui-datepicker-current-day.open-day").length == 0 || !open_day) {
		alert("Please select day!");
		return false;
	}
	else {
		localStorage["open_day"] = open_day;
		jQuery.mobile.changePage("times.html", {transition:"slide"});
	}

}

function times_next() {
	var appointment_index;
	$("#times-page .check-list input[type=radio]").each(function(){
		if(this.checked) {
			appointment_index = $(this).parent().attr("id").substring(5);
		}
	});
	
	if(appointment_index ) {
		bookAppointment(appointment_index);
		
	}
	else {
		alert("Please choise time slot");
		
	}
	
	return false;
}
function booked() {
	localStorage.removeItem('open_days');
	jQuery.mobile.changePage("appointments.html", {transition:"slide"});
}