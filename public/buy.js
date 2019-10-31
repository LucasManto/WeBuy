$(document).ready(() => {
    let app = firebase.app();
    let auth = firebase.auth();
    let firestore = firebase.firestore();

    auth.onAuthStateChanged(user => {
        if (!user) window.location.href = 'index.html'
    })

    $("#btn-logout").click(() => {
        auth.signOut()
    });

    let docSnapshot = null
    let docData = null

    async function loadUI() {
        var url_string = window.location.href.split("#!")[0]

        docSnapshot = await firestore.doc(`rooms/${url_string.split("name=")[1]}`).get()
        docData = docSnapshot.data()

        var storeName = docData.storeName
        $("#roomName").html(storeName)
    }

    loadUI()


    $("#btn-addProduct").click(() => {
        var quantidadeProduto = document.getElementById("quantidadeProduto").value;
        quantidadeProduto = parseInt(quantidadeProduto)
        if ((quantidadeProduto >= 5) || (quantidadeProduto <= 0)) {
            alert("Quantidade inválida!")
        } else {
            // TODO:
            //CADASTRAR O PRODUTO NO BANCO
            addLink(docSnapshot.id)
        }
    });

    $("#btn-listRooms").click(() => {
        window.location.href = 'rooms.html'
    });

    async function addLink(roomId) {
        const productLink = $('#urlProduto').val()

        let productLinks = docData.productLinks
        productLinks[auth.currentUser.uid].push(productLink)

        await firestore.doc(`rooms/${roomId}`).update({
            productLinks
        })

        alert('Você adicionou um produto à compra em grupo. Agora é só aguardar a entrega :)')
        window.location.href = 'rooms.html'
    }
});
