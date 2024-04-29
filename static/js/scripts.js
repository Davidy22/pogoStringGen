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
};
	
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
};

function sortFamily() {
	result = $('div.list-item').sort(function(a,b) {
		if ($(a).data('family') == $(b).data('family')) {
			if ($(a).data('stage') == $(b).data('stage')) {
				var pick = $(a).data('dex') >= $(b).data('dex');
			} else {
				var pick = $(a).data('stage') >= $(b).data('stage');
			}
		} else {
			var pick = $(a).data('family') >= $(b).data('family');
		}
		if (pick) {
			return 1;
		} else {
			return -1;
		}
	})

	$("#pokemon-list").html(result);
	$(".gen-header").show();
	$("#gen-nav").show();
};

function sortDex() {
	result = $('div.list-item').sort(function(a,b) {
		var pick = $(a).data('dex') >= $(b).data('dex');
		
		if (pick) {
			return 1;
		} else {
			return -1;
		}
	});

	$("#pokemon-list").html(result);
	$(".gen-header").show();
	$("#gen-nav").show();
};

function sortAZ() {
	result = $('div.list-item').sort(function(a,b) {
		var pick = $(a).find("> .pokemon-label").text() >= $(b).find("> .pokemon-label").text();
		
		
		if (pick) {
			return 1;
		} else {
			return -1;
		}
	});
	
	$("#pokemon-list").html(result);
	$(".gen-header").hide();
	$("#gen-nav").hide();
};

function sortZA() {
	result = $('div.list-item').sort(function(a,b) {
		return $(a).find("> .pokemon-label").text() <= $(b).find("> .pokemon-label").text();
	});
	

	$("#pokemon-list").html(result);
	$(".gen-header").hide();
	$("#gen-nav").hide();
};

function selectPokemon(criteria) {
	$(criteria).addClass("select")
	getResult();
};

function deselectPokemon(criteria) {
	$(criteria).removeClass("select")
	getResult();
};


function selectSet(list) {
	list.forEach(function(item,index,array) {
		$("#" + item).addClass("select")
	});
	getResult();
};

function deselectSet(list) {
	list.forEach(function(item,index,array) {
		$("#" + item).removeClass("select")
	});
	getResult();
};

function selectStage(stage) {
	$(".pokemon").each(function (){
		if ($(this).data("stage") == stage) {
			$(this).addClass("select")
		}
	});
	getResult();
};

function deselectStage(stage) {
	$(".pokemon").each(function (){
		if ($(this).data("stage") == stage) {
			$(this).removeClass("select")
		}
	});
	getResult();
};

function selectRange(lower, upper) {
	$(".pokemon").each(function (){
		if ($(this).data("dex") > lower) {
			if ($(this).data("dex") < upper) {
				$(this).addClass("select")
			}
		}
	});
	getResult();
};

function deselectRange(lower, upper) {
	$(".pokemon").each(function (){
		if ($(this).data("dex") > lower) {
			if ($(this).data("dex") < upper) {
				$(this).removeClass("select")
			}
		}
	});
	getResult();
};

function showHeaders(list) {
	temp = []
	$(".gen-header").each(function (){
		$(this).hide();
		temp.push($(this).data("dex"));
	});
	i = 0
	max = temp.length
	list.sort()
	list.forEach(function(item,index,array) {
		if (item > temp[i]) {
			while (item > temp[i+1]) {
				i = i + 1;
				if (i == max) {
					break;
				};
			};
			$("#Gen" + (i + 1)).show()
		};

	});
};

function showInGame() {
	$(".pokemon").each(function (){
		if ($(this).hasClass("not-in-game")) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
	getResult();
};

function showAll() {
	$(".pokemon").each(function (){
		$(this).show();
	});
	getResult();
};

function showSelected() {
	$(".pokemon").each(function (){
		if ($(this).hasClass("select")) {
			$(this).show();
		} else {
			$(this).hide();
		}
	});
	getResult();
};

function showUnselected() {
	$(".pokemon").each(function (){
		if ($(this).hasClass("select")) {
			$(this).hide();
		} else {
			if (!$(this).hasClass("not-in-game")){
				$(this).show();
			};
		}
	});
	getResult();
};


$( document ).ready(function(){
	sortDex();

});

function loadProcess(){
	var coll = document.getElementsByClassName("collapsible");
	var i;

	for (i = 0; i < coll.length; i++) {
	  coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight){
		  content.style.maxHeight = null;
		} else {
		  content.style.maxHeight = content.scrollHeight + "px";
		}
	  });
	}
}
