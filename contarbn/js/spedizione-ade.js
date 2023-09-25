var baseUrl = "/contarbn-be/";


$(document).ready(function() {

	$(document).on('submit','#spedizioneAdeForm', function(event){
		event.preventDefault();

		var alertContent = '<div id="alertSpedizioneAdeContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var tipo = $('#searchTipo option:selected').val();
		var dataDa = $('#searchDataFrom').val();
		var dataA = $('#searchDataTo').val();

		if(tipo == null || tipo == undefined || tipo == ""){
			$('#alertSpedizioneAde').empty().append(alertContent.replace('@@alertText@@', "Selezionare un tipo").replace('@@alertResult@@', 'danger'));
			return false;
		}
		if(dataDa == null || dataDa == undefined || dataDa == ""){
			$('#alertSpedizioneAde').empty().append(alertContent.replace('@@alertText@@', "Selezionare una data da").replace('@@alertResult@@', 'danger'));
			return false;
		}
		if(dataA == null || dataA == undefined || dataA == ""){
			$('#alertSpedizioneAde').empty().append(alertContent.replace('@@alertText@@', "Selezionare una data a").replace('@@alertResult@@', 'danger'));
			return false;
		}

		$('#alertSpedizioneAde').empty().append(alertContent.replace('@@alertText@@','Generazione file in corso...').replace('@@alertResult@@', 'warning'));

		var params = {};
		if(tipo != null && tipo != undefined && tipo != ''){
			params.tipo = tipo;
		}
		if(dataDa != null && dataDa != undefined && dataDa != ''){
			params.dataDa = dataDa;
		}
		if(dataA != null && dataA != undefined && dataA != ''){
			params.dataA = dataA;
		}

		var url = baseUrl + "export-ade?" + $.param(params);

		$.ajax({
			type : "GET",
			url : url,
			xhrFields: {
				responseType: 'blob'
			},
			success: function(response, status, xhr){
				//console.log(response);

				var contentDisposition = xhr.getResponseHeader("Content-Disposition");
				var fileName = contentDisposition.substring(contentDisposition.indexOf("; ") + 1);
				fileName = fileName.replace("filename=","").trim();

				var blob = new Blob([response], { type: "application/zip" });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);

				$('#alertSpedizioneAde').empty();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione del file ZIP';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null
							&& jqXHRResponseJsonMessage != undefined
							&& jqXHRResponseJsonMessage != ''
							&& jqXHRResponseJsonMessage.indexOf('presente nelle date') != -1){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertSpedizioneAde').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});

	});

	$(document).on('click','#resetSpedizioneAdeButton', function(){
		$('#spedizioneAdeForm :input').val(null);
		$('#spedizioneAdeForm select option[value="fatture"]').attr('selected', true);
		$('#alertSpedizioneAde').empty();
	});
});

