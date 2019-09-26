// START with: yarn firebase emulators:exec "yarn test"
// important, project ID must be the same as we currently test

// At the top of test/index.test.js
const test = require("firebase-functions-test")();
const myFunctions = require("../src/index"); // relative path to functions code

const assert = require("assert");
const firebase = require("@firebase/testing");

const projectId = "jaipuna-fb-emulator-test";
const app = firebase.initializeAdminApp({ projectId });

beforeEach(async function() {
    this.timeout(0);
    await firebase.clearFirestoreData({ projectId });
});

it("Add Assignment", async function() {
    this.timeout(0);

    await app
        .firestore()
        .doc("/users/user1")
        .set({
            name: "user1",
            finishedAssignmentIds: [],
            startedAssignmentIds: [],
        });

    const studentAssignment = {
        userId: "user1",
        state: "SETUP",
    };

    await app
        .firestore()
        .doc("/assignments/whatever")
        .set(studentAssignment);

    await new Promise(resolve => {
        setTimeout(e => {
            resolve();
        }, 3000);
    });

    return new Promise(resovle => {
        app.firestore()
            .doc("/assignments/whatever")
            .onSnapshot(snap => {
                if (snap.exists) {
                    const assignment = snap.data();
                    if (assignment.state === "STARTED") {
                        console.log("assignment", snap.data());
                        resovle();
                    }
                }
            });
    });

    // const studentAssignmentId = "assignment1";

    // const assignmentSnap = test.firestore.makeDocumentSnapshot(studentAssignment, `assignments/${studentAssignmentId}`);

    // const fsAssignmentCreate = test.wrap(myFunctions.fsAssignmentCreate);

    // await fsAssignmentCreate(assignmentSnap);
});

it("Add Assignment2", async function() {
    this.timeout(0);

    await app
        .firestore()
        .doc("/users/user1")
        .set({
            name: "user1",
            finishedAssignmentIds: [],
            startedAssignmentIds: [],
        });

    const studentAssignment = {
        userId: "user1",
        state: "SETUP",
    };

    await app
        .firestore()
        .doc("/assignments/whatever")
        .set(studentAssignment);

    await new Promise(resolve => {
        setTimeout(e => {
            resolve();
        }, 3000);
    });

    return new Promise(resovle => {
        app.firestore()
            .doc("/assignments/whatever")
            .onSnapshot(snap => {
                if (snap.exists) {
                    const assignment = snap.data();
                    if (assignment.state === "STARTED") {
                        console.log("assignment", snap.data());
                        resovle();
                    }
                }
            });
    });

    // const studentAssignmentId = "assignment1";

    // const assignmentSnap = test.firestore.makeDocumentSnapshot(studentAssignment, `assignments/${studentAssignmentId}`);

    // const fsAssignmentCreate = test.wrap(myFunctions.fsAssignmentCreate);

    // await fsAssignmentCreate(assignmentSnap);
});
