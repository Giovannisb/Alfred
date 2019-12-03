var formCadastrar = document.getElementById("cadastrar");

var username = document.getElementById("username");
var password = document.getElementById("password");

formCadastrar.addEventListener("submit", function(e){
    e.preventDefault();

    var dados = {
        "name": document.getElementById("name").value,
        "username": username.value,
        "password": password.value
    }

    var url = "http://tads-trello.herokuapp.com/api/trello/users/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            alert("Cadastro realizado com sucesso");
            //console.log(obj);
            formCadastrar.reset();
            window.location.href = "login.html";
        }
        else if (this.readyState == 4 && this.status == 400) {
            alert("Usuário já existente, tente outro nome.");
            username.value = "";
            username.focus();
        }
       
    }

    //console.log(JSON.stringify(dados));

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dados));

});