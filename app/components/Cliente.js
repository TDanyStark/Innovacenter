import { clienteFound } from "../helpers/firebase.js";
export function Cliente() {
    const $VENTAS = document.getElementById("ventas");
  const $CLIENTE = document.createElement("div");
  $CLIENTE.classList.add("cliente");
  $CLIENTE.innerHTML = /*html*/ `
        <form class="row g-3 needs-validation formCliente" novalidate>
            <h2>Cliente</h2>
        
        <div class="col-md-3">
            <label for="validationCustom05" class="form-label">Celular</label>
            <input type="number" class="form-control" id="validationCustom05" required>
            <div class="invalid-feedback">
                Debe tener 10 digitos minimo.
            </div>
        </div>
        <div class="col-md-4">
            <label for="validationCustom01" class="form-label">Nombre y Apellido</label>
            <input type="text" class="form-control" id="validationCustom01" value="" required>
            <div class="valid-feedback">
                Todo Bien!
            </div>
        </div>
        
        <div class="col-md-5">
        <button id="btnGuardar" class="btn btn-primary" type="submit">Guardar</button>
        </div>
    </form>
    `;

    $VENTAS.innerHTML = null;
    $VENTAS.appendChild($CLIENTE);

    let onClienteEncontrado = (e) => `style="display: block;"`; 
        
    const $formCliente = document.querySelector(".formCliente");
    $formCliente.addEventListener("submit", (e) => {
        e.preventDefault();
        const $nombre = document.getElementById("validationCustom01").value;
        const $celular = document.getElementById("validationCustom05").value;

        if ($nombre === "" || $celular === "") {
            Swal.fire({
                title: "Error!",
                text: "Complete los campos",
                icon: "error",
                confirmButtonText: "Cerrar",
            });
            return;
        }

        console.log($nombre, $celular);
        // guardarCliente($nombre, $celular);
        
    });

    const $nombre = document.getElementById("validationCustom01");
    const $celular = document.getElementById("validationCustom05");

   $celular.addEventListener("keyup", async (e) => {
        const $btnGuardar = document.getElementById("btnGuardar");


        if (e.target.value.length == 10 ) {
            $celular.classList.add("is-valid");
           let existClient = await clienteFound(e.target.value);
           if (existClient.nombre == undefined) {
            $nombre.value = "";
            $nombre.focus();
            $btnGuardar.style.display = "block";

               Swal.fire({
                   title: "Error!",
                   text: "Cliente no encontrado, debe registrarlo",
                   icon: "error",
                   confirmButtonText: "Cerrar",
               });
            
               return;
           }
           $nombre.value = existClient.nombre;
           $btnGuardar.style.display = "none";
            window.editor.publicar('clienteEncontrado', {nombre: existClient.nombre});
            $nombre.disabled  = true;
            $celular.disabled  = true;


        }
        else if (e.target.value.length > 10 ) {
            $celular.classList.add("is-invalid");
        } else {
            $celular.classList.remove("is-invalid");
        }
    });

}
