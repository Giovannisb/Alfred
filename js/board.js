//botões da navbar
var btnHome = document.getElementById("btnHome");
var btnSair = document.getElementById("btnSair");

//Evento de sair 
btnSair.addEventListener("click", function () {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    window.location = "login.html";
});

//evento home
btnHome.addEventListener("click", function (e) {
    e.preventDefault();
    window.location = "main.html";
});

var nomeBoard = document.getElementById("TituloBoard");
var maindiv = document.getElementById("mainDiv");

function board() {
    maindiv.style.backgroundColor = Board.color;
    nomeBoard.innerHTML = Board.name;
    getListas();
    
    //getCards();
}

var background = document.getElementById("mainDiv");
function alteraCor(btn) {

    cor = getComputedStyle(btn);
    if (cor.backgroundColor == Board.color) {
        return;
    }
    var newColor = {
        "board_id": Board.id,
        "color": cor.backgroundColor,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/boards/newcolor";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            Board.color = background.style.backgroundColor = cor.backgroundColor;
            sessionStorage.setItem("BoardClicked", JSON.stringify(Board));

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao Renomear Quadro");
        }
    }

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newColor));

}

var btnCreateNewList = document.getElementById("btnCreateNewList");

btnCreateNewList.addEventListener("click", function (e) {
    e.preventDefault();
    btnCreateNewList.style.display = "none";
    formCreateList.style.display = "block";
});

btnCancelCreateList.addEventListener("click", function (e) {
    e.preventDefault();
    btnCreateNewList.style.display = "block";
    formCreateList.style.display = "none";
});

var Listas
function getListas() {
    var url = "https://tads-trello.herokuapp.com/api/trello/lists/" + token + "/board/" + Board.id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            Listas = JSON.parse(this.responseText);
            console.log(Listas);
            for (let i = 0; i < Listas.length; i++) {
                createLista(Listas[i]);

            }

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao Buscar Listas");
        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

var formCreateList = document.getElementById("createListForm");
var token = JSON.parse(sessionStorage.getItem("token"));
var listName = document.getElementById("inputNewListName");
var idBoard = sessionStorage.getItem("BoardClicked.id");
var Board = JSON.parse(sessionStorage.getItem("BoardClicked"));

formCreateList.addEventListener("submit", function (e) {
    e.preventDefault();
    var lista = {
        name: listName.value,
        token: token,
        board_id: Board.id
    }
    console.log(lista);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            alert("List cadastrado com sucesso!");
            createLista(obj);
            sessionStorage.setItem("listasCriadas", JSON.stringify(lista));
            location.reload();
        }

        if (this.readyState == 4 && this.status == 400) {
            console.log(this.status, this.responseText);
            alert("List não cadastrado!");
        }
    };

    var url = "https://tads-trello.herokuapp.com/api/trello/lists/new";
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(lista));
})

function excluirBoard() {
    var lista_delete = {
        "board_id": Board.id,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/boards/delete"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log(lista_delete);
        if (this.readyState == 4 && this.status == 200) {
            alert("Board excluido!");
            window.location.href = "main.html";
        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro! Não foi possivel excluir esse board.");
        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(lista_delete));
}

var listaEditada;

function setEditId(){
    listaEditada = event.target.getAttribute("idList");
    sessionStorage.setItem("idDaLista", listaEditada);
    //console.log(target);
}

var listScreen = document.getElementById("mainDiv");
var apendar = document.getElementById("listCardDiv");
var boardGet = sessionStorage.getItem("BoardClicked");
function createLista(lista) {
    var h6 = document.createElement("h6");

    var divCard = document.createElement("div");
    divCard.classList = "card mb-2 mr-2";
    divCard.id = lista.id;
    divCard.setAttribute("name", lista.name);
    divCard.setAttribute("id", "listaCriada" + lista.id);
    divCard.setAttribute("idBoard", Board.id);
    //divCard.setAttribute("idList", lista.id);

    var firstChild = document.getElementById("listCardDiv").firstChild;

    // divCardList.appendChild(divCard);
    // listScreen.appendChild(divCardList);

    listCardDiv.insertBefore(divCard, firstChild);
    listScreen.appendChild(listCardDiv);

    //cria a div "Header"
    var divHeader = document.createElement("div");
    divHeader.classList = "card-header "
    divCard.appendChild(divHeader);

    //cria a div "Row"
    var divRow = document.createElement("div");
    divRow.classList = "row";
    divHeader.appendChild(divRow);

    //cria campo para exibir nome do board
    var divCol = document.createElement("div");
    divCol.classList = "col-6 justify-content-between";
    h6.innerText = lista.name;

    divCol.appendChild(h6);
    divRow.appendChild(divCol);

    // cria botão de editar
    var divButton = document.createElement("div");
    divButton.classList = "col-sm-3 text-right"
    var button = document.createElement("button");
    button.classList = "btn btn-sm btn-primary btnEdit";
    button.innerText = "Editar";
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#modalRenameList");
    button.setAttribute("idList", lista.id);
    button.setAttribute("onclick", "setEditId()");

    divButton.appendChild(button);
    divRow.appendChild(divButton);

//data-toggle="modal" data-target="#modalExcluiBoard"

    var divBtnDelete = document.createElement("div");
    divBtnDelete.classList = "col-sm-3 text-right"
    var btnDelete = document.createElement("button");
    btnDelete.classList = "btn btn-sm btn-danger btnDelete";
    btnDelete.setAttribute("data-toggle", "modal");
    btnDelete.setAttribute("data-target", "#modalExcluiLista");
    btnDelete.setAttribute("onclick", "setEditId()");
    btnDelete.innerText = "delete";
    btnDelete.setAttribute("idList", lista.id);

    divBtnDelete.appendChild(btnDelete);
    divRow.appendChild(divBtnDelete);


    // cria a div body
    var divBody = document.createElement("div");
    divBody.classList = "card-body divCardBody";
    divBody.setAttribute("id", "bodyList");

    var divBodyRow = document.createElement("div");
    divBodyRow.classList = "row divCardBodyRow"

    var divNewCardBtn = document.createElement("div");
    divNewCardBtn.classList = "col-12 my-2";

    var buttonLink = document.createElement("button");
    buttonLink.classList = "btn btn-md btn-link text-left btnNewCard";
    buttonLink.innerText = "Adicionar um cartão";
    buttonLink.setAttribute("idList", lista.id);
    buttonLink.setAttribute("onclick", "setEditId()");

    buttonLink.setAttribute("data-toggle", "modal");
    buttonLink.setAttribute("data-target", "#modalCreateCard");

    divNewCardBtn.appendChild(buttonLink);
    divBodyRow.appendChild(divNewCardBtn);
    divBody.appendChild(divBodyRow);
    divCard.appendChild(divBody);

    /** 
     * Esta variável retorna a div que será usada para adicionar os cards
     * da lista
     **/
    var divListCardBody = document.getElementsByClassName("divCardBody");

    /**
     * O numero 0 passado junto a "divListCardBody" como parâmetro serve
     * para "dizer" que essa váriável refere-se a a lista atual(Que esta sendo criada).
     */
    getCards(lista.id, divListCardBody[0]);

}

//editar nome da lista
function renomearList(){
    var div1 = document.getElementById("listaCriada");
    //var listaId = div1.getAttribute("idList");
    var inputRenameList = document.getElementById("inputRenameList");
    var newNameList = {
        "list_id":listaEditada,
        "name": inputRenameList.value,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/lists/rename";
    var xhttp = new XMLHttpRequest();
    console.log(newNameList);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("List renomeado com sucesso!");
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            Listas.name = obj.name;
            location.reload();
        }
        if (this.readyState == 4 && this.status == 400) {
            console.log(this.status, this.responseText);
            alert("List não cadastrado! Confira seus dados");
        }
    };

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newNameList));

}

//Permite Excluir uma lista

function deletaLista(){
    let listaDeletar = sessionStorage.getItem("idDaLista");
    //console.log(listaDeletar);
    var dados = {
        list_id: listaDeletar,
        token: token
    }
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("List deletado com sucesso");
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            location.reload()
            
        } else if ((this.responseText) == 4) {
            console.log(obj);
            alert("Não foi possivel deletar esta list");
            console.log(this.status);
        }
    }
    
    var url = "https://tads-trello.herokuapp.com/api/trello/lists/delete";
    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dados));
}

function changeNameBoard(Board) {
    var newName = document.getElementById("nomeNewBoard").value;
    var newName1 = {
        "board_id": Board.id,
        "name": newName,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/boards/rename";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("Tudo certo");
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            Board.name = obj.name;
            sessionStorage.setItem("BoardClicked", JSON.stringify(Board));
            location.reload();

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao Renomear Quadro");
        }
    }

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newName1));
}



function getCards(lista_id, element) {
    var url = "https://tads-trello.herokuapp.com/api/trello/cards/" + token + "/list/" + lista_id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var cards = JSON.parse(this.responseText);
            for (let i = 0; i < cards.length; i++) {
                adicionarCard(cards[i], element);
            }

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro Buscar Cartões");
        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

var formCreateCard = document.getElementById("formCreateCard");
let listaCard = sessionStorage.getItem("idDaLista");
formCreateCard.addEventListener("submit", function (e) {
    e.preventDefault();
    var card = {
        name: document.getElementById("inputNameCard").value,
        data: document.getElementById("inputDateCard").value,
        token: token,
        list_id: listaCard
    }

    console.log(card);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            alert("Card criado!");
            adicionarCard(obj);
            location.reload();
        }

        else if (this.readyState == 4 && this.status == 400) {
            console.log(this.status, this.responseText);
            alert("Card não criado");
        }
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/new";
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(card));
});

function adicionarCard(card){
    var divTitleCard = document.createElement("div");
    divTitleCard.classList = "col-sm-12";
    var h6 = document.createElement("h6");
    h6.innerText = card.name;

    divTitleCard.appendChild(h6);

    var divCardRow = document.createElement("div");
    divCardRow.classList = "row";
    
    divCardRow.appendChild(divTitleCard);

    var divCardBody = document.createElement("div");
    divCardBody.classList = "card-body";

    divCardBody.appendChild(divCardRow);

    var divListCard = document.createElement("div");
    divListCard.classList = "col-12 my-2 card cardCartoes";

    divListCard.appendChild(divCardBody);

    var divListCardRow = document.createElement("div");
    divListCardRow.classList = "row cardLista";
    divListCardRow.id = card.id;
    divListCardRow.setAttribute("name", card.name);
    divListCardRow.setAttribute("data", card.data);
    divListCardRow.setAttribute("id_list", sessionStorage.getItem("idDaLista"));

    divListCardRow.appendChild(divListCard);
    
    /**
     * Une a div dos cards com a div body da lista
     */
    divListCardBody = document.getElementById("bodyList");
    divListCardBody.appendChild(divListCardRow);


}