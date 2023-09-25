
var baseUrl = "/contarbn-be/";

$.fn.loadClientiTable = function(url) {
	$('#clientiTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei clienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertCliente').empty().append(alertContent);
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
			"emptyTable": "Nessun cliente disponibile",
			"zeroRecords": "Nessun cliente disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "ragioneSocialeNomeCognome", "data": null, render: function ( data, type, row ) {
				if(data.privato){
					return data.nome+' '+data.cognome;
				} else {
					return data.ragioneSociale;
				}
			}},
			{"name": "indirizzo", "data": "indirizzo"},
			{"name": "citta", "data": "citta"},
			{"name": "provincia", "data": "provincia"},
			{"data": null, "orderable":false, "width":"12%", render: function ( data, type, row ) {
				var links = '<a class="detailsCliente pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';
				links = links + '<a class="updateCliente pr-2" data-id="'+data.id+'" href="clienti-edit.html?idCliente=' + data.id + '"><i class="far fa-edit" title="Modifica"></i></a>';
				links = links + '<a class="manageClientePuntiConsegna pr-2" data-id="'+data.id+'" href="cliente-punti-consegna.html?idCliente=' + data.id + '"><i class="fas fa-truck-moving" title="Punti di consegna"></i></a>';
				//links = links + '<a class="manageClienteListini pr-2" data-id="'+data.id+'" href="cliente-listini-associati.html?idCliente=' + data.id + '"><i class="fas fa-list-ul" title="Listini"></i></a>';
				links = links + '<a class="deleteCliente" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt" title="Elimina"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			if(data.bloccaDdt){
				$(row).css('background-color', '#d2d4d2');
			}
			if(data.privato){
				$(row).css('background-color', '#d4e6fa');
			}
		}
	});
}

$(document).ready(function() {

	$.fn.loadClientiTable(baseUrl + "clienti");

	$(document).on('click','#resetSearchClientiButton', function(){
		$('#searchClientiForm select option[value=""]').attr('selected', true);

		$('#clientiTable').DataTable().destroy();
		$.fn.loadClientiTable(baseUrl + "clienti");
	});

	$(document).on('click','.detailsCliente', function(){
        var idCliente = $(this).attr('data-id');

		var alertContent = '<div id="alertClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero del cliente.</strong></div>';

        $.ajax({
            url: baseUrl + "clienti/" + idCliente,
            type: 'GET',
            dataType: 'json',
            success: function(result) {
              if(result != null && result != undefined && result != ''){
              	var contentDetails = '<p><strong>Codice cliente: </strong>'+$.fn.printVariable(result.codice)+'</p>';
				  contentDetails += '<p><strong>Ragione sociale: </strong>'+$.fn.printVariable(result.ragioneSociale)+'</p>';
				  contentDetails += '<p><strong>Ragione sociale 2: </strong>'+$.fn.printVariable(result.ragioneSociale2)+'</p>';
				  contentDetails += '<p><strong>Ditta individuale: </strong>'+$.fn.printVariable(result.dittaIndividuale)+'</p>';
				  contentDetails += '<p><strong>Nome: </strong>'+$.fn.printVariable(result.nome)+'</p>';
				  contentDetails += '<p><strong>Cognome: </strong>'+$.fn.printVariable(result.cognome)+'</p>';
				  contentDetails += '<p><strong>Indirizzo: </strong>'+$.fn.printVariable(result.indirizzo)+'</p>';
				  contentDetails += '<p><strong>Citt&agrave;: </strong>'+$.fn.printVariable(result.citta)+'</p>';
				  contentDetails += '<p><strong>Provincia: </strong>'+$.fn.printVariable(result.provincia)+'</p>';
				  contentDetails += '<p><strong>Cap: </strong>'+$.fn.printVariable(result.cap)+'</p>';
				  contentDetails += '<p><strong>Partita IVA: </strong>'+$.fn.printVariable(result.partitaIva)+'</p>';
				  contentDetails += '<p><strong>Codice fiscale: </strong>'+$.fn.printVariable(result.codiceFiscale)+'</p>';
				  contentDetails += '<p><strong>Email: </strong>'+$.fn.printVariable(result.email)+'</p>';
				  contentDetails += '<p><strong>Email PEC: </strong>'+$.fn.printVariable(result.emailPec)+'</p>';
				  contentDetails += '<p><strong>Telefono: </strong>'+$.fn.printVariable(result.telefono)+'</p>';
				  if(result.banca != null && result.banca != undefined){
					  contentDetails += '<p><strong>Banca: </strong>'+$.fn.printVariable(result.banca.nome)+'</p>';
				  } else {
					  contentDetails += '<p><strong>Banca: </strong></p>';
				  }
				  contentDetails += '<p><strong>Conto corrente: </strong>'+$.fn.printVariable(result.contoCorrente)+'</p>';
				  if(result.tipoPagamento != null && result.tipoPagamento != undefined){
					  contentDetails += '<p><strong>Tipo pagamento: </strong>'+$.fn.printVariable(result.tipoPagamento.descrizione)+'</p>';
				  } else {
					  contentDetails += '<p><strong>Tipo pagamento: </strong></p>';
				  }
				  if(result.agente != null && result.agente != undefined){
					  contentDetails += '<p><strong>Agente: </strong>'+$.fn.printVariable(result.agente.nome)+' '+$.fn.printVariable(result.agente.cognome)+'</p>';
				  } else {
					  contentDetails += '<p><strong>Agente: </strong></p>';
				  }
				  if(result.listino != null && result.listino != undefined){
					  contentDetails += '<p><strong>Listino: </strong>'+$.fn.printVariable(result.listino.nome)+'</p>';
				  } else {
					  contentDetails += '<p><strong>Agente: </strong></p>';
				  }
                  contentDetails += '<p><strong>Estrazione Conad: </strong>'+$.fn.printVariable(result.estrazioneConad)+'</p>';
				  contentDetails += '<p><strong>Modalita invio fatture: </strong>'+$.fn.printVariable(result.modalitaInvioFatture)+'</p>';
                  contentDetails += '<p><strong>Blocca DDT: </strong>'+$.fn.printVariable(result.bloccaDdt)+'</p>';
                  contentDetails += '<p><strong>Nascondi prezzi: </strong>'+$.fn.printVariable(result.nascondiPrezzi)+'</p>';
                  contentDetails += '<p><strong>Raggruppa RiBa: </strong>'+$.fn.printVariable(result.raggruppaRiba)+'</p>';
                  contentDetails += '<p><strong>Nome gruppo RiBa: </strong>'+$.fn.printVariable(result.nomeGruppoRiba)+'</p>';
                  contentDetails += '<p><strong>Codice univoco SDI: </strong>'+$.fn.printVariable(result.codiceUnivocoSdi)+'</p>';
				  contentDetails += '<p><strong>Note: </strong>'+$.fn.printVariable(result.note)+'</p>';
				  contentDetails += '<p><strong>Note documenti: </strong>'+$.fn.printVariable(result.noteDocumenti)+'</p>';

				  var articoli = "";
				  if(result.clienteArticoli != null && result.clienteArticoli != undefined && result.clienteArticoli.length != 0){

					  $.each(result.clienteArticoli, function(i, item){
						  var articolo = item.articolo;
						  if(articolo != null && articolo != undefined){
						  	 var descrArticolo = articolo.codice + " "+articolo.descrizione + "; ";
						  	 articoli += descrArticolo
						  }
					  });
				  }
				  contentDetails += '<p><strong>Articoli: </strong>'+$.fn.printVariable(articoli)+'</p>';

				  $('#detailsClienteMainDiv').empty().append(contentDetails);

              } else{
                $('#detailsClienteMainDiv').empty().append(alertContent);
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#detailsClienteMainDiv').append(alertContent);
                console.log('Response text: ' + jqXHR.responseText);
            }
        });

        $('#detailsClienteModal').modal('show');
    });

	$(document).on('click','.deleteCliente', function(){
		var idCliente = $(this).attr('data-id');
		$('#confirmDeleteCliente').attr('data-id', idCliente);
		$('#deleteClienteModal').modal('show');
	});

	$(document).on('click','#confirmDeleteCliente', function(){
		$('#deleteClienteModal').modal('hide');
		var idCliente = $(this).attr('data-id');

        var alertContent = '<div id="alertClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
        				alertContent = alertContent + '@@alertText@@\n' +
        					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "clienti/" + idCliente,
			type: 'DELETE',
			success: function() {
				$('#alertCliente').empty().append(alertContent.replace('@@alertText@@', 'Cliente cancellato con successo.').replace('@@alertResult@@', 'success'));

				$('#clientiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				alertText = 'Errore nella cancellazione del cliente.<br/>Assicurarsi di aver cancellato eventuali listini, articoli, telefonate e punti di consegna associati.'
                $('#alertCliente').empty().append(alertContent.replace('@@alertText@@', alertText).replace('@@alertResult@@', 'danger'));
			}
		});
	});

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

	if($('#raggruppaRiba') != null && $('#raggruppaRiba') != undefined){
		$(document).on('change','#raggruppaRiba', function(){
			var isChecked = $('#raggruppaRiba').prop('checked');
			if(isChecked){
				$('#nomeGruppoRiba').attr('disabled', false);
			} else{
				$('#nomeGruppoRiba').val(null);
				$('#nomeGruppoRiba').attr('disabled', true);
			}
		});
	}

	if($('#privato') != null && $('#privato') != undefined){
		$(document).on('change','#privato', function(){
			var isChecked = $('#privato').prop('checked');
			if(isChecked){
				$('#ragioneSociale').val(null).attr('disabled', true);
				$('#ragioneSociale2').val(null).attr('disabled', true);
				$('#dittaIndividuale').prop('checked', false).attr('disabled', true);
				$('#nome').val(null).attr('disabled', false);
				$('#cognome').val(null).attr('disabled', false);
				$('#indirizzo').val(null).attr('disabled', false);
				$('#citta').val(null).attr('disabled', false);
				$('#provincia').attr('disabled', false);
				$('#cap').val(null).attr('disabled', false);
				$('#partitaIva').val(null).attr('disabled', true);
				$('#codiceFiscale').val(null).attr('disabled', false);
				$('#listinoApplicato').attr('disabled', false);
				$('#email').val(null).attr('disabled', false);
				$('#emailPec').val(null).attr('disabled', true);
				$('#telefono').val(null).attr('disabled', false);
				$('#banca').val(null).attr('disabled', false);
				$('#contoCorrente').val(null).attr('disabled', false);
				$('#tipoPagamento').attr('disabled', false);
				$('#agente').val(null).attr('disabled', true);
				$('#estrazioneConad').val(null).attr('disabled', true);
				$('#bloccaDdt').prop('checked', false).attr('disabled', false);
				$('#nascondiPrezzi').prop('checked', false).attr('disabled', false);
				$('#raggruppaRiba').prop('checked', false).attr('disabled', true);
				$('#nomeGruppoRiba').val(null).attr('disabled', true);
				$('#codiceUnivocoSdi').val(null).attr('disabled', false);
				$('#note').val(null).attr('disabled', false);
				$('#noteDocumenti').val(null).attr('disabled', false);

			} else{
				$('#ragioneSociale').val(null).attr('disabled', false);
				$('#ragioneSociale2').val(null).attr('disabled', false);
				$('#dittaIndividuale').prop('checked', false).attr('disabled', false);
				$('#nome').val(null).attr('disabled', true);
				$('#cognome').val(null).attr('disabled', true);
				$('#indirizzo').val(null).attr('disabled', false);
				$('#citta').val(null).attr('disabled', false);
				$('#provincia').attr('disabled', false);
				$('#cap').val(null).attr('disabled', false);
				$('#partitaIva').val(null).attr('disabled', false);
				$('#codiceFiscale').val(null).attr('disabled', false);
				$('#listinoApplicato').attr('disabled', false);
				$('#email').val(null).attr('disabled', false);
				$('#emailPec').val(null).attr('disabled', false);
				$('#telefono').val(null).attr('disabled', false);
				$('#banca').val(null).attr('disabled', false);
				$('#contoCorrente').val(null).attr('disabled', false);
				$('#tipoPagamento').attr('disabled', false);
				$('#agente').val(null).attr('disabled', false);
				$('#estrazioneConad').val(null).attr('disabled', false);
				$('#bloccaDdt').prop('checked', false).attr('disabled', false);
				$('#nascondiPrezzi').prop('checked', false).attr('disabled', false);
				$('#raggruppaRiba').prop('checked', false).attr('disabled', false);
				$('#nomeGruppoRiba').val(null).attr('disabled', false);
				$('#codiceUnivocoSdi').val(null).attr('disabled', false);
				$('#note').val(null).attr('disabled', false);
				$('#noteDocumenti').val(null).attr('disabled', false);
			}
		});
	}

	if($('#searchClienteButton') != null && $('#searchClienteButton') != undefined) {
		$(document).on('submit', '#searchClienteForm', function (event) {
			event.preventDefault();

			var privato = $('#searchPrivato option:selected').val();
			var idListino = $('#searchListino option:selected').val();

			var params = {};

			if(privato != null && privato != undefined && privato != ''){
				params.privato = privato;
			}
			if(idListino != null && idListino != undefined && idListino != ''){
				params.idListino = idListino;
			}
			var url = baseUrl + "clienti?" + $.param( params );

			$('#clientiTable').DataTable().destroy();
			$.fn.loadClientiTable(url);
		});
	}

	if($('#updateClienteButton') != null && $('#updateClienteButton') != undefined){
		$('#articolo').selectpicker();

		$(document).on('submit','#updateClienteForm', function(event){
			event.preventDefault();

			var cliente = new Object();
			cliente.id = $('#hiddenIdCliente').val();
			cliente.codice = $('#codice').val();
			if($('#privato').prop('checked') === true){
				cliente.privato = true;
			}else{
				cliente.privato = false;
			}
			cliente.ragioneSociale = $('#ragioneSociale').val();
			cliente.ragioneSociale2 = $('#ragioneSociale2').val();
			if($('#dittaIndividuale').prop('checked') === true){
				cliente.dittaIndividuale = true;
			}else{
				cliente.dittaIndividuale = false;
			}
			cliente.nome = $('#nome').val();
			cliente.cognome = $('#cognome').val();
			cliente.indirizzo = $('#indirizzo').val();
			cliente.citta = $('#citta').val();
			cliente.provincia = $('#provincia option:selected').text();
			cliente.cap = $('#cap').val();
			cliente.partitaIva = $('#partitaIva').val();
			cliente.codiceFiscale = $('#codiceFiscale').val();
			cliente.email = $('#email').val();
			cliente.emailPec = $('#emailPec').val();
			cliente.telefono = $('#telefono').val();
			if($('#banca option:selected').val() && $('#banca option:selected').val() != -1){
			    var banca = new Object();
                banca.id = $('#banca option:selected').val();
                cliente.banca = banca;
			}
			cliente.contoCorrente = $('#contoCorrente').val();
			var tipoPagamento = new Object();
			tipoPagamento.id = $('#tipoPagamento option:selected').val();
			cliente.tipoPagamento = tipoPagamento;
			if($('#agente option:selected').val() && $('#agente option:selected').val() != -1){
			    var agente = new Object();
                agente.id = $('#agente option:selected').val();
                cliente.agente = agente;
			}
			if($('#listinoApplicato option:selected').val() && $('#listinoApplicato option:selected').val() != -1){
				var listino = new Object();
				listino.id = $('#listinoApplicato option:selected').val();
				cliente.listino = listino;
			}
			cliente.estrazioneConad = $('#estrazioneConad').val();
			cliente.modalitaInvioFatture = $('#modalitaInvioFatture option:selected').val();
			if($('#bloccaDdt').prop('checked') === true){
				cliente.bloccaDdt = true;
			}else{
				cliente.bloccaDdt = false;
			}
			if($('#nascondiPrezzi').prop('checked') === true){
				cliente.nascondiPrezzi = true;
			}else{
				cliente.nascondiPrezzi = false;
			}
			if($('#raggruppaRiba').prop('checked') === true){
				cliente.raggruppaRiba = true;
			}else{
				cliente.raggruppaRiba = false;
			}
			cliente.nomeGruppoRiba = $('#nomeGruppoRiba').val();
			cliente.codiceUnivocoSdi = $('#codiceUnivocoSdi').val();
			cliente.note = $('#note').val();
			cliente.noteDocumenti = $('#noteDocumenti').val();

			var articoli = $('#articolo').val();
			if(articoli != null && articoli.length != 0){
				var clienteArticoli = [];
				$.each(articoli, function(i, item){
					var clienteArticolo = {};
					var clienteArticoloId = new Object();
					clienteArticoloId.articoloId = item;
					clienteArticolo.id = clienteArticoloId;

					clienteArticoli.push(clienteArticolo);
				})
				cliente.clienteArticoli = clienteArticoli;
			}

			var clienteJson = JSON.stringify(cliente);

			var alertContent = '<div id="alertClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "clienti/" + $('#hiddenIdCliente').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: clienteJson,
				success: function(result) {
					$('#alertCliente').empty().append(alertContent.replace('@@alertText@@','Cliente modificato con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
						window.location.href = "clienti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCliente').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del cliente').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newClienteButton') != null && $('#newClienteButton') != undefined){
		$('#articolo').selectpicker();

		$(document).on('submit','#newClienteForm', function(event){
			event.preventDefault();

			var cliente = new Object();
			if($('#privato').prop('checked') === true){
				cliente.privato = true;
			}else{
				cliente.privato = false;
			}
			cliente.ragioneSociale = $('#ragioneSociale').val();
			cliente.ragioneSociale2 = $('#ragioneSociale2').val();
			if($('#dittaIndividuale').prop('checked') === true){
				cliente.dittaIndividuale = true;
			}else{
				cliente.dittaIndividuale = false;
			}
			cliente.nome = $('#nome').val();
			cliente.cognome = $('#cognome').val();
			cliente.indirizzo = $('#indirizzo').val();
			cliente.citta = $('#citta').val();
			cliente.provincia = $('#provincia option:selected').text();
			cliente.cap = $('#cap').val();
			cliente.partitaIva = $('#partitaIva').val();
			cliente.codiceFiscale = $('#codiceFiscale').val();
			cliente.email = $('#email').val();
			cliente.emailPec = $('#emailPec').val();
			cliente.telefono = $('#telefono').val();
			if($('#banca option:selected').val() != undefined && $('#banca option:selected').val() != -1){
                var banca = new Object();
                banca.id = $('#banca option:selected').val();
                cliente.banca = banca;
            }
			cliente.contoCorrente = $('#contoCorrente').val();
			var tipoPagamento = new Object();
			tipoPagamento.id = $('#tipoPagamento option:selected').val();
			cliente.tipoPagamento = tipoPagamento;
			if($('#agente option:selected').val() && $('#agente option:selected').val() != -1){
                var agente = new Object();
                agente.id = $('#agente option:selected').val();
                cliente.agente = agente;
            }
			if($('#listinoApplicato option:selected').val() && $('#listinoApplicato option:selected').val() != -1){
				var listino = new Object();
				listino.id = $('#listinoApplicato option:selected').val();
				cliente.listino = listino;
			}
			cliente.estrazioneConad = $('#estrazioneConad').val();
			cliente.modalitaInvioFatture = $('#modalitaInvioFatture option:selected').val();
			if($('#bloccaDdt').prop('checked') === true){
				cliente.bloccaDdt = true;
			}else{
				cliente.bloccaDdt = false;
			}
			if($('#nascondiPrezzi').prop('checked') === true){
				cliente.nascondiPrezzi = true;
			}else{
				cliente.nascondiPrezzi = false;
			}
			if($('#raggruppaRiba').prop('checked') === true){
				cliente.raggruppaRiba = true;
			}else{
				cliente.raggruppaRiba = false;
			}
			cliente.nomeGruppoRiba = $('#nomeGruppoRiba').val();
			cliente.codiceUnivocoSdi = $('#codiceUnivocoSdi').val();
			cliente.note = $('#note').val();
			cliente.noteDocumenti = $('#noteDocumenti').val();

			var articoli = $('#articolo').val();
			if(articoli != null && articoli.length != 0){
				var clienteArticoli = [];
				$.each(articoli, function(i, item){
					var clienteArticolo = {};
					var clienteArticoloId = new Object();
					clienteArticoloId.articoloId = item;
					clienteArticolo.id = clienteArticoloId;

					clienteArticoli.push(clienteArticolo);
				})
				cliente.clienteArticoli = clienteArticoli;
			}

			var clienteJson = JSON.stringify(cliente);

			var alertContent = '<div id="alertClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "clienti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: clienteJson,
				success: function(result) {
					$('#alertCliente').empty().append(alertContent.replace('@@alertText@@','Cliente creato con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
						window.location.href = "clienti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertCliente').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del cliente').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.getProvince = function(){

	//return $.Deferred(function() {
		return $.ajax({
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
	//});

}

$.fn.getBanche = function(){

	//return $.Deferred(function() {
		return $.ajax({
			url: baseUrl + "banche",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						$('#banca').append('<option value="'+item.id+'">'+item.nome+' '+item.abi+'/'+item.cab+'</option>');
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.getAgenti = function(){

	//return $.Deferred(function() {
		return $.ajax({
			url: baseUrl + "agenti",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						$('#agente').append('<option value="'+item.id+'">'+item.nome+'</option>');
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.getTipiPagamento = function(){

	//return $.Deferred(function() {
		return $.ajax({
			url: baseUrl + "tipi-pagamento",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						$('#tipoPagamento').append('<option value="'+item.id+'">'+item.descrizione+'</option>');
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.getListini = function(newListino){

	//return $.Deferred(function() {
		return $.ajax({
			url: baseUrl + "listini",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var option = '<option value="'+item.id+'" data-tipologia="'+item.tipologia+'" ';
						if(newListino){
							if(item.tipologia ==  'BASE'){
								option += 'selected';
							}
						}
						option += '>'+item.nome+'</option>';
						$('#listinoApplicato').append(option);
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.getArticoli = function(){

	//return $.Deferred(function() {
		return $.ajax({
			url: baseUrl + "articoli?attivo=true",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						$('#articolo').append('<option value="'+item.id+'">'+item.descrizione+'</option>');
						$('#articolo').selectpicker('refresh');
					});
				}
				console.log("GET_ARTICOLI");

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.extractIdClienteFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idCliente') {
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

$.fn.getCliente = function(idCliente){

	var alertContent = '<div id="alertClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del cliente.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "clienti/" + idCliente,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdCliente').attr('value', result.id);
			$('#codice').attr('value', result.codice);
            $('#ragioneSociale').attr('value', result.ragioneSociale);
            $('#ragioneSociale2').attr('value', result.ragioneSociale2);
			if(result.dittaIndividuale === true){
				$('#dittaIndividuale').prop('checked', true);
			  	$('#nome').attr('disabled', 'false');
			  	$('#cognome').attr('disabled', 'false');
			}
			$('#nome').attr('value', result.nome);
			$('#cognome').attr('value', result.cognome);
            $('#indirizzo').attr('value', result.indirizzo);
            $('#citta').attr('value', result.citta);
            $('#provincia option[value="' + result.provincia +'"]').attr('selected', true);
            $('#cap').attr('value', result.cap);
            $('#partitaIva').attr('value', result.partitaIva);
            $('#codiceFiscale').attr('value', result.codiceFiscale);
			$('#email').attr('value', result.email);
			$('#emailPec').attr('value', result.emailPec);
			$('#telefono').attr('value', result.telefono);
			if(result.banca != null && result.banca != undefined){
				  $('#banca option[value="' + result.banca.id +'"]').attr('selected', true);
			}
			$('#contoCorrente').attr('value', result.contoCorrente);
			if(result.tipoPagamento != null && result.tipoPagamento != undefined){
				$('#tipoPagamento option[value="' + result.tipoPagamento.id +'"]').attr('selected', true);
			}
			if(result.agente != null && result.agente != undefined){
				$('#agente option[value="' + result.agente.id +'"]').attr('selected', true);
			}
			if(result.listino != null && result.listino != undefined){
				$('#listinoApplicato option[value="' + result.listino.id +'"]').attr('selected', true);
			}
			$('#estrazioneConad').attr('value', result.estrazioneConad);
			$('#modalitaInvioFatture option[value="' + result.modalitaInvioFatture +'"]').attr('selected', true);
			if(result.bloccaDdt === true){
				$('#bloccaDdt').prop('checked', true);
			}
			if(result.nascondiPrezzi === true){
				$('#nascondiPrezzi').prop('checked', true);
			}
			if(result.raggruppaRiba === true){
				$('#raggruppaRiba').prop('checked', true);
				$('#nomeGruppoRiba').attr('disabled', false);
			}
			$('#nomeGruppoRiba').attr('value', result.nomeGruppoRiba);
			$('#codiceUnivocoSdi').attr('value', result.codiceUnivocoSdi);
			$('#note').val(result.note);
			$('#noteDocumenti').val(result.noteDocumenti);

			console.log("GET_CLIENTE")

			if(result.clienteArticoli != null && result.clienteArticoli != undefined && result.clienteArticoli.length != 0){
				$.each(result.clienteArticoli, function(i, item){
					var id = item.id;
					if(id != null && id != undefined){
						var idArticolo = id.articoloId;
						$('#articolo option[value="' + idArticolo +'"]').attr('selected', true);
					}
				});
				$('#articolo').selectpicker('refresh');
			}

			if(result.privato === true){
				$('#privato').prop('checked', true);
				$('#ragioneSociale').attr('disabled', true);
				$('#ragioneSociale2').attr('disabled', true);
				$('#dittaIndividuale').prop('checked', false).attr('disabled', true);
				$('#nome').attr('disabled', false);
				$('#cognome').attr('disabled', false);
				$('#indirizzo').attr('disabled', false);
				$('#citta').attr('disabled', false);
				$('#provincia').attr('disabled', false);
				$('#cap').attr('disabled', false);
				$('#partitaIva').attr('disabled', true);
				$('#codiceFiscale').attr('disabled', false);
				$('#listinoApplicato').attr('disabled', false);
				$('#email').attr('disabled', false);
				$('#emailPec').attr('disabled', true);
				$('#telefono').attr('disabled', false);
				$('#banca').attr('disabled', false);
				$('#contoCorrente').attr('disabled', false);
				$('#tipoPagamento').attr('disabled', false);
				$('#agente').attr('disabled', true);
				$('#estrazioneConad').attr('disabled', true);
				$('#bloccaDdt').prop('checked', false).attr('disabled', false);
				$('#nascondiPrezzi').prop('checked', false).attr('disabled', false);
				$('#raggruppaRiba').prop('checked', false).attr('disabled', true);
				$('#nomeGruppoRiba').attr('disabled', true);
				$('#codiceUnivocoSdi').attr('disabled', false);
				$('#note').attr('disabled', false);
				$('#noteDocumenti').attr('disabled', false);
			}

          } else{
            $('#alertCliente').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertCliente').empty().append(alertContent);
            $('#updateClienteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.preloadSearchFields = function(){
	$.ajax({
		url: baseUrl + "listini",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchListino').append('<option value="'+item.id+'" >'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}