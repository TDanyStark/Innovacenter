import { CerrarSesion } from "../helpers/firebase.js";
import { Loader } from "./Loader.js";

export async function DashboardLO(){

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    const open = document.querySelector(".openbtn");


    function openNav() {
        
        // saber el ancho de la pantalla
        const ancho = window.innerWidth;
        if (ancho > 550) {
            document.getElementById("mySidebar").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
            const elementos = document.querySelectorAll(".cerrarBtn");
            elementos.forEach(elemento => {
                elemento.style.display = "block";
            });
        }else{
            document.querySelector(".cerrarBtn").style.display = "none";

            document.getElementById("mySidebar").style.width = "100%";
            document.getElementById("main").style.marginLeft = "0";
        }

       
         setTimeout(() => {
            const elementClose = document.querySelectorAll(".itemsA");
        elementClose.forEach(elemento => {
            elemento.style.display = "";
        });
        }, 500);

    }
     open.addEventListener("click", openNav);
    
    
    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
     function closeNav() {
        //guardar el estado en el local storage
        const elementClose = document.querySelectorAll(".itemsA");
        elementClose.forEach(elemento => {
            elemento.style.display = "none";
        });
        document.getElementById("mySidebar").style.width = "0px";
        document.getElementById("main").style.marginLeft = "0";
        open.style.display = "block";


        const elementos = document.querySelectorAll(".cerrarBtn");
        elementos.forEach(elemento => {
            elemento.style.display = "none";
        });
    }


    const elementClose = document.querySelectorAll(".cerrarBtn");
    elementClose.forEach(elemento => {
        elemento.addEventListener("click", closeNav);
    });


    if (window.innerWidth < 550) {
        document.querySelector(".cerrarBtn").style.display = "none";

        const elementClose2 = document.querySelectorAll(".itemsA");
        elementClose2.forEach(elemento => {
            elemento.addEventListener("click", () => {
                elementClose2.forEach(elemento => {
                    elemento.style.display = "none";
                });
                document.getElementById("mySidebar").style.width = "0px";
                document.getElementById("main").style.marginLeft = "0";
            });
        });
    }

    const cerrarSesion = document.querySelector(".CerrarSesionBtn");

    function clickSession(e){
        let $app = document.getElementById("app");
        $app.innerHTML = null;
        $app.appendChild(Loader());

        e.preventDefault();
        CerrarSesion(cbSuccess, cbError);
        function cbSuccess(){
            // limpiar el app
            document.getElementById("app").innerHTML = "";
            location.hash = "#/login";
        }
        function cbError(error){
            console.log("error", error);
        }
    }
    cerrarSesion.addEventListener("click", clickSession);
}