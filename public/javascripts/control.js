/*
 * Monitors
 * 
www.marketforce.com 
www.onlinekmc
uk.marketforce.com
www.criny.com
www.marketforceshopper.com
 */
var Sites = [
	{url: "www.marketforce.com", name: "marketforce"},
	{url: "www.onlinekmc.com", name: "onlinekmc"},
	{url: "uk.marketforce.com", name: "marketforce-uk"},
	{url: "www.criny.com", name: "criny"},
	{url: "www.marketforceshopper.com", name: "marketforce-shopper"},
];

$(document).ready(function() {
	
	getMonitors();
	
});

function getMonitors() {
	var data = {
		"groupname":			"marketforce.monitorgroup"
	};
	
	listMonitors(data);
}

function addMonitors() {
	var data = {
		"displayname":			"marketforce",
		"url":					"http://www.marketforce.com",
		"groupname":			"marketforce.monitorgroup",
		"monitortype":			"URL",
		"pollinterval":			"10",
		"contactgroupnames":	"marketforce.contactgroup",
		"timeout":				"30",
		"primarylocation":		"California",
		"secondarylocation":	"London,Melbourne",
		"locationfailures":		"2",
		"maxfailurechecks":		"4",
		"method":				"P"
	};
	
	addMonitor(data);
}

function loadMonitors(response, data) {
	console.log(data);
	clearMonitors();
	
	var monitors = null;
	
	try {
		var groups = response[0].groups;console.log(groups);
		for(var i=0; i<groups.length; i++) {
			if(groups[i].groupname == data.groupname) {
				monitors = groups[i].group;
				break;
			}
		}
	}
	catch( e ) {
		console.log(e);
		monitors = null;
	}
	
	if(monitors && monitors.length) {
		for(var i=0; i<monitors.length; i++) {
			var monitor = monitors[i];
			
			var row = '<tr class="tr-monitor">'
				+ '<td>' + monitor.displayname + '</td>'
				+ '<td><a href="' + monitor.availabilityreport + '" target="_blank">View</a></td>'
				+ '<td><a href="' + monitor.responsetimereport + '" target="_blank">View</a></td>'
				+ '</tr>';
			
			$("#tbl_monitors tbody").append(row);
		}
	}
	else {
		$("#tbl_monitors tbody").append('<tr class="tr-monitor"><td colspan="3">No Data</tr>');
	}
}

function clearMonitors(response) {
	if(response)
		console.log("Failed!\n" + response.responseText);
	
	$("#tbl_monitors tr.tr-monitor").remove();
}
