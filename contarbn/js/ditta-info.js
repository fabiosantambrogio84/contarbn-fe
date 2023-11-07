
var baseUrl = "/contarbn-be/";

$.fn.loadDittaInfoTable = function(url) {
	$('#dittaInfoTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertDittaInfoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei dati della ditta</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertDittaInfo').empty().append(alertContent);
			}
		},
		"language": {
			//"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun dato disponibile",
			"zeroRecords": "Nessun dato disponibile"
		},
		"searching": false,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "dato", "data": "dato"},
			{"name": "valore", "data": "valore"},
			{"data": null, "orderable":false, "width":"12%", render: function ( data, type, row ) {
				var links = '<a class="updateDittaInfo pr-2" data-id="'+data.id+'" href="ditta-info-edit.html?idDittaInfo=' + data.id + '"><i class="far fa-edit" title="Modifica"></i></a>';
				return links;
			}}
		]
	});
}

$(document).ready(function() {

	$.fn.loadDittaInfoTable(baseUrl + "ditta-info");

	if($('#updateDittaInfoButton') != null && $('#updateDittaInfoButton') != undefined){

		$(document).on('submit','#updateDittaInfoForm', function(event){
			event.preventDefault();

			var dittaInfo = new Object();
			dittaInfo.id = $('#hiddenIdDittaInfo').val();
			dittaInfo.dato = $('#dato').val();
			dittaInfo.valore = $('#valore').val();

			var dittaInfoJson = JSON.stringify(dittaInfo);

			var alertContent = '<div id="alertDittaInfoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ditta-info/" + $('#hiddenIdDittaInfo').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: dittaInfoJson,
				success: function(result) {
					$('#alertDittaInfo').empty().append(alertContent.replace('@@alertText@@','Valore modificato con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
						window.location.href = "ditta-info.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertDittaInfo').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del dato').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

});

$.fn.extractIdDittaInfoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idDittaInfo') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getDittaInfo = function(idDittaInfo){

	var alertContent = '<div id="alertDittaInfoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dei dati della ditta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "ditta-info/" + idDittaInfo,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdDittaInfo').attr('value', result.id);
			$('#dato').attr('value', result.dato);
			$('#valore').attr('value', result.valore);

          } else{
            $('#alertDittaInfo').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertDittaInfo').empty().append(alertContent);
            $('#updateDittaInfoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}