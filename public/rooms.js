$(document).ready(() => {
    let auth = firebase.auth()
    let firestore = firebase.firestore()

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

    $("#btn-logout").click(() => {
        // TODO:
        //Logout
    });

    //Load the slider elements
    window.onload = function() {
        var elems  = document.querySelectorAll("input[name=maxPartSlider]");
        M.Range.init(elems);
    };

    function createRoom() {
        // TODO:
        // - Change maxParticipants, checkoutTime and store name variables to get values from fields
        const maxParticipants = 5;
        const checkoutTime = 3;
        const storeName = 'growth';

        // TODO:
        // - Add the actual number of participants on the room, default 1 on creation
        try {
            firestore.collection('rooms').doc().set({
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

        if (roomData.participants.length < roomData.maxParticipants) {
            roomDocumentReference.update({
                'participants': firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
                'productLinks': {
                    [auth.currentUser.uid]: []
                }
            })

            firestore.doc(`users/${auth.currentUser.uid}`).update({
                activeRooms: firebase.firestore.FieldValue.arrayUnion(roomId)
            })
        }
        else {
            throw 'Max number of participants reached'
        }
    }

    async function addLink(roomId) {
        // TODO:
        // - Check if link is from room store
        const productLink = 'https://growth.com.br'

        firestore.doc(`rooms/${roomId}`).update({
            'productLinks': {
                [auth.currentUser.uid]: firebase.firestore.FieldValue.arrayUnion(productLink)
            }
        })
    }

    // setInterval(() => {
    //     if (new Date() > new Date(2019, 9, 28, 23, 1))
    //         console.log('dsfkjndfkjnsd')
    // }, 60000);

    async function listGetRooms() {
        let roomsDocumentReference = await getRooms();
        const roomName = "roomId";
        var actualId = 0;
        roomsDocumentReference.forEach(docReference => {
            const firstPiece = "<div class=\"collection\" id=\"clt-rooms\"> <a href=\"#!\" id=\"storeRoom\" name=\""
            const secondPiece = "\" class=\"collection-item light-blue darken-4 white-text\" style=\"font-weight: bold;\">"
            const thirdPiece = "<i class=\"material-icons\" style=\"padding-left: 80%;\">group</i><b style=\"padding-left: 10px;\">"
            const forthPiece = "</b></a></div>"
            
            //Create the room name with all attributes needed
            var roomNameValue = roomName.concat(actualId.toString(), "#", docReference.data().storeName, "#", docReference.data().maxParticipants, "#",  docReference.data().actualParticipants)
            
            //var finalRoom = firstPiece.concat(docReference.data().storeName, secondPiece, "/ ", docReference.data().maxParticipants, thirdPiece)
            var finalRoom = firstPiece.concat(roomNameValue, secondPiece, docReference.data().storeName, thirdPiece, "/ ", docReference.data().maxParticipants, forthPiece)
            $("#div-salas2").append(finalRoom)
            actualId += 1

            // console.log(finalRoom)
            //console.log(roomName.concat(actualId.toString()))
        })
    }

    $(document).on("click","#storeRoom",function(){
        //console.log(this.name.split("#"));
        var roomAttributes = this.name.split("#");
        if(parseInt(roomAttributes[2]) <= parseInt(roomAttributes[3])){
            alert("Perdão, esta sala já está lotada!")
        }else{
            //Creating the custom url for different rooms
            //console.log(window.location.pathname)
            var newUrlPath = window.location.pathname
            newUrlPath = newUrlPath.split("rooms.html")[0]
            newUrlPath = newUrlPath.concat("buy.html?name=", roomAttributes[1])            
            window.location.replace(newUrlPath)
            // TODO:
            //Increase the number of participants on the room by 1
        }
    });

    listGetRooms();

});