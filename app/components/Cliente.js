import { clienteFound, guardarCliente } from "../helpers/firebase.js";
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
            <input type="text" class="form-control" id="validationCustom01" required>
            <div class="valid-feedback">
                Todo Bien!
            </div>
        </div>
        
        <div class="col-md-5">
        <button id="btnGuardarCliente" class="btn btn-primary" type="submit">Guardar</button>
        </div>
    </form>
    `;

    $VENTAS.innerHTML = null;
    $VENTAS.appendChild($CLIENTE);

        
    const $formCliente = document.querySelector(".formCliente");
    $formCliente.addEventListener("submit", async (e) => {
        e.preventDefault();
        let $nombre = document.getElementById("validationCustom01").value;
        let $celular = document.getElementById("validationCustom05").value;

        if ($nombre === "" || $celular === "") {
            Swal.fire({
                title: "Error!",
                text: "Complete los campos",
                icon: "error",
                confirmButtonText: "Cerrar",
            });
            return;
        }

        let result = await guardarCliente({$nombre, $celular});
        console.log(result);
        if (result) {
            Swal.fire({
                title: "Exito!",
                text: "Cliente registrado",
                icon: "success",
                confirmButtonText: "Cerrar",
            });
            
            document.getElementById("btnGuardarCliente").disabled = true;
           if (!componenteRenderizado) {
                componenteRenderizado = true;
                window.editor.publicar('clienteEncontrado', {nombre: $nombre});
            }
            
            document.getElementById("validationCustom01").disabled  = true;
            document.getElementById("validationCustom05").disabled  = true;
        } else {
            Swal.fire({
                title: "Error!",
                text: "No se pudo registrar el cliente",
                icon: "error",
                confirmButtonText: "Cerrar",
            });
        }

    });

    const $nombre = document.getElementById("validationCustom01");
    const $celular = document.getElementById("validationCustom05");
    let componenteRenderizado = false;
   $celular.addEventListener("keyup", async (e) => {
        const $btnGuardar = document.getElementById("btnGuardarCliente");

        // Remover evento previamente asignado
        $celular.removeEventListener("keyup", this);

        

        if (e.target.value.length == 10 ) {

            $celular.classList.add("is-valid");
           let existClient = await clienteFound(e.target.value);
           if (existClient.nombre == undefined) {
            $nombre.value = "";
            $nombre.focus();
            $btnGuardar.disabled = false;

               Swal.fire({
                   title: "Error!",
                   text: "Cliente no encontrado, debe registrarlo",
                   icon: "error",
                   confirmButtonText: "Cerrar",
               });
            
               return;
           }
           $nombre.value = existClient.nombre;
           $btnGuardar.disabled = true;
           if (!componenteRenderizado) {
                componenteRenderizado = true;
                window.editor.publicar('clienteEncontrado', {nombre: existClient.nombre});
            }
            
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
