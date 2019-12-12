//botões da navbar
var btnHome = document.getElementById("btnHome");
var btnSair = document.getElementById("btnSair");

//Evento de sair 
btnSair.addEventListener("click", function () {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    window.location = "login.html";
    sessionStorage.clear();
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

//função para alterar cor dos boards
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

//formulário para criar listas
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

//função para retornar as listas
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

//função para criar listas
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

//função para excluir board
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

//função para setar o id da lista no sessionStorage
var listaEditada;

function setEditId() {
    listaEditada = event.target.getAttribute("idList");
    sessionStorage.setItem("idDaLista", listaEditada);
    //console.log(target);
}

//função para criar o html das listas
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
    divBody.setAttribute("id", "bodyList"+lista.id);
    divBody.setAttribute("idLista", lista.id);

    var divBodyRow = document.createElement("div");
    divBodyRow.classList = "row divCardBodyRow";

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

    var divListCardBody = document.getElementsByClassName("divCardBody");
    getCards(lista.id, divListCardBody[0]);

}

//editar nome da lista
function renomearList() {
    var div1 = document.getElementById("listaCriada");
    //var listaId = div1.getAttribute("idList");
    var inputRenameList = document.getElementById("inputRenameList");
    var newNameList = {
        "list_id": listaEditada,
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

//função para excluir uma lista
function deletaLista() {
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

//função para modificar o nome do board
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


//função para retornar os cards criados
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

//função para criar o card
var formCreateCard = document.getElementById("formCreateCard");
formCreateCard.addEventListener("submit", function (e) {
    e.preventDefault();
    var card = {
        name: document.getElementById("inputNameCard").value,
        data: document.getElementById("inputDateCard").value,
        token: token,
        list_id: sessionStorage.getItem("idDaLista")
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

//função para criar o html do card
function adicionarCard(card) {
    var divTitleCard = document.createElement("div");
    divTitleCard.classList = "col-sm-12";
    var h6 = document.createElement("h6");
    h6.innerText = card.name;
    var btnCard = document.createElement("button");
    btnCard.innerHTML = "Abrir";
    btnCard.setAttribute("class", "btn btn-success")
    btnCard.setAttribute("id", "idCard");
    btnCard.setAttribute("data-toggle", "modal");
    btnCard.setAttribute("data-target", "#modalEditCard");
    btnCard.setAttribute("idCard", card.id);
    btnCard.setAttribute("name", card.name);
    btnCard.setAttribute("data", card.data);
    btnCard.setAttribute("onclick", "setIdCard()");
    btnCard.setAttribute("onclick", "getComments()");

    divTitleCard.appendChild(h6);
    divTitleCard.appendChild(btnCard);

    var divCardRow = document.createElement("div");
    divCardRow.classList = "row";

    divCardRow.appendChild(divTitleCard);

    var divCardBody = document.createElement("div");
    divCardBody.classList = "card-body";
    divCardBody.setAttribute("id", "cardList");

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
    divListCardBody = document.getElementById("bodyList"+card.trelloListId);
   //console.log(card.trelloListId);
    divListCardBody.appendChild(divListCardRow);


}

//função que seta no sessionStorage o id, nome e data dos cards
function setIdCard(card) {
    cardEditada = event.target.getAttribute("idcard");
    sessionStorage.setItem("idDoCard", cardEditada);

    cardName = event.target.getAttribute("name");
    sessionStorage.setItem("nomeDoCard", cardName);

    cardDate = event.target.getAttribute("data");
    sessionStorage.setItem("data", cardDate);

    var nomeModal = document.getElementById("modalTitleEditCard");
    nomeModal.innerHTML = sessionStorage.getItem("nomeDoCard");

    var DateCard = document.getElementById("modalDateCard");
    DateCard.innerHTML = sessionStorage.getItem("data");

    //console.log(target);
}

//função para deletar o card
function deletaCard() {
    var dados = {
        card_id: sessionStorage.getItem("idDoCard"),
        token: token
    }

    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("Card Deletado Com sucesso");
            location.reload();
        }

        if (this.readyState == 4 && this.status == 400) {
            alert("Não foi possivel deletar o card");
        }
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/delete";
    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dados));
}

var btnAbrir = document.getElementById("idCard");
document.getElementById("formEditTitleCard").addEventListener("submit", function(e){           
    e.preventDefault();
    var dadosName = {
        token: token,
        card_id: sessionStorage.getItem("idDoCard"),
        name: document.getElementById("inputEditTitleCard").value
    }
    console.log(dadosName);

    //Alterar Name do Card
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            alert("Card Atualizado");
            location.reload();
        }

        if(this.readyState == 4 && this.status == 400){
            console.log(this.responseText);
            alert("Alterações não realizadas");
        }
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/rename";
    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dadosName));
});

document.getElementById("formEditDateCard").addEventListener("submit", function(e){
    e.preventDefault();
    var dadosData = {
        token: token,
        card_id: sessionStorage.getItem("idDoCard"),
        data: document.getElementById("inputEditDataCard").value
    }
    console.log(dadosData);

    //Alterar Data do Card
    var xhttpData = new XMLHttpRequest();
    xhttpData.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            alert("Card Atualizado");
            location.reload();
        }

        if(this.readyState == 4 && this.status == 400){
            console.log(this.responseText);
            alert("Alterações não realizadas");
        }
    }

    var urlEditData = "https://tads-trello.herokuapp.com/api/trello/cards/newdata";
    xhttpData.open("PATCH", urlEditData, true);
    xhttpData.setRequestHeader("Content-type", "application/json");
    xhttpData.send(JSON.stringify(dadosData));
});

//função para inserir comentarios
document.getElementById("formEditTextArea").addEventListener("submit", function(e){
    e.preventDefault();
    var dados = {
        card_id: sessionStorage.getItem("idDoCard"),
        comment: document.getElementById("inputTextAreaEditCard").value,
        token: token
    }

    console.log(dados);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            alert("Comentário Inserido");
            gerateListComments(dados.comment);
            //location.reload();
        }

        if(this.readyState == 4 && this.status == 400){
            console.log(this.responseText);
            alert("Alterações não realizadas");
        }
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/addcomment";
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dados));
});

//função que retorna os comentarios dos cards
let identificacao = sessionStorage.getItem("idDoCard");
function getComments(identificacao){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var listComments = JSON.parse(this.responseText);
            console.log(listComments);
            for(let i = 0; i<listComments.length;i++){
                gerateListComments(listComments[i]["comment"]);
            }

        } 
        
        else if ((this.responseText) == 4) {
            console.log(this.status);
        }
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/" + token + "/" + identificacao + "/comments";
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

//gera o html dos comentarios
function gerateListComments(comment){
    
    var li = document.createElement("li");
    li.innerText = comment;
    document.getElementById("listCommentCard").appendChild(li);
}