$(document).ready(() => {
    let auth = firebase.auth()
    let firestore = firebase.firestore()

    function createRoom() {
        // TODO:
        // - Change maxParticipants, checkoutTime and store name variables to get values from fields
        const maxParticipants = 5;
        const checkoutTime = 3;
        const storeName = 'growth';

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
})