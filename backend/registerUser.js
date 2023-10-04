//registerUser.js: This file is used to register a new user to the system.
//It is called from the registerUser.html file.

//This function is called when the user clicks the register button.

function registerUser() {
    //Get the username and password from the form.
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    //Create a new XMLHttpRequest object.
    var xhttp = new XMLHttpRequest();
    //Set the callback function.
    xhttp.onreadystatechange = function() {
        //If the request is done and the response is ready.
        if (this.readyState == 4 && this.status == 200) {
            //Get the response text.
            var response = this.responseText;
            //If the response is 1.
            if (response == 1) {
                //Show the success message.
                document.getElementById("success").style.display = "block";
                //Hide the error message.
                document.getElementById("error").style.display = "none";
            }
            //If the response is 0.
            else if (response == 0) {
                //Show the error message.
                document.getElementById("error").style.display = "block";
                //Hide the success message.
                document.getElementById("success").style.display = "none";
            }
        }
    };
    //Open the request.
    xhttp.open("POST", "registerUser.php", true);
    //Set the request header.
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //Send the request.
    xhttp.send("username=" + username + "&password=" + password);
}