var baseUrl = "/contarbn-be/";


$(document).ready(function() {

	$.fn.isEmptyOrNull = function(string){
		if(string != null && string != undefined && string != ""){
			return false;
		}
		return true;
	}

	$.fn.checkSearchValues = function(){

		var alertContent = '<div id="alertStampeContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var dataDa = $('#searchDataFrom').val();
		var dataA = $('#searchDataTo').val();
		var numeroDa = $('#searchNumeroFrom').val();
		var numeroA = $('#searchNumeroTo').val();
		var numeroAnnoDa = $('#searchNumeroAnnoFrom').val();
		var numeroAnnoA = $('#searchNumeroAnnoTo').val();

		if($.fn.isEmptyOrNull(dataDa) && $.fn.isEmptyOrNull(dataA) && $.fn.isEmptyOrNull(numeroDa) && $.fn.isEmptyOrNull(numeroA)){
			var alertMessage = "Valorizzare i campi 'Data da'/'Data a' oppure i campi 'Numero da'/'Numero a'";
			$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', alertMessage).replace('@@alertResult@@', 'danger'));
			return false;
		}

		if((!$.fn.isEmptyOrNull(dataDa) || !$.fn.isEmptyOrNull(dataA)) && (!$.fn.isEmptyOrNull(numeroDa) || !$.fn.isEmptyOrNull(numeroA))){
			var alertMessage = "Non è possibile valorizzare sia i campi 'Data da'/'Data a' sia i campi 'Numero da'/'Numero a'";
			$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', alertMessage).replace('@@alertResult@@', 'danger'));
			return false;
		}

		if((!$.fn.isEmptyOrNull(dataDa) && $.fn.isEmptyOrNull(dataA)) || ($.fn.isEmptyOrNull(dataDa) && !$.fn.isEmptyOrNull(dataA))){
			var alertMessage = "Occorre valorizzare i campi 'Data da' e 'Data a'";
			$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', alertMessage).replace('@@alertResult@@', 'danger'));
			return false;
		}

		if((!$.fn.isEmptyOrNull(numeroDa) && $.fn.isEmptyOrNull(numeroA)) || ($.fn.isEmptyOrNull(numeroDa) && !$.fn.isEmptyOrNull(numeroA))){
			var alertMessage = "Occorre valorizzare i campi 'Numero da' e 'Numero a'";
			$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', alertMessage).replace('@@alertResult@@', 'danger'));
			return false;
		}

		if((!$.fn.isEmptyOrNull(numeroDa) && !$.fn.isEmptyOrNull(numeroA)) && ($.fn.isEmptyOrNull(numeroAnnoDa) || $.fn.isEmptyOrNull(numeroAnnoA))){
			var alertMessage = "Inserire un valore di 'anno' per i campi 'Numero da' e 'Numero a'";
			$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', alertMessage).replace('@@alertResult@@', 'danger'));
			return false;
		}

		if(moment(dataA) < moment(dataDa)){
			var alertMessage = "Il valore del campo 'Data a' non può essere precedente al valore del campo 'Data da'";
			$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', alertMessage).replace('@@alertResult@@', 'danger'));
			return false;
		}

		if(parseInt(numeroA) < parseInt(numeroDa)){
			var alertMessage = "Il valore del campo 'Numero a' non può essere minore del valore del campo 'Numero da'";
			$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', alertMessage).replace('@@alertResult@@', 'danger'));
			return false;
		}
		return true;
	}

	$.fn.createUrl = function(action){
		var dataDa = $('#searchDataFrom').val();
		var dataA = $('#searchDataTo').val();
		var numeroDa = $('#searchNumeroFrom').val();
		var numeroA = $('#searchNumeroTo').val();
		var numeroAnnoDa = $('#searchNumeroAnnoFrom').val();
		var numeroAnnoA = $('#searchNumeroAnnoTo').val();

		var params = {};
		params.action = action;
		if(dataDa != null && dataDa != undefined && dataDa != ''){
			params.dataDa = dataDa;
		}
		if(dataA != null && dataA != undefined && dataA != ''){
			params.dataA = dataA;
		}
		if(numeroDa != null && numeroDa != undefined && numeroDa != ''){
			var paramNumeroDa = numeroDa;
			if(numeroAnnoDa != null && numeroAnnoDa != undefined && numeroAnnoDa != ''){
				paramNumeroDa += "-"+numeroAnnoDa;
			}
			params.numeroDa = paramNumeroDa;
		}
		if(numeroA != null && numeroA != undefined && numeroA != ''){
			var paramNumeroA = numeroA;
			if(numeroAnnoA != null && numeroAnnoA != undefined && numeroAnnoA != ''){
				paramNumeroA += "-"+numeroAnnoA;
			}
			params.numeroA = paramNumeroA;
		}

		var path = "";
		if(action == "stampaFatture"){
			path = "/pdf";
		} else if(action == "stampaFattureCortesia"){
			path = "/pdf";
		} else if(action == "stampaFattureCommercianti"){
			path = "/pdf";
		} else if(action == "spedizioneFattureMail"){
			path = "/email";
		} else if(action == "spedizioneFatturePec"){
			path = "/email";
		}

		return baseUrl + "report" + path + "?" + $.param(params);
	}

	$(document).on('click','#stampaFatture', function(event){

		var alertContent = '<div id="alertStampeContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		if(!$.fn.checkSearchValues()){
			return false;
		}

		$('#alertStampe').empty().append(alertContent.replace('@@alertText@@','Generazione file in corso...').replace('@@alertResult@@', 'warning'));

		var url = $.fn.createUrl("stampaFatture");

		$.ajax({
			type : "GET",
			url : url,
			//xhrFields: {
			//	responseType: 'blob'
			//},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 2) {
						if (xhr.status == 200) {
							xhr.responseType = "blob";
						} else {
							xhr.responseType = "text";
						}
					}
				};
				return xhr;
			},
			success: function(response, status, xhr){
				//console.log(response);

				var contentDisposition = xhr.getResponseHeader("Content-Disposition");
				var fileName = contentDisposition.substring(contentDisposition.indexOf("; ") + 1);
				fileName = fileName.replace("filename=","").trim();

				var blob = new Blob([response], { type: "application/pdf" });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);

				$('#alertStampe').empty();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione del file PDF';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null
							&& jqXHRResponseJsonMessage != undefined
							&& jqXHRResponseJsonMessage != ''){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});

	});

	$(document).on('click','#stampaFattureCortesia', function(event){

		var alertContent = '<div id="alertStampeContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		if(!$.fn.checkSearchValues()){
			return false;
		}

		$('#alertStampe').empty().append(alertContent.replace('@@alertText@@','Generazione file in corso...').replace('@@alertResult@@', 'warning'));

		var url = $.fn.createUrl("stampaFattureCortesia");

		$.ajax({
			type : "GET",
			url : url,
			//xhrFields: {
			//	responseType: 'blob'
			//},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 2) {
						if (xhr.status == 200) {
							xhr.responseType = "blob";
						} else {
							xhr.responseType = "text";
						}
					}
				};
				return xhr;
			},
			success: function(response, status, xhr){
				//console.log(response);

				var contentDisposition = xhr.getResponseHeader("Content-Disposition");
				var fileName = contentDisposition.substring(contentDisposition.indexOf("; ") + 1);
				fileName = fileName.replace("filename=","").trim();

				var blob = new Blob([response], { type: "application/pdf" });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);

				$('#alertStampe').empty();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = 'Errore nella creazione del file PDF';
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null
							&& jqXHRResponseJsonMessage != undefined
							&& jqXHRResponseJsonMessage != ''){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});

	});

	$(document).on('click','#stampaFattureCommercianti', function(event){
		var alertContent = '<div id="alertStampeContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		if(!$.fn.checkSearchValues()){
			return false;
		}

		$('#alertStampe').empty().append(alertContent.replace('@@alertText@@','Generazione file in corso...').replace('@@alertResult@@', 'warning'));

		var url = $.fn.createUrl("stampaFattureCommercianti");

		$.ajax({
			type : "GET",
			url : url,
			//xhrFields: {
			//	responseType: 'blob'
			//},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 2) {
						if (xhr.status == 200) {
							xhr.responseType = "blob";
						} else {
							xhr.responseType = "text";
						}
					}
				};
				return xhr;
			},
			success: function(response, status, xhr){
				//console.log(response);

				var contentDisposition = xhr.getResponseHeader("Content-Disposition");
				var fileName = contentDisposition.substring(contentDisposition.indexOf("; ") + 1);
				fileName = fileName.replace("filename=","").trim();

				var blob = new Blob([response], { type: "application/pdf" });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);

				$('#alertStampe').empty();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = "Errore nella creazione del file PDF";
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null
							&& jqXHRResponseJsonMessage != undefined
							&& jqXHRResponseJsonMessage != ''){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('click','#spedizioneFattureMail', function(event){
		var alertContent = '<div id="alertStampeContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		if(!$.fn.checkSearchValues()){
			return false;
		}

		//$('#alertStampe').empty().append(alertContent.replace('@@alertText@@','Invio emails in corso...').replace('@@alertResult@@', 'warning'));

		var url = $.fn.createUrl("spedizioneFattureMail");

		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'text',
			success: function(result) {
				var alertResult = 'success';
				if(!$.fn.checkVariableIsNull(result)){
					if(result.includes('Error')){
						alertResult = 'danger';
					}
				}
				$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', result).replace('@@alertResult@@', alertResult));
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', "Errore nell'invio email").replace('@@alertResult@@', 'danger'));
			}
		});

	});

	$(document).on('click','#spedizioneFatturePec', function(event){
		var alertContent = '<div id="alertStampeContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		if(!$.fn.checkSearchValues()){
			return false;
		}

		$('#alertStampe').empty().append(alertContent.replace('@@alertText@@','Invio emails PEC in corso...').replace('@@alertResult@@', 'warning'));

		var url = $.fn.createUrl("spedizioneFatturePec");

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

				var blob = new Blob([response], { type: "application/text" });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);

				$('#alertStampe').empty();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = "Errore nell'invio delle email";
				if(jqXHR != null && jqXHR != undefined){
					var jqXHRResponseJson = jqXHR.responseJSON;
					if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
						var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
						if(jqXHRResponseJsonMessage != null
							&& jqXHRResponseJsonMessage != undefined
							&& jqXHRResponseJsonMessage != ''){
							errorMessage = jqXHRResponseJsonMessage;
						}
					}
				}
				$('#alertStampe').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('click','#resetStampeButton', function(){
		$('#stampeForm :input').val(null);
		$('#alertSampe').empty();
	});

	$(document).ready(function() {
		$('#searchNumeroAnnoFrom').val(moment().format('YYYY'));
		$('#searchNumeroAnnoTo').val(moment().format('YYYY'));
	});

});

/*$.fn.preloadFields = function(){
	$('#searchNumeroAnnoFrom').val(moment().format('YYYY'));
	$('#searchNumeroAnnoTo').val(moment().format('YYYY'));

}*/


