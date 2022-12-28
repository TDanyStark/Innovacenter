import { buscarProducto, buscarProductoDescripcionLike, guardarProducto, guardarVenta } from "../helpers/firebase.js";

export function VentaProducto(props) {
//   console.log(props);
  // este coindicional es para que no se ejecute la función si no hay un cliente seleccionado
  if (props == undefined) {
    return;
  }
  const $VENTAS = document.getElementById("ventas");
  const $TABLAVENTA = document.createElement("div");
  $TABLAVENTA.classList.add("ventaproducto");
  $TABLAVENTA.id = "ventaproducto";
  $TABLAVENTA.innerHTML = null;
  $TABLAVENTA.innerHTML = /*html*/ `
        <div class="tablaBusqueda">
            <h3>Busqueda de Productos</h3>
            <hr />
            <table class="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Descripcion</th>
                    </tr>
                </thead>
                <tbody id="bodyTablaBusqueda">
                    <tr>
                        <td data-th="ID: " ><input class="busquedaID" id="busquedaID" type="text" /></td>
                        <td data-th="Descripcion: ">
                            <input class="busquedaDescripcion" id="busquedaDescripcion" type="text" />
                            <div id="resultadosDescripcion">
                                <ul>
                                    
                                </ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
            <hr />
            <h3>Venta o ST</h3>
            <hr />
        <div class="tablaProductos">
            <table class="table table-dark table-striped">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Descripcion</th>
                    <th scope="col" style="max-width: 10%">Cantidad</th>
                    <th scope="col">V. Unitario</th>
                    <th scope="col" style="min-width: 15%">V. Total</th>
                    <th scope="col">Accion</th>

                </tr>
                </thead>
                <tbody id="bodyTabla">
                </tbody>
                <tfoot>
                    <tr>
                        <td class="tfootDescuento bg-dark">Descuento</td>
                        <td id="filaDescuento"><input class="inputDescuento" type="number" /></td>
                        <td class="izquierda phoneNone" colspan="2">Total: </td>
                        <td id="totalVenta">$ 0</td>
                        <td><button type="button" class="btn btn-primary" id="btnCobrarVenta">Cobrar</button></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
  $VENTAS.appendChild($TABLAVENTA);

  const $bodyTabla = document.getElementById("bodyTabla");
  const $busquedaID = document.getElementById("busquedaID");
  const $busquedaDescripcion = document.getElementById("busquedaDescripcion");

  let $modalAgregarProducto;

  //separar por miles el precio
  let milesFuncion = (precio) => "$ " + precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  // funcion que suma el total de la venta
    function sumarTotal() {
        // Obtener el descuento
        let descuento = parseInt(document.querySelector("#filaDescuento input").value);

        if (isNaN(descuento)) {
            descuento = 0;
        }
        const $filasTabla = document.querySelectorAll(".filaTabla");

            // Recorrer las filas y sumar los valores totales
            let totalVenta = 0;
            $filasTabla.forEach(($fila) => {
                // Convertir el valor total de la fila a un número y eliminar el símbolo de moneda y el separador de miles
                const valorFila = parseInt($fila.querySelector("#tablaVTotal").textContent.replace("$ ", "").replace(/\./g, ""));
                totalVenta += valorFila;
            });

            // Restar el descuento
            totalVenta -= descuento;

            // Mostrar el total de la venta en el elemento totalVenta
            document.querySelector("#totalVenta").textContent = "$ " + totalVenta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            // agregarle un dataset al boton cobrar para poder enviar el total de la venta
            document.querySelector("#totalVenta").dataset.total = totalVenta;
    }

    // lanzar una ventana modal con los inputs para agregar un nuevo producto
    function modalAgregarProducto(ID) {
        let isSt = false;
        let precio = 0;
        let descripcion = "";
        let proveedor = "";
        if (ID.startsWith("ST")) {
            isSt = true;
            precio = ID.replace(/\D/g, "");
            precio = parseInt(precio * 1000);
            descripcion = "Servicio Tecnico $ " + precio.toString();
            proveedor = "Servicio Tecnico";
        }
        
        const $modal = document.createElement("div");
        $modal.classList.add("modal");
        $modal.id = "modal";
        $modal.innerHTML = /*html*/ `
            <div class="modal-dialog">
                <div class="modal-content bg-dark">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar Producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="form-modal-add-product">
                            <div class="mb-3">
                                <label for="idProducto" class="col-form-label">ID:</label>
                                <input type="text" class="form-control" name="Modalid" id="ModalidProducto" value=${ID} disabled>
                            </div>
                            <div class="mb-3">
                                <label for="descripcionProducto" class="col-form-label">Descripcion:</label>
                                <input type="text" class="form-control" name="descripcion" id="descripcionProducto" value="${descripcion != "" ? descripcion : ""}">
                            </div>
                            <div class="mb-3">
                                <label for="precioProducto" class="col-form-label">Precio:</label>
                                <input type="number" class="form-control" name="precio" id="precioProducto" value="${precio != 0 ? precio : "" }">
                            </div>
                            <div class="mb-3">
                                <label for="cantidadProducto" class="col-form-label">Cantidad Inventario:</label>
                                <input type="number" class="form-control" name="cantidadInventario" id="cantidadInventarioProducto" value=${isSt ? "1" : ""} ${isSt ? "disabled" : ""}>
                            </div>
                            <div class="mb-3">
                                <label for="proveedorProducto" class="col-form-label">Proveedor: jyr, asf, mercadolibre, amazon, otro.</label>
                                <input type="text" class="form-control" name="proveedor" id="proveedorProducto" value="${proveedor != "" ? proveedor : ""}" ${proveedor != "" ? "disabled" : ""} />
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" id="btnAgregarProducto">Agregar</button>
                    </div>
                </div>
            </div>
        `;
        $VENTAS.appendChild($modal);
        $modalAgregarProducto = new bootstrap.Modal($modal);
        $modalAgregarProducto.show();


    }

    //funcion que asincrona que revisa si ya existe el producto en la tabla de venta
    async function revisarProducto(id) {
        const $filasTabla = document.querySelectorAll(".filaTabla");
        let existe = false;
        $filasTabla.forEach(($fila) => {
            if ($fila.dataset.id == id) {
                existe = true;
            }
        });
        return existe;
    }

  function newFilaTablaVenta(props) {
    const $filaTabla = document.createElement("tr");
    $filaTabla.classList.add("filaTabla");
    $filaTabla.id = "filaTabla";
    $filaTabla.dataset.id = props.id;
    $filaTabla.innerHTML = /*html*/ `
            <td data-th="ID: " scope="row" data-id=${props.id}>${props.id}</td>
            <td data-th="Descripcion: " data-id=${props.id}>${props.descripcion}</td>
            <td data-th="Cantidad: " data-id=${props.id} ><input class="filaCantidad" type="number" min="1" value= "1" data-id=${props.id} data-inventario=${props.inventario} /></td>
            <td data-th="V. Unitario: " id="tablaVUnitario" data-id=${props.id} data-price=${props.precio}>${milesFuncion(props.precio)}</td>
            <td data-th="V. Total: " id="tablaVTotal" data-id=${props.id}>${milesFuncion(props.precio)}</td>
            <td data-th="Accion: " data-id=${props.id}><button id="btnEliminar" class="btn btn-danger" type="submit" data-id=${props.id}>Eliminar</button></td>
    `;
    return $filaTabla;
  }
  $busquedaID.addEventListener("change", async (e) => {
    // console.log(e.target.value);
    if (e.target.value === "") {
        return;
    }

    //realizar consulta a la base de datos productos por id
    let result = await buscarProducto(e.target.value);

    if (!result) {
        // lanzar una ventana modal con los inputs para agregar un nuevo producto
        
        Swal.fire({
            title: 'Quieres agregar un nuevo producto?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: `No Guardar`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const ID = $busquedaID.value;
                modalAgregarProducto(ID);

            //   Swal.fire('Saved!', '', 'success')
            } else if (result.isDenied) {
              Swal.fire('Intenta Buscar por Descripcion', '', 'info')
              $busquedaID.value = "";

              $busquedaDescripcion.focus();
            }
          })

        
      return;
    }

    $busquedaDescripcion.value = result.descripcion;
    console.log(result);
    result = {
        id: result.id,
        descripcion: result.descripcion,
        precio: result.precio,
        inventario: result.cantidad_inventario,
    }
    // revisar si el producto ya existe en la tabla de venta
    const existe = await revisarProducto(result.id);
    if (existe) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El producto ya existe en la tabla de venta!',
            })
            // limpiar el input de busqueda
            $busquedaID.value = "";
            $busquedaDescripcion.value = "";
        return;
    }
    const $filaTabla = newFilaTablaVenta(result);
    $bodyTabla.appendChild($filaTabla);
    // sumar el total de la venta
    sumarTotal()
    // limpiar el input de busqueda
    $busquedaID.value = "";
    $busquedaDescripcion.value = "";
    $busquedaID.focus();

  });

  $busquedaDescripcion.addEventListener("input", async (e) => {
        if (e.target.value === "" || e.target.value.length < 3) {
            return;
        }

        let resultado = await buscarProductoDescripcionLike(e.target.value);
        const $resultadosDescripcion = document.querySelector("#resultadosDescripcion ul");

        //eliminar clase de un elemento
        $resultadosDescripcion.classList.remove("d-none");

        $resultadosDescripcion.innerHTML = "";
        let contador = 0;
        resultado.forEach((producto) => {
            contador++;
            if (contador >= 5) {
                return;
            }
            const $li = document.createElement("li");
            $li.classList.add("list-group-item");
            $li.dataset.id = producto.id;
            $li.textContent = producto.descripcion;
            $resultadosDescripcion.appendChild($li);

            
        });
    });

  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("filaCantidad")) {
            const $filaTabla = e.target.parentElement.parentElement;
            const $tablaVTotal = $filaTabla.querySelector("#tablaVTotal");
            const $tablaVUnitario = $filaTabla.querySelector("#tablaVUnitario");
            let cantidad = parseInt(e.target.value);
            let precio = $tablaVUnitario.dataset.price;

            let inventario = parseInt(e.target.dataset.inventario);
            // Validar si el valor ingresado es mayor al valor máximo permitido
            if (cantidad > inventario) {
                // Mostrar alerta
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "La cantidad ingresada es mayor al inventario",
                });

                // Establecer el valor máximo permitido como el valor del input
                // console.log(inventario);
                e.target.value = inventario;
                cantidad = inventario;
            }

            $tablaVTotal.textContent = milesFuncion(cantidad * precio);

            
            // sumar el total de la venta
            sumarTotal()
        }
    if (e.target.classList.contains("inputDescuento")) {
            if (document.querySelector("#tablaVTotal") === null) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No hay productos en la tabla de venta",
                });
                e.target.value = null;
                return;
            }

            //si el descuento es mayor a lo que da el total de la venta retornar
            let totalVentaD = parseInt(document.querySelector("#totalVenta").dataset.total);
            if (parseInt(e.target.value) > totalVentaD) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "El descuento no puede ser mayor al total de la venta",
                });
                e.target.value = null;
            }
            // sumar el total de la venta
            sumarTotal()
        }

        // para que el id busqueda se ponga en mayusculas
        if (e.target.id === "busquedaID" || e.target.id === "idProducto") {
            e.target.value = e.target.value.toUpperCase();
        }

    });
    // eliminar fila de la tabla
    document.addEventListener("click", async (e) => {
        if (e.target.id === "btnEliminar") {
            e.target.parentElement.parentElement.remove();
            // sumar el total de la venta
            sumarTotal()
        }

        if(e.target.classList.contains("list-group-item")){
            $busquedaDescripcion.value = e.target.textContent;
            $busquedaID.value = e.target.dataset.id;
            document.querySelector("#resultadosDescripcion ul").classList.add("d-none");

            // esto es para que se dispare el evento change del input de busqueda por ID
            $busquedaID.dispatchEvent(new Event("change"));

        }

        if(e.target.id === "btnCobrarVenta"){
            if (document.querySelector("#tablaVTotal") === null) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No hay productos agregados",
                });
                return;
            }
            let compra
            // guardarVenta();
        }
        if(e.target.id === "validationCustom01" || e.target.id === "validationCustom05"){
            document.querySelector("#btnGuardarCliente").disabled = false;
            document.getElementById("validationCustom01").disabled = false;
            document.getElementById("validationCustom05").disabled = false;
        }

        //guardar producto
        if(e.target.id === "btnAgregarProducto"){
            let $formModal = document.getElementById("form-modal-add-product");
            let $id = $formModal.Modalid.value;
            let $descripcion = $formModal.descripcion.value;
            let $precio = parseInt($formModal.precio.value);
            let $inventario = parseInt($formModal.cantidadInventario.value);
            let $proveedor = $formModal.proveedor.value;

            

            let dataNewProduct = {
                id: $id,
                descripcion: $descripcion,
                precio: $precio,
                cantidad_inventario: $inventario,
                proveedor: $proveedor
            }

            console.log(dataNewProduct);
            let result = await guardarProducto(dataNewProduct);
            console.log(result);
            if(result){
                Swal.fire({
                    icon: "success",
                    title: "Producto agregado",
                    text: "El producto se agregó correctamente",
                });
                $formModal.reset();
                //ocultar modal de agregar producto
                $modalAgregarProducto.hide();

            }else{
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "El producto no se agregó, intentalo nuevamente",
                });
            }
        }

    });

}
