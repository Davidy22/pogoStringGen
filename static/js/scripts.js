$(function() {
	$('div#import').bind('click', function() {
		$.post($SCRIPT_ROOT + '/_import_string', {
			pok: $("#importBox").val()
		}, function(data) {
			var toSelect = data.result;
			$(".pokemon").removeClass("select")


			for (i=0; i < toSelect.length; i++) {
				$( "#" + toSelect[i] ).addClass("select")
			}
			getResult();
			return false;
		});
	});
});


$(function() {
	$('div#add').bind('click', function() {
		$.post($SCRIPT_ROOT + '/_import_string', {
			pok: $("#importBox").val()
		}, function(data) {
			var toSelect = data.result;

			for (i=0; i < toSelect.length; i++) {
				$( "#" + toSelect[i] ).addClass("select")
			}
			getResult();
			return false;
		});

	});
});


$(function() {
	$('div#sub').bind('click', function() {
		$.post($SCRIPT_ROOT + '/_import_string', {
			pok: $("#importBox").val()
		}, function(data) {
			var toSelect = data.result;

			for (i=0; i < toSelect.length; i++) {
				$( "#" + toSelect[i] ).removeClass("select")
			}
			
			getResult();
			return false;
		});
									
	});
});


$(function() {
	$('div#invert').bind('click', function() {
		$(".pokemon").toggleClass("select")
		var arrayOfIds = $.map($(".select"), function(n, i){
			return n.id;
		});

		getResult();
	});
});


function copy () {
	var copyText = document.getElementById("result");
		copyText.select();
		document.execCommand("Copy");
	}
	
function select(elem) {
	$(elem).toggleClass("select")
	getResult();
};

function getResult() {
	var arrayOfIds = $.map($(".select"), function(n, i){
		return n.id;
	});

	$.post($SCRIPT_ROOT + '/_generate_string', {
		pok: arrayOfIds
	}, function(data) {
		$("#result").val(data.result);
	});
}

function sortFamily() {
	result = $('div.pokemon').sort(function(a,b) {
		var af = $(a).data('family')
		var bf = $(b).data('family')
		
		if (af == bf) {
			return $(a).data('stage') >= $(b).data('stage')
		} else {
			return af >= bf;
		}
	})

	$("#pokemon-list").html(result);
}

function sortDex() {
	result = $('div.pokemon').sort(function(a,b) {
		return parseInt($(a).attr("id")) > parseInt($(b).attr("id"))
	})

	$("#pokemon-list").html(result);
}
