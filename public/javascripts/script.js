$(document).ready(function(){
	var content = '';
    function exportTableToCSV(filename) {

        // Data URI
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(content);
	    $('.export_csv').attr({
	            'href': csvData,
	            'target': '_blank'
	    });
	    $('.export_csv').attr('download','test.csv');
	    //$('.export_csv').click();
    }

	$('#export_sel').change(function(){
		switch ($(this).find(":selected").text()){
		case 'CSV':
			content = '"Monitor Name","Uptime Status","Uptime for last 12 months","Current Response time","Average response time"';
			$('#tbl_monitors .tr-monitor').each(function(){
				content += '"' + ($(this).find('.groupname').text()) + '",';
				if ($(this).find('.uptime_status div').attr('class') == 'up')
					content += '100%,';
				else
					content += '0%,';
				content += ($(this).find('.uptime_12 a').text()) + ',';
				content += ($(this).find('.cur_rsp').text()) + ',';
				content += ($(this).find('.avg_rsp a').text()) + ',';
			});
			$('.export_csv').click();
			break;
		}
	});
	$('.export_csv').on('click',function(){
		exportTableToCSV.apply('export.csv');
	});
});