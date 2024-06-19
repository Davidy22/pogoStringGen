function createAccount() {
	$.post($SCRIPT_ROOT + '/_create_account', {
		uid: $("#uid").html(),
        username: $("#uname").val(),
        text: $("#state").html(),
        picture: $("#profile-pic").attr("src")
	}, function(data) {
        if (data.result) {
            localStorage["sid"] = data.sid;
            window.location.href = "/";
        } else {
            $("#status-message").html(data.message);
        }
	});
};

function updateURL() {
    $("#paste-url").html("http://pogostring.com/u/" + $("#uname").val());
};

$( document ).ready(function(){
    updateURL()
})
