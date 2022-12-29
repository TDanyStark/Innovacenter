import { Loader } from './Loader.js';
import { Login } from './Login.js';
import {LoginLO} from './LoginLO.js';
import { Admin, estadoSesion } from '../helpers/firebase.js';
import { DashboardLO } from './DashboardLO.js';
import { Menu } from './Menu.js';
import { Header } from './Header.js';
import { Ventas } from './Ventas.js';

export async function Router() {
    console.log("Router", location.hash, estadoSesion);
    // metodo Publish-Subscribe para comunicar componentes
    window.editor = {
        suscriptores: {},
      
        suscribir(evento, suscriptor) {
          if (!this.suscriptores[evento]) {
            this.suscriptores[evento] = [];
          }
      
          this.suscriptores[evento].push(suscriptor);
        },        
      
        publicar(evento, datos) {

          if (!this.suscriptores[evento]) {
            return;
          }
      
          this.suscriptores[evento].forEach(suscriptor => suscriptor(datos));
        },
      };
      
    let $app = document.getElementById("app");

    let {hash} = location;
    // mostrar por consola el pushState
    // console.log(hash);
    if (hash == "#/logout"){
        return;
    }
    
    else if (hash == "#/login") {
        if (estadoSesion) {
            location.hash = "#/dashboard";
            return;
        }
        $app.innerHTML = null;
        $app.appendChild(Login());
        LoginLO($app);
        return;        
    }

    else if (hash.includes("#/dashboard")) {
        if (!estadoSesion) {
            location.hash = "#/login";
            return;
        }
        let userRole = await Admin(estadoSesion.uid);
        $app.innerHTML = null;

        $app.appendChild(Header());
        $app.appendChild(Menu(userRole));
        DashboardLO();    
        return;
    }
    
    else if (hash.includes("#/ventas")) {
        if (!estadoSesion) {
            location.hash = "#/login";
            return;
        }

        const $MAIN = document.getElementById("main");
        $MAIN.innerHTML = null;
        $MAIN.appendChild(Loader());
        $MAIN.innerHTML = null;
        Ventas();
        return;
    }

    else if (hash.includes("#/inventario")) {
        if (!estadoSesion) {
            location.hash = "#/login";
            return;
        }

        const $MAIN = document.getElementById("main");
        $MAIN.innerHTML = null;
        $MAIN.appendChild(Loader());
        let userRole = await Admin(estadoSesion.uid);
        if (userRole == true) {
            $MAIN.innerHTML = null;
            $MAIN.innerHTML = "<h1>Inventario</h1>";
        }else{
            location.hash = "#/dashboard";
        }
        return;
    }
    else{
        location.hash = "#/login";
        return;
    }
}
