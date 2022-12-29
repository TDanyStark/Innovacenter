import { estadoSesion } from "./helpers/firebase.js";

export async function App(){
    
    // esperar a que estadosesion sea true
    if (estadoSesion == null) {
        setTimeout(() => {
            App();
        }, 250);
        return;
    }

    const d = document,
    $app = d.getElementById("app");
    $app.innerHTML = null;
    if (location.hash != "#/login") {
        let elHASH = location.hash;
        location.hash = "#/logout";
        location.hash = elHASH;

    }
    else if (location.hash == "#/login") {
        location.hash = "#/logout";
        location.hash = "#/login";
    }

    //   });
    
    // const d = document,
    // $app = d.getElementById("app");
    // $app.innerHTML = null;

    // // cuando se carga el DOM se ejecuta la funcion para verificar el estado del usuario
    // // si el usuario esta logueado se lleva al dashboard
    // // si el usuario no esta logueado se lleva al login
    // // el #/dd es un hash que se usa para redireccionar al dashboard
    // // estadoChange().then((user) => {
    // //     console.log(user);
    // //     if (user) {
    // //         location.hash = "#/dd";  
    // //     }else{
    //         if (location.hash != "#/login") {
    //             location.hash = "#/login";
    //         }else if (location.hash == "#/login") {
    //             location.hash = "#/";
    //         }
    //     }
    //     return;
    // })
}