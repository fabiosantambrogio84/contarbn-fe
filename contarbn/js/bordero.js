var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$(document).on('click','#resetBorderoButton', function(){
		$('#searchBorderoForm :input').val(null);
		$('#searchBorderoForm select option[value=""]').attr('selected', true);

		$('#borderoTable').DataTable().destroy();
	});

});

$.fn.preloadSearchFields = function(){
	return $.ajax({
		url: baseUrl + "autisti?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){

				$.each(result, function(i, item){
					$('#autista').append('<option value="'+item.id+'" data-tipo="autista">'+item.cognome + ' ' + item.nome+'</option>');
				});

				$.ajax({
					url: baseUrl + "trasportatori",
					type: 'GET',
					async: false,
					dataType: 'json',
					success: function(result2) {
						if(result2 != null && result2 !== ''){
							$('#autista').append('<option disabled>_________</option>');
							$.each(result, function(i, item){
								$('#autista').append('<option value="'+item.id+'" data-tipo="trasportatore">'+item.cognome + ' ' + item.nome+'</option>');
							});
						}
					},
					error: function(jqXHR) {
						console.log('Response text: ' + jqXHR.responseText);
					}
				});
			}
		},
		error: function(jqXHR) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
