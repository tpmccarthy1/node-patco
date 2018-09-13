
//Self invoking function

(function () { 

//Submit form function
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

//Handle AJAX response function
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

//Container variables
var responseContainer = document.querySelector('#result');
var optionsContainer = document.querySelector('#input');

//Display AJAX response
function showResponse(ajaxResponse){
  responseContainer.innerHTML = "<p>The next train departing from " + ajaxResponse.stopName + " is at " + ajaxResponse.result[0] + 
  ". The following train is departing at " + ajaxResponse.result[1] + ".</p> <span class='btn'><button id='back-btn' class='btn'><span>Go Back</span></button></span>";
  //show response container
  optionsContainer.style.display="none";
  optionsContainer.classList.remove('show');
  responseContainer.classList.add('show');
}

//Event listener for app
var app = document.getElementById("app");
app.addEventListener("click", function(e){


console.log(e.target.id);
//AJAX call button 
  if(e.target.id == "submit-btn"){
      //submit AJAX call
      submit();
  }

  if(e.target.id == "back-btn"){
      //Go back to form
        responseContainer.style.display="none";
        responseContainer.classList.remove('show');
        optionsContainer.classList.add('show');
  }

});

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

})();



