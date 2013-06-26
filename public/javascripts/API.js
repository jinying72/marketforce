/*
 * This script process all site API requests
 */
function APIRun(type, method, data, onSuccess, onError) {
	var apikey = "860cadc66150eaa068825d0926ec3686";
	var baseurl = "http://www.site24x7.com/api/json/";

	var apiurl = baseurl + method + "?apikey=" + apikey;
	
	data.apiurl = apiurl;
	data.apitype = type;
	
	$.ajax({
		url: "http://localhost/site_24_7/proxy.php",
		type: "POST",
		data: data,
		dataType: "json",
		error: function(e) {
			console.log(e)
			if(onError)
				onError(e, data);
		},
		success: function(response) {
			console.log(response);
			if(onSuccess)
				onSuccess(response, data);
		}
	});

}
/*
function APIRun(type, method, data, onSuccess, onError) {
	var apikey = "860cadc66150eaa068825d0926ec3686";
	var baseurl = "//www.site24x7.com/api/json/";

	var apiurl = baseurl + method + "?apikey=" + apikey;
	
	$.ajax({
		url: apiurl,
		contentType: "application/x-www-form-urlencoded",
		type: type,
		data: data,
		dataType: "json",
		error: function(e) {
			if(onError)
				onError(e, data);
		},
		success: function(response) {
			if(onSuccess)
				onSuccess(response, data);
		}
	});
}
*/
function testSuccess(response) {
	console.log(response);
}

function testFail(response) {
	console.log(response);
	alert("Failed!\n" + response.responseText);
}

function addMonitor(data) {
	APIRun("POST", "addmonitor", data, testSuccess, testFail);
}

function listMonitors(data) {
	APIRun("GET", "listmonitors", data, loadMonitors, testFail);
}