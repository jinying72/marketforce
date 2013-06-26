
/*
 * GET monitors page.
 */

exports.monitors = function(req, res) {
	
	var product_group_names = ['marketforce.monitorgroup','onlinekmc.monitorgroup'];
	
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    var pg = require('pg');
    //var conString = "TCP :/ / my_server: aidqhgjfdiq @ localhost / uptime_management";
    //var client = new pg.Client(conString);
    var client = new pg.Client({
    	user:'postgres',
    	password:'aidqhgjfdiq',
    	database:'uptime_management',
    	host:'localhost',
    	port:5432
    });
    client.connect();
	//client.end();
    
    var http = require('http');
    
    var options = {
	  host: 'www.site24x7.com',
	  path: '/api/json/listmonitors?apikey=860cadc66150eaa068825d0926ec3686',
	  method: 'GET'
	};

    var result='';
	var req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    result += chunk;
	  });
	  res.on('end', function () {
		    console.log('request is done');
		    result = JSON.parse(result);
	  });
	});
	
	//Current Uptime Status and response time
	var options_status = {
		host:'www.site24x7.com',
		path: '/api/json/currentstatus?apikey=860cadc66150eaa068825d0926ec3686',
		method: 'GET'
	};
	var status_result = '';
	var resp_arr = [];
	var resp_counts = [];
	var uptime_arr = [];
	var uptime_counts = [];

	var req1 = http.request(options_status, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk){
			status_result += chunk;
		});
		res.on('end', function(){
			status_result = JSON.parse(status_result);
			//regular responsive time insert for cron job
			/*var current_time;
			for (var i in status_result[0]['groups']){
				if (product_group_names.indexOf(status_result[0]['groups'][i]['groupname']) != -1 ){
					current_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
					client.query("INSERT INTO rsp_time_history(groupname, value, date, time) values($1, $2, $3, $4)", [status_result[0]['groups'][i]['groupname'], status_result[0]['groups'][i]['group'][0]['rspvalue'], current_time, current_time]);
				}
			}*/
			
			//get average responsive time
			client.query("SELECT * FROM rsp_time_history",function(err, result){
				var val_temp;
				for (var i = 0; i < result.rowCount; i++){
					val_temp = result.rows[i]['value'];
					val_temp = val_temp.replace('ms','');
					val_temp = val_temp.replace(' ','');
					if (!resp_arr[result.rows[i]['groupname']]){
						resp_arr[result.rows[i]['groupname']] = 0;
						resp_counts[result.rows[i]['groupname']] = 0;
					}
					resp_arr[result.rows[i]['groupname']] += parseInt(result.rows[i]['value'], 10);
					resp_counts[result.rows[i]['groupname']] ++;
				}
				var key;
				for (key in resp_arr){
					resp_arr[key] /= resp_counts[key];
					resp_arr[key] = Math.round(resp_arr[key]);
				}
			});
			client.query("SELECT * FROM uptime_history_m ORDER BY id DESC", function(err, result){
				for (var i = 0; i < result.rowCount; i++){
					if (!uptime_arr[result.rows[i]['groupname']]){
						uptime_arr[result.rows[i]['groupname']] = 0;
						uptime_counts[result.rows[i]['groupname']] = 0;
					}
					if (uptime_counts[result.rows[i]['groupname']] < 12){
						uptime_arr[result.rows[i]['groupname']] += parseInt(result.rows[i]['value'], 10);
						uptime_counts[result.rows[i]['groupname']] ++;
					}
				}
				for (var key in uptime_arr){
					uptime_arr[key] /= 12;
					uptime_arr[key] = Math.round(uptime_arr[key]);
				}
			});
		});
	});


	  req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
	  setTimeout(function(){
		  res.render('mornitors', { data : result, status : status_result, avg_rsp_time : resp_arr, uptime : uptime_arr });
	  }, 4000);
	 
    //client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Ronald', 'McDonald']);

	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req1.write('data\n');
	req1.write('data\n');
	req1.end();
	req.end();
}