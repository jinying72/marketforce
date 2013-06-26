
/*
 * GET monitors page.
 */

exports.response_time = function(req, res) {
	
	var product_group_names = ['marketforce.monitorgroup','onlinekmc.monitorgroup'];
	
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    var pg = require('pg');
    var client = new pg.Client({
    	user:'postgres',
    	password:'aidqhgjfdiq',
    	database:'uptime_management',
    	host:'localhost',
    	port:5432
    });
    client.connect();
	//client.end();
    
	var resp_arr = [];
	var resp_mon = [];
	var Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	var http = require('http');

    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
	//get average responsive time
	client.query("SELECT * FROM rsp_time_history_m WHERE groupname='"+query['groupname']+"' ORDER BY date DESC LIMIT 12" ,function(err, result){
		var val_temp, mon_temp;
		for (var i = 0; i < result.rowCount; i++){
			val_temp = result.rows[i]['value'];
			val_temp = val_temp.replace('ms','').replace(' ','');
			mon_temp = result.rows[i]['date'];
			mon_temp = mon_temp.getMonth();
			resp_arr.push(parseInt(val_temp));
			resp_mon.push(Months[mon_temp]);
		}
		resp_mon = resp_mon.reverse();
		console.log(resp_mon);
	});
	setTimeout(function(){
		res.render('response_time', { rsp_time : resp_arr.reverse(), rsp_mon : resp_mon });
	}, 2000);

	//client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Ronald', 'McDonald']);

	// write data to request body

}