$(document).ready(() => {
    let app = firebase.app();
    let auth = firebase.auth();
    let firestore = firebase.firestore();

    $("#btn-logout").click(() => {
        // TODO:
        //Logout
    });

    //Get room name and use for header
    var url_string = window.location.href.split("#!")[0]
    var storeName = url_string.split("name=")[1];
    $("#roomName").html(storeName)

    $("#btn-addProduct").click(() => {
        var quantidadeProduto = document.getElementById("quantidadeProduto").value;
        quantidadeProduto = parseInt(quantidadeProduto)
        if((quantidadeProduto >= 5) || (quantidadeProduto <= 0)){
            alert("Quantidade inválida!")
        }else{
            // TODO:
            //CADASTRAR O PRODUTO NO BANCO
        }
    });

    $("#btn-listRooms").click(() => {
        var newUrlPath = window.location.pathname
        newUrlPath = newUrlPath.split("buy.html")[0]
        newUrlPath = newUrlPath.concat("rooms.html")            
        window.location.replace(newUrlPath)
    });
});
