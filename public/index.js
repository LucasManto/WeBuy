$(document).ready(() => {
    let app = firebase.app();
    let auth = firebase.auth();
    let firestore = firebase.firestore();

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
        createUser();
    });

    $("#buttonLogIn").click(e => {
        e.preventDefault();

        const email = $('#inputEmailLogin').val();
        const password = $('#inputPasswordLogin').val();

        auth.signInWithEmailAndPassword(email, password);
    });

    async function createUser() {
        const email = $('#inputEmail').val();
        const password = $('#inputPassword').val();
        const name = $('#inputName').val();
        const address = $('#inputAddress').val();
        const phone = $('#inputPhone').val();

        authCredential = await auth.createUserWithEmailAndPassword(email, password);

        firestore.doc(`users/${authCredential.user.uid}`).set({
            'name': name,
            'address': address,
            'phone': phone
        });
    }

    auth.onAuthStateChanged(user => {
        // TODO: Redirect to rooms page
        // if (user) window.location.href = '';
    });
});