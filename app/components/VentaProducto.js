import { buscarProducto } from "../helpers/firebase.js";

export function VentaProducto(props) {
  console.log(props);
  // este coindicional es para que no se ejecute la función si no hay un cliente seleccionado
  if (props == undefined) {
    return;
  }
  const $VENTAS = document.getElementById("ventas");
  const $TABLAVENTA = document.createElement("div");
  $TABLAVENTA.classList.add("ventaproducto");
  $TABLAVENTA.id = "ventaproducto";
  $TABLAVENTA.innerHTML = /*html*/ `
        <div class="tablaBusqueda">
            <h3>Busqueda de Productos</h3>
            <hr />
            <table class="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col" style="display:none;">Cantidad</th>
                        <th scope="col" style="display:none;">Precio</th>
                        <th scope="col" style="display:none;">Proveedor</th>
                        <th scope="col" style="display:none;">Accion</th>
                    </tr>
                </thead>
                <tbody id="bodyTablaBusqueda">
                    <tr>
                        <td data-th="ID: " ><input class="busquedaID" id="busquedaID" type="text" /></td>
                        <td data-th="Descripcion: "><input class="busquedaDescripcion" id="busquedaDescripcion" type="text" /></td>
                        <td data-th="Cantidad: "  style="display:none;"><input id="busquedaCantidad" type="number" value= "1" /></td>
                        <td data-th="Precio: " id="precio" style="display:none;"></td>
                        <td data-th="Proveedor: " id="proveedor" style="display:none;"></td>
                        <td data-th="Accion: " style="display:none;"><button id="btnAgregar" class="btn btn-success" type="submit">Agregar</button></td>
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
                    <th scope="col">Cantidad</th>
                    <th scope="col">Valor Unitario</th>
                    <th scope="col">Valor Total</th>
                    <th scope="col">Accion</th>

                </tr>
                </thead>
                <tbody id="bodyTabla">
                </tbody>
            </table>
        </div>
    `;
  $VENTAS.appendChild($TABLAVENTA);

  const $bodyTabla = document.getElementById("bodyTabla");
  const $busquedaID = document.getElementById("busquedaID");
  const $busquedaDescripcion = document.getElementById("busquedaDescripcion");

  function newFilaTablaVenta(props) {
    const $filaTabla = document.createElement("tr");
    $filaTabla.classList.add("filaTabla");
    $filaTabla.id = "filaTabla";
    $filaTabla.innerHTML = /*html*/ `
            <td data-th="ID: " scope="row">12312</td>
            <td data-th="Descripcion: ">aqdasdas</td>
            <td data-th="Cantidad: "><input class="filaCantidad" type="number" value= "1" /></td>
            <td data-th="V. Unitario: " id="tablaVUnitario">12312</td>
            <td data-th="V. Total: " id="tablaVTotal">123123</td>
            <td data-th="Accion: "><button id="btnEliminar" class="btn btn-danger" type="submit">Eliminar</button></td>
    `;
    // <td data-th="ID: " scope="row">${props.id}</td>
    // <td data-th="Descripcion: ">${props.descripcion}</td>
    // <td data-th="Cantidad: "><input class="filaCantidad" type="number" value= "1" /></td>
    // <td data-th="V. Unitario: " id="tablaVUnitario">${props.precio}</td>
    // <td data-th="V. Total: " id="tablaVTotal">${props.total}</td>
    // <td data-th="Accion: "><button id="btnEliminar" class="btn btn-danger" type="submit">Eliminar</button></td>
    return $filaTabla;
  }
  $busquedaID.addEventListener("change", async (e) => {
    console.log(e.target.value);
    //realizar consulta a la base de datos productos
    let result = await buscarProducto(e.target.value);
    console.log(result);

    $busquedaDescripcion.value = result.descripcion;
    result = {
        id: result.id,
        descripcion: result.descripcion,
        precio: result.precio,
    }
    const $filaTabla = newFilaTablaVenta(result);

    // const $filaTabla = newFilaTablaVenta();
    // $bodyTabla.appendChild($filaTabla);
  });

  document.addEventListener("click", )
}
