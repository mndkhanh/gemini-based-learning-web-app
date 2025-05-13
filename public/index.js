// -------------------------------------------------------------------------//
// Paste your code get from the web config here
// Initialize firebase app: CDN-Based
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// Import SDKs for the Firestore Service
import { getFirestore, addDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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

// -------------------------------------------------------------------------//

// Get ref to firestore service
const firestore = getFirestore(app);

// DOM element initialization 
const saveBtn = document.getElementById("saveBtn");
const eraseBtn = document.getElementById("eraseBtn");
const img = document.querySelector(".img-section img")

const imageUrlInp = document.getElementById("imageUrlInp");
const searchInp = document.getElementById("searchInp");
const cmtTextArea = document.getElementById("cmtTextArea");


// Functions to interact with firebase realtime database
function saveVocab() {
      addDoc(collection(firestore, "vocabs"), {
        vocab: searchInp.value,
        imgUrl: imageUrlInp.value,
        comment: endlToBr(cmtTextArea.value),
        timestamp: new Date().getTime()
      })
      .then((vocab) => {
        console.log(vocab);
        eraseData();
        alert("Successfully added to vocabs collection");
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to add to vocabs collection");
      })
}

function getGeneratedCmts() {
      // add vocab input to get started to generate output from the gemini api
      addDoc(collection(firestore, "generate"), {
            vocab: searchInp.value
      })
      .then((docRef) => {
            console.log("Successfully added to generate collection.");
            console.log(docRef);

            // Wait to gemeni api return response
            const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        const status = data.status.state;

                        if (status === "COMPLETED") {
                              console.log("Successfully generated from the Gemini API");
                              cmtTextArea.value = brToEndl(data.output);
                              unsubscribe(); // Stop listening after receiving the data
                        } else if (status === "ERRORED") { //If receiving error, return immediately
                              console.log("Failed to generate.");
                              unsubscribe();
                              return;
                        } else if (status === "PROCESSING") {
                              console.log("gemini is generating...");
                        }
                  } else {
                        console.log("something went wrong. Check again");
                        unsubscribe();
                  }
            });
      })
      .catch((error) => {
            console.log(error);
            alert("Failed to add to generate collection. Try again.");
      })

}
    

//function js
function eraseData() {
      imageUrlInp.value = "";
      searchInp.value = "";
      cmtTextArea.value = "";
      img.src = "./assets/GoGlobal.jpg"
}

function updateImg() {
      img.src = imageUrlInp.value;
}

function endlToBr(string) {
      return string.replace(/\n/g, "<br>");
}
function brToEndl(string) {
      return string.replace(/<br>/g, "\n");
}


// add event
eraseBtn.addEventListener("click", eraseData);
saveBtn.addEventListener("click", saveVocab);
imageUrlInp.addEventListener("change", updateImg);
searchInp.addEventListener("change", getGeneratedCmts);


