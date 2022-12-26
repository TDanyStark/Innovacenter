  // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
    import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
    // import firestore
    import { 
      getFirestore, 
      collection, 
      getDocs, 
      getDoc , 
      addDoc, 
      doc, 
      updateDoc, 
      deleteDoc, 
      Timestamp, 
      setDoc 
    } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
  // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyC6PdFpNxQilnubzDnIeB4wedMgD-Nlv6o",
        authDomain: "innova-system.firebaseapp.com",
        projectId: "innova-system",
        storageBucket: "innova-system.appspot.com",
        messagingSenderId: "573259188991",
        appId: "1:573259188991:web:904df210bd04239d87daca"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    const auth = getAuth();
    export let signInEmail = (email, password, cbSuccess, cbError) => {         
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            cbSuccess(user)

        })
        .catch((error) => {
            cbError(error)
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    export let estadoChange = async () => {
      return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            resolve(user);
          } else {
            resolve(false);
          }
        });
      });
    }
    
    export let CerrarSesion = (cbSuccess, cbError) => {
      auth.signOut().then(() => {
        // Sign-out successful.
        cbSuccess()
      }).catch((error) => {
        // An error happened.
        cbError(error)
      });
    }

    /////////////////firestore/////////////////////
    const db = getFirestore();
    export let getCollection = async (collectionName) => {
        const querySnapshot = await getDocs(collection(db, collectionName));
        let docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({id: doc.id, ...doc.data()})
        });
        return docs;
    }

    // funcion que retorne true si se encuentra un documento con el mismo id
    export let Admin = async (id) => {
      const docRef = doc(db, "admins", id);
      const docSnap = await getDoc(docRef);

      
      return new Promise((resolve, reject) => {
        if (docSnap.exists()) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }

    // funcion que retorne true si se encuentra un un id en la coleccion de usuarios
    export let clienteFound = async (id) => {
      const docRef = doc(db, "clientes", id);
      const docSnap = await getDoc(docRef);

      
      return new Promise((resolve, reject) => {
        if (docSnap.exists()) {
          //retorne el documento
          resolve(docSnap.data());
        } else {
          resolve(false);
        }
      });
    }

    // guardar en la base de datos firestore
    export let guardarCliente = async (data) => {
      let {celular, nombre} = data;
      const docData = {
        celular,
        nombre,
        fecha_creacion: Timestamp.fromDate(new Date())
      }
      try {
        const docRef = await setDoc(doc(db, "clientes", celular), docData);
        return docRef.id;
      } catch (e) {
        return false;
      }
    }