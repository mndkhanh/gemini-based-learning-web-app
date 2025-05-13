// Import environment var
// require('dotenv').config();

// Initialize firebase app: CDN-Based
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// Import SDKs for the Firestore Service
import { getFirestore, query, orderBy, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
      apiKey: "AIzaSyDBNEEwbRUHTdb5RbaTrTgezX7Me1xM7ks",
      authDomain: "my-ai-powered-learning-app.firebaseapp.com",
      databaseURL: "https://my-ai-powered-learning-app-default-rtdb.firebaseio.com",
      projectId: "my-ai-powered-learning-app",
      storageBucket: "my-ai-powered-learning-app.firebasestorage.app",
      messagingSenderId: "864404981857",
      appId: "1:864404981857:web:716e2fb8d6f7e1301d4220",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get ref to firestore service
const firestore = getFirestore(app);

// DOM element initialization 
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const img = document.querySelector(".img-section img");
const cmtTextArea = document.getElementById("cmtTextArea");

// Initailize index and array to store real-time data from firestore
let currentIndex = 0;
let vocabList = [];

// Functions to retrieve real-time data from firestore by using onSnapshot() func
// Initialize the unscribe
let unsubscribe;
function retrieveVocabList() {
      const vocabCollection = collection(firestore, "vocabs");
      const vocabQuery = query(vocabCollection, orderBy("timestamp"));
    
      // Listen for changes in real-time and store the unsubscribe function
      unsubscribe = onSnapshot(vocabQuery, (querySnapshot) => {
            vocabList = [];
            querySnapshot.forEach((doc) => {
                  vocabList.push(doc.data());
            });
      
            displayVocab();
      });
}

// retrieve next and previous
function retrieveNext() {
      ++currentIndex;
      displayVocab();
}
function retrievePrev() {
      --currentIndex;
      displayVocab();
}   

function displayVocab() {
      if (currentIndex === -1) currentIndex = vocabList.length-1;
      else if (currentIndex === vocabList.length) currentIndex = 0;
      img.src = vocabList[currentIndex].imgUrl;
      cmtTextArea.value = brToEndl(vocabList[currentIndex].comment);
}

// To unsubscribe when leaving the page (e.g., window unload)
function unsubscribeFromVocabData() {
      if (unsubscribe) {
            unsubscribe();
            console.log("Unsubscribed to retrieve data.");
      }
}
window.addEventListener("beforeunload", () => {
      unsubscribeFromVocabData(); // Unsubscribe before unloading the page
});

// add event
prevBtn.addEventListener("click", retrievePrev);
nextBtn.addEventListener("click", retrieveNext);
window.addEventListener("keypress", (e) => {
      console.log(e.key);
});

//function chang <br> to \n
function brToEndl(string) {
      return string.replace(/<br>/g, "\n");
}

retrieveVocabList();