const tagMap = {};
var ids = []

function importString() {
    var toSelect = parse($("#importBox").val().trim(), tagMap);
    $(".pokemon").removeClass("select");

    for (i=0; i < toSelect.length; i++) {
        $( "#" + toSelect[i] ).addClass("select");
    }
    getResult();
}


function addString() {
	var toSelect = parse($("#importBox").val());

	for (i=0; i < toSelect.length; i++) {
		$( "#" + toSelect[i] ).addClass("select")
	}
	getResult();
};


function subString() {
	var toSelect = parse($("#importBox").val());

	for (i=0; i < toSelect.length; i++) {
		$( "#" + toSelect[i] ).removeClass("select")
	}
	
	getResult();
};


function invertString() {
	$(".pokemon").toggleClass("select")
	getResult();
};


function copy() {
	var copyText = document.getElementById("result");
		copyText.select();
		document.execCommand("Copy");
};
	
function select(elem) {
	$(elem).toggleClass("select")
	getResult();
};

function getResult() {
    const selected = $(".select");
    console.log('Selected elements:', selected.length);
    
    // Group by dex
    const byDex = {};
    selected.each(function() {
        const id = this.id;
        const dex = $(this).data('dex');
        console.log(`Selected: id=${id}, dex=${dex}`);
        
        if (!byDex[dex]) {
            byDex[dex] = {
                selectedIds: [],
                selectedForms: []
            };
        }
        byDex[dex].selectedIds.push(id);
        byDex[dex].selectedForms.push({
            id: id,
            tags: ($(this).attr('data-tags') || '').split(/\s+/).filter(t => t)
        });
    });
    
    // Find all forms for relevant dex numbers
    $('.pokemon').each(function() {
        const dex = $(this).data('dex');
        if (byDex[dex]) {
            if (!byDex[dex].allForms) {
                byDex[dex].allForms = [];
            }
            byDex[dex].allForms.push({
                id: this.id,
                tags: ($(this).attr('data-tags') || '').split(/\s+/).filter(t => t)
            });
        }
    });
    
    console.log('Grouped by dex:', byDex);
    
    // Build result
    const baseNumbers = [];
    const formFilters = [];
    
    for (const dex in byDex) {
        const group = byDex[dex];
        const allFormIds = new Set(group.allForms.map(f => f.id));
        const selectedIds = new Set(group.selectedIds);
        
        const allSelected = allFormIds.size === selectedIds.size && 
                            [...allFormIds].every(id => selectedIds.has(id));
        
        console.log(`Dex ${dex}: allForms=${allFormIds.size}, selected=${selectedIds.size}, allSelected=${allSelected}`);
        
        baseNumbers.push(parseInt(dex));
        
        if (!allSelected) {
            const unselectedForms = group.allForms.filter(f => !selectedIds.has(f.id));
            const filterTags = [];
            
            for (const selectedForm of group.selectedForms) {
                const uniqueTag = selectedForm.tags.find(tag => 
                    !unselectedForms.some(f => f.tags.includes(tag))
                );
                
                if (uniqueTag) {
                    filterTags.push(uniqueTag);
                } else {
                    const suffix = selectedForm.id.replace(/^\d+/, '');
                    if (suffix) filterTags.push(suffix);
                }
            }
            
            if (filterTags.length > 0) {
                formFilters.push(`&!${dex},${filterTags.join(',')}`);
            }
        }
    }
    
    let result = condense(baseNumbers);
    if (formFilters.length > 0) {
        result += formFilters.join('');
    }
    
    console.log('Final result:', result);
    $("#result").val(result || "");
}

function hideHeaders() {
	$(".gen-header").hide();
	$("#gen-nav").hide();
};

function showHeaders() {
	$(".gen-header").show();
	$("#gen-nav").show();
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
	showHeaders();
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
	showHeaders();
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
	hideHeaders();
};

function sortZA() {
	result = $('div.list-item').sort(function(a,b) {
		return $(a).find("> .pokemon-label").text() <= $(b).find("> .pokemon-label").text();
	});
	

	$("#pokemon-list").html(result);
	hideHeaders();
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

function selectNew(lower, upper) {
	var arrayOfIds = $.map($(".select"), function(n, i){
		return n.id;
	});
	
	$(".pokemon").each(function (){
		if ($(this).data("dex") > Math.max(...arrayOfIds)) {
			$(this).addClass("select")
		}
	});
	getResult();
};

function showInGame() {
	showHeaders();
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
	showHeaders();
	$(".pokemon").each(function (){
		$(this).show();
	});
	getResult();
};

function showSelected() {
	hideHeaders();
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
	hideHeaders();
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

function oauthSignIn() {
	// Google's OAuth 2.0 endpoint for requesting an access token
	var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

	// Create <form> element to submit parameters to OAuth 2.0 endpoint.
	var form = document.createElement('form');
	form.setAttribute('method', 'GET'); // Send as a GET request.
	form.setAttribute('action', oauth2Endpoint);

	// Parameters to pass to OAuth 2.0 endpoint.
	var params = {'client_id': '104518098376-bdl3un0uqe5fg2b629fvpsb13ipo9edg.apps.googleusercontent.com',
				'redirect_uri': "https://pogostring.com/login",
				//'redirect_uri': "https://tolocalhost.com/login",
				'response_type': 'code',
				'scope': 'openid',
				'state': $("#result").val()};

	// Add form parameters as hidden input values.
	for (var p in params) {
		var input = document.createElement('input');
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', p);
		input.setAttribute('value', params[p]);
		form.appendChild(input);
	}

	// Add form to page and submit it to open the OAuth 2.0 endpoint.
	document.body.appendChild(form);
	form.submit();
};

function saveData() {
	$.post($SCRIPT_ROOT + '/_save', {
		sid: localStorage["sid"],
		text: $("#pasteText").val(),
		select: $("#result").val()
	}, function(data) {
		$("#save-result").html(data.result)
		setTimeout(() => { $("#save-result").html("") }, 2000);
	});
};

function themeToggle() {
	document.body.classList.toggle('dark-mode');

	if (document.body.classList.contains('dark-mode')) {
		$("#theme-toggle").html('🌜');
	} else {
		$("#theme-toggle").html('🌞');
	}
};


$( document ).ready(function(){
	sortDex();

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
	
	if ($("#sid").html().length > 0) {
		localStorage["sid"] = $("#sid").html();
		window.history.replaceState({}, {}, "/");
	}
	if (localStorage["sid"]) {
		sid = localStorage["sid"];
	} else {
		sid = -1;
	}
	$.post($SCRIPT_ROOT + '/_check_login', {
		sid: sid
	}, function(data) {
        if (data.result) {
			$("#login-box").hide()
			$("#username-display").html(data.username);
			$("#profile-pic-display").attr("src", data.image);
			
			$("#importBox").val(data.select);
			$("#pasteText").val(data.text);
			importString();
			$("#pasteTextDiv").show();
        }
	});
	
    $('.pokemon').each(function() {
        const id = this.id;
        const tags = $(this).attr('data-tags');
        if (tags) {
            tags.split(/\s+/).forEach(tag => {
                if (tag) {
                    if (!tagMap[tag]) tagMap[tag] = new Set();
                    tagMap[tag].add(id);  // Use ID, not dex number
                }
            });
        }
    });
    // Convert Sets to arrays
    for (let tag in tagMap) {
        tagMap[tag] = Array.from(tagMap[tag]);
    }
	ids = $('.pokemon').map(function() {return this.id;}).get()
});
