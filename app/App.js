import { Login } from "./components/Login.js";
import { LoginLO } from "./components/LoginLO.js";
import { estadoChange } from "./helpers/firebase.js";

export async function App(){
    const d = document,
    $app = d.getElementById("app");
    $app.innerHTML = null;

    let funcionApp = async () => {

        let user = await estadoChange();

        if (user) {
            location.hash = "#/dashboard";
        }else{
            location.hash = "#/login";
        }
    }
    funcionApp();

    // estadoChange(cbSuccess, cbDeslogueado);
    // function cbSuccess(user){
    //     // console.log("logueado", user)
    //     location.hash = "#/dashboard";
    // }
    // function cbDeslogueado(){
    //     location.hash = "#/login";
    // }
    
    console.log(location.hash);
    if (location.hash != "#/login") {
        location.hash = "#/login";
    }else if (location.hash == "#/login") {
        $app.appendChild(Login());
        LoginLO($app);
    }
        
    /////////////////////////////////////////////////////
}