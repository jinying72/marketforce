function login() {
	var admin_email = $("#admin_email").val();
	var admin_password = $("#admin_password").val();
    
	if(!checkEmail(admin_email)) {
		alert("Invalid email format!");
		$("#admin_email").focus();
		return false;
	}
	
	if(admin_password=="") {
		alert("Please input password!");
		$("#admin_password").focus();
		return false;
	}
    
	var data = {"email":admin_email, "token":admin_password};
	
	//var data = {"email":login_email, "token":password};
	var url = "/account/authenticate";
	APIRun("POST", url, data, loginAdminSuccess, loginAdminFail);
}

function loginAdminSuccess(response, data) {
	console.log(response);
	if(response.statusCode == "0") {
		var user = response.data.user;
		user.token = response.data.session_token;
		
		localStorage['setster_login_user'] = JSON.stringify(user);
		localStorage['appointment_start'] = 0;
		
		//window.location.href = "locations.html";
		getAdminServices();
		jQuery.mobile.changePage("appointments.html", {transition:"slide"});
	}
	else
		alert(response.statusDescriptions);
}

function loginAdminFail() {
	alert("Login Failed!.");
}

function getAdminServices() {
	var user;
	if(localStorage['setster_login_user'])
		user = JSON.parse(localStorage['setster_login_user']);
	
	if(user && user.token) {
		var data = {"session_token":user.token};
		var url = "/service/";
		
		APIRun("GET", url, data, loadServiceNames, clearServiceNames);
	}
	else
		clearServiceNames();
}
function loadServiceNames(response) {
	var error = '';
	
	try {
		if(response.statusCode)
			error = response.statusDescription;
		else {
			var services = response.data;
			localStorage['serviceNames'] = JSON.stringify(services);
		}
	} catch(e) {
		error = 'Server Error';
	}
	if(error)
		clearServiceNames();
}
function clearServiceNames() {
	localStorage.removeItem('serviceNames');
}

function getServiceName( service_id, appointment_id) {
	var services;
	if(localStorage['serviceNames']) {
		services = JSON.parse(localStorage['serviceNames']);
	}
	
	$("#appointment_service_"+appointment_id).html("");
	
	if(services && services.length>0) {
		for(var i=0; i<services.length; i++) {
			var service = services[i];
			if(service.id==service_id) {
				$("#appointment_service_"+appointment_id).html(service.name);
				break;
			}
		}
	}
	else {
		var user;
		if(localStorage['setster_login_user'])
			user = JSON.parse(localStorage['setster_login_user']);
		
		if(user && user.token) {
			var data = {"session_token":user.token, "id": service_id};
			var url = "/service/";
			
			APIRun("GET", url, data, function(response){
				if(response.statusCode==0) {
					services = response.data;
					for(var i=0; i<services.length; i++) {
						if(services.hasOwnProperty(i)) {
							var service = services[i];
							$("#appointment_service_"+appointment_id).html(service.name);
							break;
						}
					}
				}
			}, function(){});
		}
	}
}

function getAppointments() {
	var user, start;
	if(localStorage['setster_login_user'])
		user = JSON.parse(localStorage['setster_login_user']);
	if(localStorage['appointment_start'])
		start = parseInt(localStorage['appointment_start'], 10);
	else
		start = 0;
	
	//console.log(user);
	if(user && user.token) {
		var data = {"session_token":user.token, "start":start, "end":start+PAGE_LIMIT-1, "sort_by":"start_date", "sort_order":"desc"};
		var url = "/appointment";
		
		APIRun("GET", url, data, loadAppointments, clearAppointments);
		
		//Get only appointments count
		var data = {"session_token":user.token, "num_results":1};
		APIRun("GET", url, data, function(response){
			if(response.statusCode)
				error = response.statusDescription;
			else {
				//console.log(response);
				var total = response.data;
				localStorage['appointment_total'] = total;
			}
		});
	}
	else
		clearAppointments();
}

function loadAppointments(response, data) {
	clearAppointments();
	
	var error = '';
	
	try {
		if(response.statusCode)
			error = response.statusDescription;
		else {
			var start = data.start;
			var total = parseInt(localStorage['appointment_total']);
			var count = 0;
			var appointments = response.data;
			for(var i=0; i<appointments.length; i++) {
				if(appointments.hasOwnProperty(i)) {
					var appointment = appointments[i];
					count++;
					
					var startDate = parseDate(appointment.start_date);
					var endDate = parseDate(appointment.end_date);
					var duration, h, m, a;
					
					duration = (startDate.getMonth() + 1) + "-" + startDate.getDate() + "-" + startDate.getFullYear() + " from ";
					h = (startDate.getHours()<10)? "0" + startDate.getHours(): startDate.getHours();
					m = (startDate.getMinutes()<10)? "0" + startDate.getMinutes(): startDate.getMinutes();
					if(h>12) {
						h = h - 12;
						a = " am";
						h = (h<10)? "0" + h: h;
					}
					else {
						a = " pm";
					}
						
					duration += h + ":" + m + a + " to ";
					
					h = (endDate.getHours()<10)? "0" + endDate.getHours(): endDate.getHours();
					m = (endDate.getMinutes()<10)? "0" + endDate.getMinutes(): endDate.getMinutes();
					if(h>12) {
						h = h - 12;
						a = " am";
						h = (h<10)? "0" + h: h;
					}
					else {
						a = " pm";
					}
						
					duration += h + ":" + m + a;
					
					var row = '<li id="appointment_' + appointment.id + '" data-icon="false">'
						+ '<a href="javascript:void(0)">'
						+ '<strong class="title" id="appointment_service_' + appointment.id + '"></strong>'
						+ '<p>' + duration + '</p>'
						+ '<p>' + appointment.client_name + '</p>';
					row += '</a><input type="radio" name="chk_appointment" /></li>';
					
					$("#appointments-page .check-list").append(row);
					
					getServiceName(appointment.service_id, appointment.id);
				}
			}
			
			if(start >= PAGE_LIMIT) {
				$("#link_prev").show();
			}
			else {
				$("#link_prev").hide();
			}
			
			if(start+PAGE_LIMIT >= total) {
				$("#link_next").hide();
			}
			else {
				$("#link_next").show();
			}
			$("#page_shows").html(" " + (start+1) + " ~ " + (start+count));
			
			if($("#appointments-page .check-list li").length==1) {
				$("#appointments-page .check-list input[type=radio]").attr("checked", "checked");
			}
			
			initSelectsList();
		}
		
		
	} catch(e) {
		error = 'Server Error';
	}
	
	if(error)
		console.log("Error: " + error);
}
function clearAppointments(response) {
	if(response)
		console.log("Failed!\n" + response.responseText);
	
	$("#appointments-page .check-list").find("li").remove();
}
function goNextAppointments(){
	var start=0;
	if(localStorage['appointment_start'])
		start = parseInt(localStorage['appointment_start'], 10);
	localStorage['appointment_start'] = start + PAGE_LIMIT;
	
	jQuery.mobile.changePage("appointments.html", {reloadPage: true, transition:"slide"});
	//getAppointments();
}
function goPrevAppointments(){
	var start=0;
	if(localStorage['appointment_start'])
		start = parseInt(localStorage['appointment_start'], 10);
	localStorage['appointment_start'] = (start-PAGE_LIMIT>0)? start-PAGE_LIMIT: 0;
	
	jQuery.mobile.changePage("appointments.html", {reloadPage: true, transition:"slide", reverse:true});
	//getAppointments();
}

function deleteConfirmAppointment() {
	var appointment_id;
	$("#appointments-page .check-list input[type=radio]").each(function(){
		if(this.checked) {
			appointment_id = $(this).parent().attr("id").substring(12);
			appointment_name = $(this).parent().find(".title").html();
		}
	});
	
	if(appointment_id) {
		if(!confirm("Are you sure to delete the appointment?"))
			return fasle;
		deleteAppointment(appointment_id);
	}
	else {
		alert("Please choise appointment");
		
	}
	
	return false;
}

function deleteAppointment(appointment_id) {
	var user;
	if(localStorage['setster_login_user'])
		user = JSON.parse(localStorage['setster_login_user']);
	//console.log(user);
	if(user && user.token) {
		var data = {"session_token":user.token};
		var url = "/appointment/" + appointment_id;
		
		APIRun("DELETE", url, data, function(response){
			//console.log(response);
			if(response.statusCode==0) {
				//var total = parseInt(localStorage['appointment_total']);
				//$("#appointment_"+appointment_id).remove();
				//jQuery.mobile.changePage("appointments.html", {reloadPage: true, transition:false});
				getAppointments();
			}
			else {
				deleteFail();
			}
		}, deleteFail);
		
	}
	else
		deleteFail();
}

function deleteFail(response) {
	if(response)
		console.log(response);
	
	alert("Failed to delete!");
}

function signup() {
	//if(!validateForm($("#signup_form")))
	//	return false;
	
	var email = $("#signup_email").val();
	if(!checkEmail(email)) {
		alert("Invalid email format!");
		$("#signup_email").focus();
		return false;
	}
	var password = $("#signup_password").val();
	if(password.length<6) {
		alert("Please input password at least 6 characters!");
		$("#signup_password").focus();
		return false;
	}
	var passwrod_confirm = $("#password_confirm").val();
	if(password!=passwrod_confirm) {
		alert("Password does not match!");
		$("#password_confirm").focus();
		return false;
	}
	
	var data = {"email":email, "pass":password};
	var url = "/account/authenticate";
	
	APIRun("POST", url, data, signupSuccess, signupFail);
}

function signupSuccess(response) {
	if(response.statusCode == "0") {
		user = response.data.account;
		user.email = $("#signup_email").val();
		user.token = response.data.sessionId;
		
		localStorage['setster_login_user'] = JSON.stringify(user);
		$.mobile.changePage("locations.html", {transition:"slide"});
	}
	else
		alert(response.statusDescriptions);
}

function signupFail() {
	alert("Signup failed!");
}

function getPassword() {
	var email = $("#forgot_email").val();
	if(!checkEmail(email)) {
		alert("Invalid email format!");
		return false;
	}

	var data = {"email":email, "confirmation_url":""};
	var url = "/account/request_password_reset";
	
	APIRun("POST", url, data, getPasswordSuccess, getPasswordFail);
	
}

function getPasswordSuccess(response) {
	if(response.statusCode == "0")
		alert(response.statusDescriptions);
}

function getPasswordFail() {
	alert("getPasswordFail");
}
