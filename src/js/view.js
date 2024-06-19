$( document ).ready(function(){
	var coll = document.getElementsByClassName("collapsible");
	var i;

	for (i = 0; i < coll.length; i++) {
	  coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight){
		  content.style.maxHeight = null;
		  this.innerHTML = "Show"
		} else {
		  content.style.maxHeight = content.scrollHeight + "px";
		  this.innerHTML = "Hide"
		}
	  });
	  content = coll[i].nextElementSibling
	  content.style.maxHeight = content.scrollHeight + 20 + "px";
	}
}
)
