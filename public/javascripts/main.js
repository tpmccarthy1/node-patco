/**
* AJAX Calls
**/

function ajaxBtn(){
	var btn = document.querySelector('#submit-btn');
	btn.addEventListener('click', submit);
}

function submit(){
	var url = '/result';

	var station = document.querySelector('#station').value;
	var direction = document.querySelector('#direction').value;

	var data = url + '?station=' + station + '&direction=' + direction;

	//Create a new AJAX request object
	var request = new XMLHttpRequest();
	//Open conection to server
	request.open('GET', data);
	//Run our handleResponse function when the server responds
	request.addEventListener('readystatechange', handleResponse);
	//Actually send the request
	request.send();
}

function handleResponse(){
	console.log(this);
	var request = this;

	//Exit function unless server responded
	if(request.readyState != 4){
		return;
	}

	//If there wasn't an error, round showReponse function
	if(request.status == 200){
		var ajaxResponse = JSON.parse(request.responseText);
		showResponse(ajaxResponse);
	}
}

function showResponse(ajaxResponse){
	var responseContainer = document.querySelector('#result');
	responseContainer.innerHTML = "<p>The next train departing from " + ajaxResponse.stopName + " is at " + ajaxResponse.result[0] + ".</p>";
  //show response container
  responseContainer.setAttribute("style", "display: flex;");
}


ajaxBtn();


//Navbar stuff

let mainNav=document.getElementById('main-nav');
let navbarToggle=document.getElementById('navbar-toggle');

navbarToggle.addEventListener('click',function(){

    if(this.classList.contains('active')){
        mainNav.style.display="none";
        this.classList.remove('active');
    }
    else{
        mainNav.style.display="flex";
        this.classList.add('active');

    }
});


//Scroll to 


$(document).ready(function(){

//Init nice select
$('select').niceSelect();

// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
  	console.log("working");
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
});