//botões da navbar
var btnHome = document.getElementById("btnHome");
var btnSair = document.getElementById("btnSair");

//Evento de sair 
btnSair.addEventListener("click", function(){
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    window.location = "login.html";
});

//botão para criar board
var btnCriar = document.getElementById("btnCriar");

//botões de cores dos boards
var registroBoard = document.getElementById("boardRegister")
var corBoard = document.getElementsByClassName("btn-color");
var corButton = document.getElementById("colorButton");


for(let button of corBoard){
    let color = getComputedStyle(button).getPropertyValue("background-color");
    
    button.addEventListener("click", function(){
        registroBoard.style.backgroundColor = color;
        colorButton = corButton.value;
        //console.log(color);
    });
}
var tabelaBoard = document.getElementById("listaBoard");

function novoBoard(board){
    //let color =  registroBoard.style.backgroundColor;
    //let lista = document.createElement("td");
    let boards = document.createElement("button");
    //lista.setAttribute("id", board.id);
    boards.setAttribute("class", "btn btn-b col-3 m-2");
    boards.style.backgroundColor = board.color;
    let tituloBoard = document.createTextNode(board.name);
    boards.appendChild(tituloBoard);
    //lista.appendChild(boards);

    tabelaBoard.insertAdjacentElement("afterbegin", boards);
    boards.addEventListener("click", function(){
        var BoardClicked = {
            "id": board.id,
            "name": board.name,
            "color": board.color
        };
        sessionStorage.setItem("BoardClicked", JSON.stringify(BoardClicked));
        window.location = "board.html";
    });
}


//form para criar novo board
var formBoard = document.getElementById("formBoard");
var nomeBoard = document.getElementById("nomeBoard");
var divFormBoard = document.getElementById("divFormBoard");

//função do form para criar novo board
formBoard.addEventListener("submit", function(e){
    e.preventDefault();
    cor = getComputedStyle(registroBoard);
    token = JSON.parse(sessionStorage.getItem("token"));
    var board = {
        "name": nomeBoard.value,
        "color": cor.backgroundColor,
        "token": token
    }
    
    var url =  "https://tads-trello.herokuapp.com/api/trello/boards/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            //console.log(obj);
            novoBoard(obj);
            //limpa o form
            formBoard.reset();
        }
        else if (this.readyState == 4 && this.status == 400){
            alert("Erro ao criar novo quadro");
        }
    }
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(board));
    console.log(board);
});


//função para pegar os boards do usuário
function getBoards(){
    token = JSON.parse(sessionStorage.getItem("token"));
    //console.log(token);
    var url =  "https://tads-trello.herokuapp.com/api/trello/boards/"+token;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let boardsList = JSON.parse(this.responseText);
            //console.log(boardsList);
            for (let i = 0; i < boardsList.length; i++) {
                novoBoard(boardsList[i]);
            }

        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro ao listar boards");
        }
    }
    
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(url);
}