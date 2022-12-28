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
      let {$celular, $nombre} = data;
      const docData = {
        celular : $celular,
        nombre : $nombre,
        fecha_creacion: Timestamp.fromDate(new Date())
      }
      try {
        await setDoc(doc(db, "clientes", $celular), docData);
        return true;
      } catch (e) {
        return e;
      }
    }

    // guardar en la base datos firestore un producto
    export let guardarProducto = async (data) => {
      let {id, descripcion, precio, cantidad_inventario, proveedor} = data;
      // console.log(data);
      let idEnvio = id;
      let docData = {
        id,
        descripcion,
        precio,
        cantidad_inventario,
        proveedor,
      }
      try {
        await setDoc(doc(db, "productos", id), docData);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }

    // buscar un producto en la base de datos
    export let buscarProducto = async (id) => {
      const docRef = doc(db, "productos", id);
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

    // realizar consulta donde la descripcion contenga la palabra buscada
    export let buscarProductoDescripcionLike = async (descripcion) => {
      const querySnapshot = await getDocs(collection(db, "productos"));
      let docs = [];
      querySnapshot.forEach((doc) => {
        // convertir a minusculas
        descripcion = descripcion.toLowerCase();
        let info = doc.data().descripcion.toLowerCase();

        if(info.includes(descripcion)){
          docs.push({id: doc.id, ...doc.data()})
        }
      });
      return docs;
    }

    //guardar en la base de datos firestore una venta
    export let guardarVenta = async (data) => {
      let {cliente, productos, total, descuento} = data;
      let id = new Date().getTime();
      id = id.toString();
      const docData = {
        id,
        fecha : Timestamp.fromDate(new Date()),
        cliente,
        productos,
        total,
        descuento,
      }
      try {
        const docRef = await setDoc(doc(db, "ventas", id), docData);
        return docRef.id;
      } catch (e) {
        return false;
      }
    }