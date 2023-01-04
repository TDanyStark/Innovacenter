import {
  buscarProducto,
  buscarProductoDescripcionLike,
  guardarProducto,
  guardarVenta,
  estadoSesion,
} from "../helpers/firebase.js";

export function VentaProducto(props) {
  // console.log(props);
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

  function unmount() {
    $VENTAS.innerHTML = null;
    
    // busqueda de productos por id
    $busquedaID.removeEventListener("change", async (e) => {
        // revisar si el input esta vacio, si lo esta retornar
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

                // si el usuario confirma guardar el producto, se abre el modal para agregar el producto
                if (result.isConfirmed) {
                    const ID = $busquedaID.value;
                    modalAgregarProducto(ID);

                } else if (result.isDenied) {
                    // si el usuario no quiere guardar el producto, se limpia el input de busqueda
                    Swal.fire('Intenta Buscar por Descripcion', '', 'info')
                    $busquedaID.value = "";
                    $busquedaDescripcion.focus();
                }else{
                    $busquedaID.value = "";
                    $busquedaDescripcion.focus();
                }
            });            
            return;
        }

        // si el producto existe, se agrega a la tabla de venta
        $busquedaDescripcion.value = result.descripcion;

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
                $busquedaID.focus();
            return;
        }

        // si no existe agregarlo a la tabla de venta
        const $filaTabla = newFilaTablaVenta(result);
        $bodyTabla.appendChild($filaTabla);
        // sumar el total de la venta
        sumarTotal()
        // limpiar el input de busqueda
        $busquedaID.value = "";
        $busquedaDescripcion.value = "";
        $busquedaID.focus();

    });

    // buscar producto por descripcion
    $busquedaDescripcion.removeEventListener("input", async (e) => {
        // revisar si el input esta vacio o si es menor a 3, si lo esta retornar
        if (e.target.value === "" || e.target.value.length < 3) {
            return;
        }

        //realizar consulta a la base de datos productos por descripcion
        let resultado = await buscarProductoDescripcionLike(e.target.value);

        const $resultadosDescripcion = document.querySelector("#resultadosDescripcion ul");

        //eliminar clase d-none para mostrar los resultados
        $resultadosDescripcion.classList.remove("d-none");

        //limpiar el ul para que no se repitan los resultados
        $resultadosDescripcion.innerHTML = "";

        //si no hay resultados, mostrar mensaje
        if (resultado.length === 0) {
            $resultadosDescripcion.innerHTML = /*html*/ `<li class="list-group-item" tabindex="-1">No hay resultados</li>`;
            return;
        }

        //si hay resultados, mostrarlos
        resultado.forEach((producto) => {
            const $li = document.createElement("li");
            $li.classList.add("list-group-item");

            // la clase list-resultados-busqueda es para poder seleccionar con la tecla enter
            $li.classList.add("list-resultados-busqueda");
            $li.dataset.id = producto.id;

            //añadirle tabindex para que se pueda seleccionar con el teclado
            $li.tabIndex = 0;
            $li.textContent = producto.descripcion;
            $resultadosDescripcion.appendChild($li);
    
        });
    });
    
    document.removeEventListener("keydown", (e) => {
        // cuando el evento keydown se dispara en la lista de resultados de busqueda
        if (e.target.classList.contains("list-resultados-busqueda")) {
            if (e.key === "Enter") {
                const $elementoFocus = document.activeElement;
                $busquedaDescripcion.value = $elementoFocus.textContent;
                console.log($elementoFocus);
                $busquedaID.value = $elementoFocus.dataset.id;
                $busquedaID.focus();
                const $resultadosDescripcion = document.querySelector("#resultadosDescripcion ul");
                $resultadosDescripcion.classList.add("d-none");

                //disparar el evento change del input de busqueda por id
                $busquedaID.dispatchEvent(new Event("change"));
            }
        }
        if (e.key === "Escape") {
            const $resultadosDescripcion = document.querySelector("#resultadosDescripcion ul");
            $resultadosDescripcion.classList.add("d-none");
        }

    });

    document.removeEventListener("change", async (e) => {
        // si se cambia el input de descuento en la tabla de venta se recalcula el total
        if (e.target.classList.contains("inputDescuento")) {
            if (document.querySelector("#tablaVTotal") === null) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No hay productos en la tabla de venta",
                });
                //input descuento en 0
                document.querySelector(".inputDescuento").value = null;
                descuento = 0;
                return;
            }
            sumarTotal()

            descuento = parseInt(e.target.value);
            //si el descuento es mayor a lo que da el total de la venta retornar
            let totalVentaD = parseInt(document.querySelector("#totalVenta").dataset.totalfordescuento);
            if (parseInt(e.target.value) > totalVentaD) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "El descuento no puede ser mayor al total de la venta",
                });
                //input descuento en 0
                document.querySelector(".inputDescuento").value = null;
                descuento = 0;
            }
            // sumar el total de la venta
            sumarTotal()
        }   
    });

    document.removeEventListener("input", (e) => {
        // si se cambia el input de cantidad en la tabla de venta se recalcula el total
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


        // para que el id busqueda se ponga en mayusculas instantaneamente
        if (e.target.id === "busquedaID" || e.target.id === "idProducto") {
            e.target.value = e.target.value.toUpperCase();
        }

    });

    document.removeEventListener("click", async (e) => {
        // eliminar fila de la tabla
        if (e.target.id === "btnEliminar") {
            // console.log(e.target.parentElement.parentElement);
            // eliminar el elemento padre del elemento padre del elemento al que se le dio click
            e.target.parentElement.parentElement.remove();
            
            //focus en el input de busqueda por id
            $busquedaDescripcion.value = "";
            $busquedaID.value = "";
            $busquedaID.focus();
            
            //input descuento en 0
            document.querySelector(".inputDescuento").value = null;
            descuento = 0;


            // sumar el total de la venta
            sumarTotal()
            
            return;
        }

        // cuando se le de click a un elemento de la lista de resultados de busqueda, 
        // se pone el texto del elemento en el input de busqueda por descripcion y se oculta la lista
        if(e.target.classList.contains("list-group-item")){
            $busquedaDescripcion.value = e.target.textContent;
            $busquedaID.value = e.target.dataset.id;
            document.querySelector("#resultadosDescripcion ul").classList.add("d-none");

            // esto es para que se dispare el evento change del input de busqueda por ID
            $busquedaID.dispatchEvent(new Event("change"));
            return;
        }

        // para volver a habilitar los inputs de cliente 
        if(e.target.id === "validationCustom01" || e.target.id === "validationCustom05"){
            document.querySelector("#btnGuardarCliente").disabled = false;
            document.getElementById("validationCustom01").disabled = false;
            document.getElementById("validationCustom05").disabled = false;
            return;
        }

        //guardar producto en la ventana modal
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
            
            // retornar si alguno de los campos esta vacio
            console.log($id, $descripcion, $precio, $inventario, $proveedor);
            if($id == "" || $descripcion == "" || $precio == "" || $inventario == "" || $proveedor == ""){

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Todos los campos son obligatorios",
                });

                // hacer focus en el primer input vacio
                if($id === ""){
                    $formModal.Modalid.focus();
                }else if($descripcion === ""){
                    $formModal.descripcion.focus();
                }else if($precio === ""){
                    $formModal.precio.focus();
                }else if($inventario === ""){
                    $formModal.cantidadInventario.focus();
                }else if($proveedor === ""){
                    $formModal.proveedor.focus();
                }

                return;
            }

            // guaradar producto en la base de datos
            let result = await guardarProducto(dataNewProduct);
            console.log(result);
            if(result){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'producto agregado',
                    showConfirmButton: false,
                    timer: 1500
                    })
                $formModal.reset();
                //ocultar modal de agregar producto
                $modalAgregarProducto.hide();

                

                // agregar producto a la tabla de productos
                dataNewProduct = {
                    id: $id,
                    descripcion: $descripcion,
                    precio: $precio,
                    inventario: $inventario,
                }
                let $bodyTabla = document.querySelector("#bodyTabla");
                $bodyTabla.appendChild(newFilaTablaVenta(dataNewProduct));

                // limpiar y hacer focus en el input de busqueda por id
                $busquedaDescripcion.value = "";
                $busquedaID.value = "";
                $busquedaID.focus();

            }else{
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "El producto no se agregó, intentalo nuevamente",
                });
                $formModal.reset();
                //ocultar modal de agregar producto
                $modalAgregarProducto.hide();   
                
                // limpiar y hacer focus en el input de busqueda por id
                $busquedaID.value = "";
                $busquedaID.focus();
            }
            return;
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
            // verificar que usuario esta realizando la venta
            console.log(estadoSesion.email);

            // obtener los productos de la venta
            let productosVenta = [];
            let $filasTabla = document.querySelectorAll("#tablaVenta tbody tr");
            $filasTabla.forEach((fila) => {
                let producto = {
                    id: fila.children[0].textContent,
                    descripcion: fila.children[1].textContent,
                    precio: fila.children[2].textContent,
                    cantidad: fila.children[3].textContent,
                    total: fila.children[4].textContent,
                };
                productosVenta.push(producto);
            });

            // obtener el total de la venta en numero
            let total = parseInt(document.querySelector("#totalVenta").getAttribute("data-total"));
            //cliente, productos, total, descuento, vendedor
            let dataVenta = {
                cliente: document.querySelector("#validationCustom01").value,
                productos: productosVenta,
                total,
                descuento: document.querySelector(".inputDescuento").value,
                vendedor: estadoSesion.email
            }

            let res = await guardarVenta(dataVenta);
            console.log(res);

            //limpiar los elementos de la venta
            document.getElementById("bodyTabla").innerHTML = "";
            sumarTotal();

            // habilitar el boton de agregar cliente
            document.getElementById("btnGuardarCliente").disabled = false;
            document.getElementById("validationCustom01").disabled = false;
            document.getElementById("validationCustom05").disabled = false;

            //limpiar los campos de la venta
            document.getElementById("validationCustom01").value = "";
            document.getElementById("validationCustom05").value = "";

            document.getElementById("validationCustom05").focus();

            // desmontar la funcion VentaProducto
            const element = document.getElementById('ventaproducto');
            element.classList.add('d-none');
            // eliminar todos los eventos de la ventana
            
        }
    });
  }
  // esta variable es para luego inicializar el modal y poder usarlo en toda la función
  let $modalAgregarProducto;

  // variable donde va a quedar guardado edescuento
  let descuento = 0;

  //funcion para separar por miles el precio
  let milesFuncion = (precio) =>
    "$ " + precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // funcion que suma el total de la venta
  function sumarTotal() {
    // Si el descuento no es un número o esta vacio, asignarle 0
    if (isNaN(descuento)) {
      descuento = 0;
    }
    const $filasTabla = document.querySelectorAll(".filaTabla");

    // Recorrer las filas y sumar los valores totales
    let totalVenta = 0;
    $filasTabla.forEach(($fila) => {
      // Convertir el valor total de la fila a un número y eliminar el símbolo de moneda y el separador de miles
      const valorFila = parseInt(
        $fila
          .querySelector("#tablaVTotal")
          .textContent.replace("$ ", "")
          .replace(/\./g, "")
      );
      totalVenta += valorFila;
    });

    document.querySelector("#totalVenta").dataset.totalfordescuento =
      totalVenta;

    // Restar el descuento
    totalVenta -= descuento;

    // Mostrar el total de la venta en el elemento totalVenta
    document.querySelector("#totalVenta").textContent =
      "$ " + totalVenta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // agregarle un dataset al boton cobrar para poder enviar el total de la venta
    document.querySelector("#totalVenta").dataset.total = totalVenta;
    return;
  }

  // lanzar una ventana modal con los inputs para agregar un nuevo producto
  function modalAgregarProducto(ID) {
    // si el ID es de un servicio tecnico, no se puede agregar mas de uno
    // comprueba si el ID es de un servicio tecnico
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
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" tabindex="-1"></button>
                    </div>
                    <div class="modal-body">
                        <form id="form-modal-add-product">
                            <div class="mb-3">
                                <label for="idProducto" class="col-form-label">ID:</label>
                                <input type="text" class="form-control" name="Modalid" id="ModalidProducto" value=${ID} disabled>
                            </div>
                            <div class="mb-3">
                                <label for="descripcionProducto" class="col-form-label">Descripcion:</label>
                                <input type="text" class="form-control" name="descripcion" id="descripcionProducto" value="${
                                  descripcion != "" ? descripcion : ""
                                }">
                            </div>
                            <div class="mb-3">
                                <label for="precioProducto" class="col-form-label">Precio:</label>
                                <input type="number" class="form-control" name="precio" id="precioProducto" value="${
                                  precio != 0 ? precio : ""
                                }">
                            </div>
                            <div class="mb-3">
                                <label for="cantidadProducto" class="col-form-label">Cantidad Inventario:</label>
                                <input type="number" class="form-control" name="cantidadInventario" id="cantidadInventarioProducto" value=${
                                  isSt ? "1" : ""
                                } ${isSt ? "disabled" : ""}>
                            </div>
                            <div class="mb-3">
                                <label for="proveedorProducto" class="col-form-label">Proveedor: jyr, asf, mercadolibre, amazon, otro.</label>
                                <input type="text" class="form-control" name="proveedor" id="proveedorProducto" value="${
                                  proveedor != "" ? proveedor : ""
                                }" ${proveedor != "" ? "disabled" : ""} />
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
    // inicializamos una instancia del modal y lo mostramos
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

  // funcion que retorna un elemento tr con los datos del producto
  function newFilaTablaVenta(props) {
    const $filaTabla = document.createElement("tr");
    $filaTabla.classList.add("filaTabla");
    $filaTabla.id = "filaTabla";
    $filaTabla.dataset.id = props.id;
    $filaTabla.innerHTML = /*html*/ `
                <td data-th="ID: " scope="row" data-id=${props.id}>${
      props.id
    }</td>
                <td data-th="Descripcion: " data-id=${props.id}>${
      props.descripcion
    }</td>
                <td data-th="Cantidad: " data-id=${
                  props.id
                } ><input class="filaCantidad" type="number" min="1" value= "1" data-id=${
      props.id
    } data-inventario=${props.inventario} /></td>
                <td data-th="V. Unitario: " id="tablaVUnitario" data-id=${
                  props.id
                } data-price=${props.precio}>${milesFuncion(props.precio)}</td>
                <td data-th="V. Total: " id="tablaVTotal" data-id=${
                  props.id
                }>${milesFuncion(props.precio)}</td>
                <td data-th="Accion: " data-id=${
                  props.id
                }><button id="btnEliminar" class="btn btn-danger" type="submit" data-id=${
      props.id
    }>Eliminar</button></td>
        `;
    return $filaTabla;
  }

  // busqueda de productos por id
  $busquedaID.addEventListener("change", async (e) => {
    // revisar si el input esta vacio, si lo esta retornar
    if (e.target.value === "") {
      return;
    }

    //realizar consulta a la base de datos productos por id
    let result = await buscarProducto(e.target.value);

    if (!result) {
      // lanzar una ventana modal con los inputs para agregar un nuevo producto
      Swal.fire({
        title: "Quieres agregar un nuevo producto?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `No Guardar`,
      }).then((result) => {
        // si el usuario confirma guardar el producto, se abre el modal para agregar el producto
        if (result.isConfirmed) {
          const ID = $busquedaID.value;
          modalAgregarProducto(ID);
        } else if (result.isDenied) {
          // si el usuario no quiere guardar el producto, se limpia el input de busqueda
          Swal.fire("Intenta Buscar por Descripcion", "", "info");
          $busquedaID.value = "";
          $busquedaDescripcion.focus();
        } else {
          $busquedaID.value = "";
          $busquedaDescripcion.focus();
        }
      });
      return;
    }

    // si el producto existe, se agrega a la tabla de venta
    $busquedaDescripcion.value = result.descripcion;

    result = {
      id: result.id,
      descripcion: result.descripcion,
      precio: result.precio,
      inventario: result.cantidad_inventario,
    };

    // revisar si el producto ya existe en la tabla de venta
    const existe = await revisarProducto(result.id);
    if (existe) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El producto ya existe en la tabla de venta!",
      });
      // limpiar el input de busqueda
      $busquedaID.value = "";
      $busquedaDescripcion.value = "";
      $busquedaID.focus();
      return;
    }

    // si no existe agregarlo a la tabla de venta
    const $filaTabla = newFilaTablaVenta(result);
    $bodyTabla.appendChild($filaTabla);
    // sumar el total de la venta
    sumarTotal();
    // limpiar el input de busqueda
    $busquedaID.value = "";
    $busquedaDescripcion.value = "";
    $busquedaID.focus();
  });

  // buscar producto por descripcion
  $busquedaDescripcion.addEventListener("input", async (e) => {
    // revisar si el input esta vacio o si es menor a 3, si lo esta retornar
    if (e.target.value === "" || e.target.value.length < 3) {
      return;
    }

    //realizar consulta a la base de datos productos por descripcion
    let resultado = await buscarProductoDescripcionLike(e.target.value);

    const $resultadosDescripcion = document.querySelector(
      "#resultadosDescripcion ul"
    );

    //eliminar clase d-none para mostrar los resultados
    $resultadosDescripcion.classList.remove("d-none");

    //limpiar el ul para que no se repitan los resultados
    $resultadosDescripcion.innerHTML = "";

    //si no hay resultados, mostrar mensaje
    if (resultado.length === 0) {
      $resultadosDescripcion.innerHTML = /*html*/ `<li class="list-group-item" tabindex="-1">No hay resultados</li>`;
      return;
    }

    //si hay resultados, mostrarlos
    resultado.forEach((producto) => {
      const $li = document.createElement("li");
      $li.classList.add("list-group-item");

      // la clase list-resultados-busqueda es para poder seleccionar con la tecla enter
      $li.classList.add("list-resultados-busqueda");
      $li.dataset.id = producto.id;

      //añadirle tabindex para que se pueda seleccionar con el teclado
      $li.tabIndex = 0;
      $li.textContent = producto.descripcion;
      $resultadosDescripcion.appendChild($li);
    });
  });

  document.addEventListener("keydown", (e) => {
    // cuando el evento keydown se dispara en la lista de resultados de busqueda
    if (e.target.classList.contains("list-resultados-busqueda")) {
      if (e.key === "Enter") {
        const $elementoFocus = document.activeElement;
        $busquedaDescripcion.value = $elementoFocus.textContent;
        console.log($elementoFocus);
        $busquedaID.focus();
        const $resultadosDescripcion = document.querySelector(
          "#resultadosDescripcion ul"
        );
        $resultadosDescripcion.classList.add("d-none");

        if (e.target.textContent == "No hay resultados") {
          $busquedaDescripcion.value = "";
          $busquedaDescripcion.focus();
          return;
        }
        $busquedaID.value = $elementoFocus.dataset.id;

        //disparar el evento change del input de busqueda por id
        $busquedaID.dispatchEvent(new Event("change"));
      }
    }
    if (e.key === "Escape") {
      const $resultadosDescripcion = document.querySelector(
        "#resultadosDescripcion ul"
      );
      $resultadosDescripcion.classList.add("d-none");
    }
  });

  document.addEventListener("change", async (e) => {
    // si se cambia el input de descuento en la tabla de venta se recalcula el total
    if (e.target.classList.contains("inputDescuento")) {
      if (document.querySelector("#tablaVTotal") === null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No hay productos en la tabla de venta",
        });
        //input descuento en 0
        document.querySelector(".inputDescuento").value = null;
        descuento = 0;
        return;
      }
      sumarTotal();

      descuento = parseInt(e.target.value);
      //si el descuento es mayor a lo que da el total de la venta retornar
      let totalVentaD = parseInt(
        document.querySelector("#totalVenta").dataset.totalfordescuento
      );
      if (parseInt(e.target.value) > totalVentaD) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El descuento no puede ser mayor al total de la venta",
        });
        //input descuento en 0
        document.querySelector(".inputDescuento").value = null;
        descuento = 0;
      }
      // sumar el total de la venta
      sumarTotal();
    }
  });

  document.addEventListener("input", (e) => {
    // si se cambia el input de cantidad en la tabla de venta se recalcula el total
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
      sumarTotal();
    }

    // para que el id busqueda se ponga en mayusculas instantaneamente
    if (e.target.id === "busquedaID" || e.target.id === "idProducto") {
      e.target.value = e.target.value.toUpperCase();
    }
  });

  document.addEventListener("click", async (e) => {
    // eliminar fila de la tabla
    if (e.target.id === "btnEliminar") {
      // console.log(e.target.parentElement.parentElement);
      // eliminar el elemento padre del elemento padre del elemento al que se le dio click
      e.target.parentElement.parentElement.remove();

      //focus en el input de busqueda por id
      $busquedaDescripcion.value = "";
      $busquedaID.value = "";
      $busquedaID.focus();

      //input descuento en 0
      document.querySelector(".inputDescuento").value = null;
      descuento = 0;

      // sumar el total de la venta
      sumarTotal();

      return;
    }

    // cuando se le de click a un elemento de la lista de resultados de busqueda,
    // se pone el texto del elemento en el input de busqueda por descripcion y se oculta la lista
    if (e.target.classList.contains("list-group-item")) {
      document
        .querySelector("#resultadosDescripcion ul")
        .classList.add("d-none");
      if (e.target.textContent == "No hay resultados") {
        $busquedaDescripcion.value = "";
        $busquedaDescripcion.focus();
        return;
      }
      $busquedaID.value = e.target.dataset.id;
      $busquedaDescripcion.value = e.target.textContent;

      // esto es para que se dispare el evento change del input de busqueda por ID
      $busquedaID.dispatchEvent(new Event("change"));
      return;
    }

    // para volver a habilitar los inputs de cliente
    if (
      e.target.id === "validationCustom01" ||
      e.target.id === "validationCustom05"
    ) {
      document.querySelector("#btnGuardarCliente").disabled = false;
      document.getElementById("validationCustom01").disabled = false;
      document.getElementById("validationCustom05").disabled = false;
      return;
    }

    //guardar producto en la ventana modal
    if (e.target.id === "btnAgregarProducto") {
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
        proveedor: $proveedor,
      };

      // retornar si alguno de los campos esta vacio
      console.log($id, $descripcion, $precio, $inventario, $proveedor);
      if (
        $id == "" ||
        $descripcion == "" ||
        $precio == "" ||
        $inventario == "" ||
        $proveedor == ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Todos los campos son obligatorios",
        });

        // hacer focus en el primer input vacio
        if ($id === "") {
          $formModal.Modalid.focus();
        } else if ($descripcion === "") {
          $formModal.descripcion.focus();
        } else if ($precio === "") {
          $formModal.precio.focus();
        } else if ($inventario === "") {
          $formModal.cantidadInventario.focus();
        } else if ($proveedor === "") {
          $formModal.proveedor.focus();
        }

        return;
      }

      // guaradar producto en la base de datos
      let result = await guardarProducto(dataNewProduct);
      console.log(result);
      if (result) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "producto agregado",
          showConfirmButton: false,
          timer: 1500,
        });
        $formModal.reset();
        //ocultar modal de agregar producto
        $modalAgregarProducto.hide();

        // agregar producto a la tabla de productos
        dataNewProduct = {
          id: $id,
          descripcion: $descripcion,
          precio: $precio,
          inventario: $inventario,
        };
        let $bodyTabla = document.querySelector("#bodyTabla");
        $bodyTabla.appendChild(newFilaTablaVenta(dataNewProduct));

        // limpiar y hacer focus en el input de busqueda por id
        $busquedaDescripcion.value = "";
        $busquedaID.value = "";
        $busquedaID.focus();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El producto no se agregó, intentalo nuevamente",
        });
        $formModal.reset();
        //ocultar modal de agregar producto
        $modalAgregarProducto.hide();

        // limpiar y hacer focus en el input de busqueda por id
        $busquedaID.value = "";
        $busquedaID.focus();
      }
      return;
    }

    if (e.target.id === "btnCobrarVenta") {
      if (document.querySelector("#tablaVTotal") === null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No hay productos agregados",
        });
        return;
      }
      // verificar que usuario esta realizando la venta
      console.log(estadoSesion.email);

      // obtener los productos de la venta
      let productosVenta = [];
      let $filasTabla = document.querySelectorAll("#tablaVenta tbody tr");
      $filasTabla.forEach((fila) => {
        let producto = {
          id: fila.children[0].textContent,
          descripcion: fila.children[1].textContent,
          precio: fila.children[2].textContent,
          cantidad: fila.children[3].textContent,
          total: fila.children[4].textContent,
        };
        productosVenta.push(producto);
      });

      // obtener el total de la venta en numero
      let total = parseInt(
        document.querySelector("#totalVenta").getAttribute("data-total")
      );
      //cliente, productos, total, descuento, vendedor
      let dataVenta = {
        cliente: document.querySelector("#validationCustom01").value,
        productos: productosVenta,
        total,
        descuento: document.querySelector(".inputDescuento").value,
        vendedor: estadoSesion.email,
      };

      let res = await guardarVenta(dataVenta);
      console.log(res);

      //limpiar los elementos de la venta
      document.getElementById("bodyTabla").innerHTML = "";
      sumarTotal();

      // habilitar el boton de agregar cliente
      document.getElementById("btnGuardarCliente").disabled = false;
      document.getElementById("validationCustom01").disabled = false;
      document.getElementById("validationCustom05").disabled = false;

      //limpiar los campos de la venta
      document.getElementById("validationCustom01").value = "";
      document.getElementById("validationCustom05").value = "";

      document.getElementById("validationCustom05").focus();

      // desmontar la funcion VentaProducto
      const element = document.getElementById("ventaproducto");
      element.classList.add("d-none");
      // eliminar todos los eventos de la ventana

      unmount();
    }
  });
}
