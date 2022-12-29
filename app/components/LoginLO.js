import { signInEmail } from '../helpers/firebase.js';
import { Loader } from './Loader.js';

 // funcion que realiza el login usando firebase
 export function LoginLO($app){

    const d = document;
    const formlogin = d.getElementById("loginform");

    const formSubmitHandler = (e) => {

        $app.innerHTML = null;
        $app.appendChild(Loader());

        e.preventDefault();
        function cbSuccess(user){
            // console.log("logueado", user)
            formlogin.reset();
            location.hash = "#/dashboard";

            // Creo que esto simula un componente que se desmonta
            formlogin.removeEventListener("submit", formSubmitHandler);
            console.log("desconectado")

        }
        function cbError(error){
            console.log("error", error)
            formlogin.reset();
            Swal.fire({
                title: 'Error!',
                text: 'Usuario o contraseña incorrectos',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            })

            location.hash = "#/";
        }
        signInEmail(formlogin.usuario.value, formlogin.password.value, cbSuccess, cbError);
    };
    formlogin.addEventListener("submit", formSubmitHandler);

}