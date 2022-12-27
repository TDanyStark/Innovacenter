import { Loader } from './Loader.js';
import { Login } from './Login.js';
import {LoginLO} from './LoginLO.js';
import { estadoChange, Admin } from '../helpers/firebase.js';
import { DashboardLO } from './DashboardLO.js';
import { Menu } from './Menu.js';
import { Header } from './Header.js';
import { Ventas } from './Ventas.js';

export async function Router() {
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
    console.log(hash);
    if(hash == "#/"){
        location.hash = "#/login";
        return;
    }
    
    if (hash == "#/login") {
        $app.innerHTML = null;
        $app.appendChild(Login());
            LoginLO($app);
    }
    if (hash.includes("#/dashboard")) {
        let funcionDash = async () => {
            // estadoChange me devuelve un usuario si este se encuentra logueado si no devuelve null
            let user = await estadoChange();
            if (user) {
                let userRole = await Admin(user.uid);
                $app.innerHTML = null;
                $app.appendChild(Header());
                $app.appendChild(Menu(userRole));
                DashboardLO();
            }else{
                $app.innerHTML = null;
                location.hash = "#/login";
            }
        }
        funcionDash();
    }
    if (hash == "#/Contact") {
        const $MAIN = document.getElementById("main");
        
        $MAIN.innerHTML = null;
        $MAIN.appendChild(Loader());
        let funcionDash = async () => {
            // estadoChange me devuelve un usuario si este se encuentra logueado si no devuelve null
            let user = await estadoChange();
            if (user) {
                let userRole = await Admin(user.uid);
                if (userRole == true) {
                    $MAIN.innerHTML = null;
                    $MAIN.innerHTML = "<h1>Contact</h1>";
                }else{
                    location.hash = "#/dashboard";
                }
            }else{
                $app.innerHTML = null;
                location.hash = "#/login";
            }
        }
        funcionDash();
        
    }
    if (hash == "#/ventas") {
        const $MAIN = document.getElementById("main");
        
        $MAIN.innerHTML = null;
        $MAIN.appendChild(Loader());
        let funcionDash = async () => {
            // estadoChange me devuelve un usuario si este se encuentra logueado si no devuelve null
            let user = await estadoChange();
            if (user) {
            
                $MAIN.innerHTML = null;
                Ventas();

                
            }else{
                $app.innerHTML = null;
                location.hash = "#/login";
            }
        }
        funcionDash();
        
    }
}