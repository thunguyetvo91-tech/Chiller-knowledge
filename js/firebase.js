import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
}
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-A10DAka_KKVeqltYyiPP1R8Az-eigxA",
  authDomain: "chiller-quiz.firebaseapp.com",
  projectId: "chiller-quiz",
  storageBucket: "chiller-quiz.firebasestorage.app",
  messagingSenderId: "1084535823128",
  appId: "1:1084535823128:web:04787df0035c713ebe9c6d",
  measurementId: "G-62BJ91PM4F"
};

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);

window.FirebaseDB = {

    async saveScore(score){

        await addDoc(
            collection(
                db,
                "leaderboard"
            ),
            score
        );
    },

    async getTopScores(max = 20){

        const q = query(
            collection(
                db,
                "leaderboard"
            ),
            orderBy(
                "totalPoints",
                "desc"
            ),
            limit(max)
        );

        const snapshot =
            await getDocs(q);

        return snapshot.docs.map(
            doc => doc.data()
        );
    }
};
