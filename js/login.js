var formLogin = document.getElementById("login");

formLogin.addEventListener("submit", function(e){
    e.preventDefault();

    var user = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    }

    var url = " https://tads-trello.herokuapp.com/api/trello/login";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            sessionStorage.setItem("token", JSON.stringify(obj.token));
            window.location = "main.html";
        }
        else if (this.readyState == 4 && this.status == 400){
            alert("Usuário ou senha incorretos");
            formLogin.reset();
            usernameLogin.focus();
        }
    }

    //console.log(JSON.stringify(user));

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

});