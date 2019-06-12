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
	result = $('div.list-item').sort(function(a,b) {		
		if ($(a).data('family') == $(b).data('family')) {
			if ($(a).data('stage') == $(b).data('stage')) {
				return $(a).data('dex') >= $(b).data('dex');
			} else {
				return $(a).data('stage') >= $(b).data('stage');
			}
		} else {
			return $(a).data('family') >= $(b).data('family');
		}
	})

	$("#pokemon-list").html(result);
	$(".gen-header").removeClass("hide");
}

function sortDex() {
	result = $('div.list-item').sort(function(a,b) {
		return $(a).data('dex') >= $(b).data('dex');
	});

	$("#pokemon-list").html(result);
	$(".gen-header").removeClass("hide");
}

function sortAZ() {
	result = $('div.list-item').sort(function(a,b) {
		return $(a).find("> .pokemon-label").text() >= $(b).find("> .pokemon-label").text();
	});
	

	$("#pokemon-list").html(result);
	$(".gen-header").addClass("hide");
	
}

function sortZA() {
	result = $('div.list-item').sort(function(a,b) {
		return $(a).find("> .pokemon-label").text() <= $(b).find("> .pokemon-label").text();
	});
	

	$("#pokemon-list").html(result);
	$(".gen-header").addClass("hide");
	
}

function selectAll() {
	$(".pokemon").addClass("select")
	getResult();
}
function selectNone() {
	$(".pokemon").removeClass("select")
	getResult();
}
function selectStageOne() {
	$(".pokemon").each(function (){
		if ($(this).data("stage") == 1) {
			$(this).addClass("select")
		}
	});
	getResult();
	
}
function selectStageTwo() {
	$(".pokemon").each(function (){
		if ($(this).data("stage") == 2) {
			$(this).addClass("select")
		}
	});
	getResult();
	
}
function selectStageThree() {
	$(".pokemon").each(function (){
		if ($(this).data("stage") == 3) {
			$(this).addClass("select")
		}
	});
	getResult();
	
}
function selectBaby() {
	$(".baby").removeClass("select")
	getResult();
}
function selectEvolve() {
	$(".can-evolve").removeClass("select")
	getResult();
}

$( document ).ready(function(){
	sortDex();

});
