$(document).ready(() => {
    let auth = firebase.auth()
    let firestore = firebase.firestore()

    auth.onAuthStateChanged(user => {
        if (!user) window.location.href = 'index.html'
    })

    $("#div-create-room").hide();
    $("#btn-createRoom").show();
    $("#btn-listRooms").hide();
    $("#div-list-room").show();

    $("#btn-createRoom").click(() => {
        $("#div-create-room").show();
        $("#btn-createRoom").hide();
        $("#btn-listRooms").show();
        $("#div-list-room").hide();
    });

    $("#btn-listRooms").click(() => {
        $("#div-create-room").hide();
        $("#btn-createRoom").show();
        $("#btn-listRooms").hide();
        $("#div-list-room").show();
    });

    $("#btn-signRoom").click(() => {
        createRoom()
    });

    $("#btn-logout").click(() => {
        auth.signOut()
    });

    //Load the slider elements
    window.onload = function () {
        var elems = document.querySelectorAll("input[name=maxPartSlider]");
        M.Range.init(elems);
    };

    async function createRoom() {
        // TODO:
        // - Change maxParticipants, checkoutTime and store name variables to get values from fields
        const maxParticipants = document.getElementById('maxPart').value
        const checkoutTime = $('#inputTime').val()
        const storeName = $('#inputRoomName').val()

        // TODO:
        // - Add the actual number of participants on the room, default 1 on creation
        try {
            await firestore.collection('rooms').doc().set({
                'maxParticipants': maxParticipants,
                'checkoutTime': checkoutTime,
                'storeName': storeName,
                'participants': [auth.currentUser.uid],
                'productLinks': {
                    [auth.currentUser.uid]: []
                },
                'deliveryPrice': 0,
                'expectedDeliveryTime': 0,
                'owner': auth.currentUser.uid,
                'createdAt': Date.now()
            });
            clearRoomsList()
            listGetRooms()
        } catch (error) {
            throw error
        }
    }

    async function getRooms() {
        const querySnapshot = await firestore.collection('rooms').get()
        return querySnapshot.docs
    }

    async function addParticipant(roomId) {
        // Send roomId from element
        const roomDocumentReference = firestore.doc(`rooms/${roomId}`)
        const roomDocumentSnapshot = await roomDocumentReference.get()
        roomData = await roomDocumentSnapshot.data()

        if (roomData.participants.includes(auth.currentUser.uid))
            return

        if (roomData.participants.length < roomData.maxParticipants) {
            roomData.productLinks[auth.currentUser.uid] = []

            await roomDocumentReference.update({
                'participants': firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
                productLinks: roomData.productLinks
            })

            await firestore.doc(`users/${auth.currentUser.uid}`).update({
                activeRooms: firebase.firestore.FieldValue.arrayUnion(roomId)
            })
        }
        else {
            throw 'Max number of participants reached'
        }
    }

    async function listGetRooms() {
        let roomsDocumentReference = await getRooms();
        roomsDocumentReference.forEach(docReference => {
            const roomId = docReference.id
            const firstPiece = "<div class=\"collection\" id=\"clt-rooms\"> <a href=\"#!\" id=\"storeRoom\" name=\""
            const secondPiece = "\" class=\"collection-item light-blue darken-4 white-text\" style=\"font-weight: bold;\">"
            const thirdPiece = "<i class=\"material-icons\" style=\"padding-left: 80%;\">group</i><b style=\"padding-left: 10px;\">"
            const forthPiece = "</b></a></div>"

            //Create the room name with all attributes needed
            var roomNameValue = roomId.concat("#", docReference.data().storeName, "#", docReference.data().maxParticipants, "#", docReference.data().participants.length)

            //var finalRoom = firstPiece.concat(docReference.data().storeName, secondPiece, "/ ", docReference.data().maxParticipants, thirdPiece)
            var finalRoom = firstPiece.concat(roomNameValue, secondPiece, docReference.data().storeName, thirdPiece, docReference.data().participants.length, " / ", docReference.data().maxParticipants, forthPiece)
            $("#div-salas2").append(finalRoom)

            // console.log(finalRoom)
            //console.log(roomName.concat(actualId.toString()))
        })
    }

    function clearRoomsList() {
        document.getElementById('clt-rooms').innerHTML = ''
    }

    $(document).on("click", "#storeRoom", async function () {
        //console.log(this.name.split("#"));
        var roomAttributes = this.name.split("#");
        if (parseInt(roomAttributes[2]) <= parseInt(roomAttributes[3])) {
            alert("Perdão, esta sala já está lotada!")
        } else {
            //Creating the custom url for different rooms
            //console.log(window.location.pathname)
            await addParticipant(roomAttributes[0])

            var newUrlPath = window.location.pathname
            newUrlPath = newUrlPath.split("rooms.html")[0]
            newUrlPath = newUrlPath.concat("buy.html?name=", roomAttributes[0])
            window.location.replace(newUrlPath)
        }
    });

    listGetRooms();

});