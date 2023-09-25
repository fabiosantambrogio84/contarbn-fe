
var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#fornitoriTable').DataTable({
		"ajax": {
			"url": baseUrl + "fornitori",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertFornitoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei fornitori</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFornitore').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun fornitore disponibile",
			"zeroRecords": "Nessun fornitore disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'asc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "ragioneSociale", "data": "ragioneSociale"},
			{"name": "note", "data": "note"},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var links = '<a class="detailsFornitore pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle"></i></a>';
				links = links + '<a class="updateFornitore pr-2" data-id="'+data.id+'" href="fornitori-edit.html?idFornitore=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteFornitore" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');

			if($.fn.checkVariableIsNull(data.attivo)){
				$(row).css('background-color', '#FCAFAF');
			} else {
				if(data.tipoFornitore != null){
					var backgroundColor = '';
					if(data.tipoFornitore.codice == 'FORNITORE_INGREDIENTI'){
						backgroundColor = '#cee2f2';
					} else {
						backgroundColor = 'trasparent';
					}
					$(row).css('background-color', backgroundColor);
				}
			}
		}
	});

	$(document).on('click','.detailsFornitore', function(){
        var idFornitore = $(this).attr('data-id');

		var alertContent = '<div id="alertFornitoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero del fornitore.</strong></div>';

        $.ajax({
            url: baseUrl + "fornitori/" + idFornitore,
            type: 'GET',
            dataType: 'json',
            success: function(result) {
              if(result != null && result != undefined && result != ''){
              	var tipo = result.tipoFornitore != null ? result.tipoFornitore.descrizione : '';
              	var contentDetails = '<p><strong>Tipo: </strong>'+$.fn.printVariable(tipo)+'</p>';
              	  contentDetails += '<p><strong>Codice fornitore: </strong>'+$.fn.printVariable(result.codice)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Ragione sociale: </strong>'+$.fn.printVariable(result.ragioneSociale)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Ragione sociale 2: </strong>'+$.fn.printVariable(result.ragioneSociale2)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Indirizzo: </strong>'+$.fn.printVariable(result.indirizzo)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Citt&agrave;: </strong>'+$.fn.printVariable(result.citta)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Provincia: </strong>'+$.fn.printVariable(result.provincia)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Cap: </strong>'+$.fn.printVariable(result.cap)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Nazione: </strong>'+$.fn.printVariable(result.nazione)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Partita IVA: </strong>'+$.fn.printVariable(result.partitaIva)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Codice fiscale: </strong>'+$.fn.printVariable(result.codiceFiscale)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Telefono: </strong>'+$.fn.printVariable(result.telefono)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Telefono2: </strong>'+$.fn.printVariable(result.telefono2)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Telefono3: </strong>'+$.fn.printVariable(result.telefono3)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Email: </strong>'+$.fn.printVariable(result.email)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Email PEC: </strong>'+$.fn.printVariable(result.emailPec)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Email Ordini: </strong>'+$.fn.printVariable(result.emailOrdini)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Codice univoco SDI: </strong>'+$.fn.printVariable(result.codiceUnivocoSdi)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Iban: </strong>'+$.fn.printVariable(result.iban)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Pagamento: </strong>'+$.fn.printVariable(result.pagamento)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Note: </strong>'+$.fn.printVariable(result.note)+'</p>';
				  contentDetails = contentDetails + '<p><strong>Attivo: </strong>'+$.fn.printVariable(result.attivo)+'</p>';

				  $('#detailsFornitoreMainDiv').empty().append(contentDetails);

              } else{
                $('#detailsFornitoreMainDiv').empty().append(alertContent);
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#detailsFornitoreMainDiv').append(alertContent);
                console.log('Response text: ' + jqXHR.responseText);
            }
        });

        $('#detailsFornitoreModal').modal('show');
    });

	$(document).on('click','.deleteFornitore', function(){
		var idFornitore = $(this).attr('data-id');
		$('#confirmDeleteFornitore').attr('data-id', idFornitore);
		$('#deleteFornitoreModal').modal('show');
	});

	$(document).on('click','#confirmDeleteFornitore', function(){
		$('#deleteFornitoreModal').modal('hide');
		var idFornitore = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "fornitori/" + idFornitore,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertFornitoreContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Fornitore</strong> disabilitato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertFornitore').empty().append(alertContent);

				$('#fornitoriTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	$(document).on('change','#tipoFornitore', function(){
		var idTipoFornitore = $(this).val();
		if(idTipoFornitore != null && idTipoFornitore != "" && idTipoFornitore==1) {
			$('#barcodeMaskLottoScadenza').attr('disabled', false);
		} else {
			$('#barcodeMaskLottoScadenza').val(null);
			$('#barcodeMaskLottoScadenza').attr('disabled', true);
		}
	});

    /*
	if($('#dittaIndividuale') != null && $('#dittaIndividuale') != undefined){
		$(document).on('change','#dittaIndividuale', function(){
			var isChecked = $('#dittaIndividuale').prop('checked');
			if(isChecked){
				$('#nome').attr('disabled', false);
				$('#cognome').attr('disabled', false);
			} else{
				$('#nome').val(null);
				$('#cognome').val(null);
				$('#nome').attr('disabled', true);
				$('#cognome').attr('disabled', true);
			}
		});
	}
	*/

	if($('#updateFornitoreButton') != null && $('#updateFornitoreButton') != undefined){
		$(document).on('submit','#updateFornitoreForm', function(event){
			event.preventDefault();

			var tipoFornitore = new Object();
			tipoFornitore.id = $('#tipoFornitore option:selected').val();

			var fornitore = new Object();
			fornitore.id = $('#hiddenIdFornitore').val();
			fornitore.tipoFornitore = tipoFornitore;
			fornitore.codice = $('#codiceFornitore').val();
			fornitore.ragioneSociale = $('#ragioneSociale').val();
			fornitore.ragioneSociale2 = $('#ragioneSociale2').val();
			fornitore.indirizzo = $('#indirizzo').val();
			fornitore.citta = $('#citta').val();
			fornitore.provincia = $('#provincia option:selected').text();
			fornitore.cap = $('#cap').val();
			fornitore.nazione = $('#nazione').val();
			fornitore.partitaIva = $('#partitaIva').val();
			fornitore.codiceFiscale = $('#codiceFiscale').val();
			fornitore.telefono = $('#telefono').val();
			fornitore.telefono2 = $('#telefono2').val();
			fornitore.telefono3 = $('#telefono3').val();
			fornitore.email = $('#email').val();
			fornitore.emailPec = $('#emailPec').val();
			fornitore.emailOrdini = $('#emailOrdini').val();
			fornitore.codiceUnivocoSdi = $('#codiceUnivocoSdi').val();
			fornitore.iban = $('#iban').val();
			fornitore.pagamento = $('#pagamento').val();
			fornitore.barcodeMaskLottoScadenza = $('#barcodeMaskLottoScadenza').val();
			fornitore.note = $('#note').val();
			if($('#attivo').prop('checked') === true){
				fornitore.attivo = true;
			}else{
				fornitore.attivo = false;
			}

			var fornitoreJson = JSON.stringify(fornitore);

			var alertContent = '<div id="alertFornitoreContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "fornitori/" + $('#hiddenIdFornitore').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: fornitoreJson,
				success: function(result) {
					$('#alertFornitore').empty().append(alertContent.replace('@@alertText@@','Fornitore modificato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list page
					setTimeout(function() {
						window.location.href = "fornitori.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica del fornitore';
					if(jqXHR != null && jqXHR != undefined && jqXHR != ""){
						var responseJson = jqXHR.responseJSON;
						if(responseJson != null && responseJson != undefined && responseJson != ""){
							var message = jqXHR.responseJSON.message;
							if(message != null && message != undefined && message != ""){
								errorMessage += '. '+message;
							}
						}
					}

					$('#alertFornitore').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newFornitoreButton') != null && $('#newFornitoreButton') != undefined){
		$(document).on('submit','#newFornitoreForm', function(event){
			event.preventDefault();

			var tipoFornitore = new Object();
			tipoFornitore.id = $('#tipoFornitore option:selected').val();

			var fornitore = new Object();
			fornitore.tipoFornitore = tipoFornitore;
			fornitore.ragioneSociale = $('#ragioneSociale').val();
			fornitore.ragioneSociale2 = $('#ragioneSociale2').val();
			fornitore.indirizzo = $('#indirizzo').val();
			fornitore.citta = $('#citta').val();
			fornitore.provincia = $('#provincia option:selected').text();
			fornitore.cap = $('#cap').val();
			fornitore.nazione = $('#nazione').val();
			fornitore.partitaIva = $('#partitaIva').val();
			fornitore.codiceFiscale = $('#codiceFiscale').val();
			fornitore.telefono = $('#telefono').val();
			fornitore.telefono2 = $('#telefono2').val();
			fornitore.telefono3 = $('#telefono3').val();
			fornitore.email = $('#email').val();
			fornitore.emailPec = $('#emailPec').val();
			fornitore.emailOrdini = $('#emailOrdini').val();
			fornitore.codiceUnivocoSdi = $('#codiceUnivocoSdi').val();
			fornitore.iban = $('#iban').val();
			fornitore.pagamento = $('#pagamento').val();
			fornitore.barcodeMaskLottoScadenza = $('#barcodeMaskLottoScadenza').val();
			fornitore.note = $('#note').val();
			if($('#attivo').prop('checked') === true){
				fornitore.attivo = true;
			}else{
				fornitore.attivo = false;
			}

			var fornitoreJson = JSON.stringify(fornitore);

			var alertContent = '<div id="alertFornitoreContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "fornitori",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: fornitoreJson,
				success: function(result) {
					$('#alertFornitore').empty().append(alertContent.replace('@@alertText@@','Fornitore creato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list page
					setTimeout(function() {
						window.location.href = "fornitori.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione del fornitore';
					if(jqXHR != null && jqXHR != undefined && jqXHR != ""){
						var responseJson = jqXHR.responseJSON;
						if(responseJson != null && responseJson != undefined && responseJson != ""){
							var message = jqXHR.responseJSON.message;
							if(message != null && message != undefined && message != ""){
								errorMessage += '. '+message;
							}
						}
					}
					$('#alertFornitore').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.getProvince = function(){
	$.ajax({
		url: baseUrl + "utils/province",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#provincia').append('<option value="'+item+'">'+item+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getTipologieFornitore = function(){
	$.ajax({
		url: baseUrl + "tipi-fornitore",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					if(item != null ){
						$('#tipoFornitore').append('<option value="'+item.id+'">'+item.descrizione+'</option>');
					}

				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdFornitoreFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idFornitore') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.printVariable = function(variable){
    if(variable != null && variable != undefined && variable != ""){
        return variable;
    }
    return "";
}

$.fn.getFornitore = function(idFornitore){

	var alertContent = '<div id="alertFornitoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del fornitore.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    // load province
    $.fn.getProvince();

    $.ajax({
        url: baseUrl + "fornitori/" + idFornitore,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdFornitore').attr('value', result.id);
			var tipoFornitore = result.tipoFornitore;
			if(tipoFornitore != null){
				$('#tipoFornitore option[value="' + tipoFornitore.id +'"]').attr('selected', true);

				if(tipoFornitore.id != null && tipoFornitore.id != "" && tipoFornitore.id==1) {
					$('#barcodeMaskLottoScadenza').attr('disabled', false);
				} else {
					$('#barcodeMaskLottoScadenza').val(null);
					$('#barcodeMaskLottoScadenza').attr('disabled', true);
				}
			}
			$('#codiceFornitore').attr('value', result.codice);
            $('#ragioneSociale').attr('value', result.ragioneSociale);
            $('#ragioneSociale2').attr('value', result.ragioneSociale2);
            $('#indirizzo').attr('value', result.indirizzo);
            $('#citta').attr('value', result.citta);
            $('#provincia option[value="' + result.provincia +'"]').attr('selected', true);
            $('#cap').attr('value', result.cap);
            $('#nazione').attr('value', result.nazione);
            $('#partitaIva').attr('value', result.partitaIva);
            $('#codiceFiscale').attr('value', result.codiceFiscale);
			$('#telefono').attr('value', result.telefono);
			$('#telefono2').attr('value', result.telefono2);
			$('#telefono3').attr('value', result.telefono3);
			$('#email').attr('value', result.email);
			$('#emailPec').attr('value', result.emailPec);
			$('#emailOrdini').attr('value', result.emailOrdini);
			$('#codiceUnivocoSdi').attr('value', result.codiceUnivocoSdi);
			$('#iban').attr('value', result.iban);
			$('#pagamento').attr('value', result.pagamento);
			$('#barcodeMaskLottoScadenza').attr('value', result.barcodeMaskLottoScadenza);
			$('#note').val(result.note);
			if(result.attivo === true){
				$('#attivo').prop('checked', true);
			}

          } else{
            $('#alertFornitore').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertFornitore').empty().append(alertContent);
            $('#updateFornitoreButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
