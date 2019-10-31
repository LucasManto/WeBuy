$(document).ready(() => {
    let app = firebase.app();
    let auth = firebase.auth();
    let firestore = firebase.firestore();

    let creatingUser = false

    function redirectTo(url) {
        window.location.href = url
    }

    auth.onAuthStateChanged(user => {
        if (user && !creatingUser) {
            redirectTo('rooms.html')
        }
    })

    $("#div-registro").hide();
    $("#div-login").show();

    $("#btn-login").click(() => {
        $("#div-registro").hide();
        $("#div-login").show();
    });

    $("#btn-cadastro").click(() => {
        $("#div-registro").show();
        $("#div-login").hide();
    });

    $("#buttonSignIn").click(() => {
        e.preventDefault();
        try {
            createUser();
        } catch (error) {
            console.log(error)
        }
    });

    $("#buttonLogIn").click(async e => {
        e.preventDefault();

        const email = $('#inputEmailLogin').val();
        const password = $('#inputPasswordLogin').val();

        await auth.signInWithEmailAndPassword(email, password);
    });

    async function createUser() {
        const email = $('#inputEmail').val();
        const password = $('#inputPassword').val();
        const name = $('#inputName').val();
        const address = $('#inputAddress').val();
        const phone = $('#inputPhone').val();

        try {
            auth.createUserWithEmailAndPassword(email, password)
            await firestore.doc(`/users/${auth.currentUser.uid}`).set({
                name,
                address,
                phone,
                'activeRooms': [],
                'pastRooms': []
            })
            redirectTo('rooms.html')
        } catch (error) {
            throw error
        }
    }
});