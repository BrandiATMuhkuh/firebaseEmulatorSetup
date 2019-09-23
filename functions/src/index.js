const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
let fsDB = admin.firestore();

//  listen to new assignments added to firestore
exports.fsAssignmentCreate = functions.firestore.document("assignments/{assignmentId}").onCreate((snap, context) => {
    console.log("fsAssignmentCreate", snap.id);

    // this will update the user assignment count
    // this will change the assignment state from SETUP to STARTED
    // if that would be a real app, we would not add some things to the assignmetn like exercies etc...

    // before doing anything we need to make sure no other cloud function worked on the assignment already
    // don't forget, cloud functions promise an "at least once" approache. So it could be multiple
    // cloud functions work on it. (FYI: this is called "idempotent")

    return fsDB.runTransaction(async t => {
        // let's load the current document again to make sure noone alterned it
        const assignment = (await t.get(snap.ref)).data();
        console.log("assignment", assignment);

        // check if the assignment was already altered by someone else
        // if yes, leave the cloud function. Nothing todo here
        if (assignment.state !== "SETUP") {
            console.error("Assignment already in SETUP state.");
            return;
        }

        // change the assignment state from SETUP to STARTED
        assignment.state = "STARTED";

        // here we could do some more setups

        // add the assignmentId to the users "startedAssignmentIds" array
        const userRef = fsDB.collection("users").doc(assignment.userId);
        const user = (await t.get(userRef)).data();
        console.log("user", user);

        user.startedAssignmentIds.push(snap.id);
        // set user
        await t.set(userRef, user);

        // set assignment
        await t.set(snap.ref, assignment);
    });
});

// // listens to an assignment updated in firestore
// exports.fsAssignmentChange = functions.firestore.document("assignments/{assignmentId}").onUpdate((change, context) => {
//     // if assignment is set to be finished it will update the users finished assignment count
//     // --- it will also change the assignment to set locked so noone can change it any longer
//     // --- we could do here some validation of the assignment and see if it's correclty done and also add this info
// });
