export function VentaProducto(props) {
    console.log(props)
    // este coindicional es para que no se ejecute la función si no hay un cliente seleccionado
    if(props == undefined){
        return;
    }
    const $VENTAS = document.getElementById("ventas");
    const $TABLAVENTA = document.createElement("div");
    $TABLAVENTA.classList.add("ventaproducto");
    $TABLAVENTA.id = "ventaproducto";
    $TABLAVENTA.innerHTML = /*html*/ `
            <h3>Busqueda de Productos</h3>
            <hr />
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
                <tbody id="bodyTablaBusqueda">
                    <tr>
                        <th scope="row"><input class="busquedaID" id="busquedaID" type="text" /></th>
                        <td><input class="busquedaDescripcion" id="busquedaDescripcion" type="text" /></td>
                        <td><input id="busquedaCantidad" type="number" value= "1" /></td>
                        <td id="busquedaVUnitario"></td>
                        <td id="busquedaVTotal"></td>
                        <td><button id="btnAgregar" class="btn btn-success" type="submit">Agregar</button></td>
                    </tr>
                </tbody>
            </table>
            <br />
            <h3>Venta o ST</h3>
            <hr />
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
    `;
    $VENTAS.appendChild($TABLAVENTA);

    const $bodyTabla = document.getElementById("bodyTabla");
    const $busquedaID = document.getElementById("busquedaID");
    const $busquedaDescripcion = document.getElementById("busquedaDescripcion");
    
    function newFilaTablaVenta(props){
        const $filaTabla = document.createElement("tr");
        $filaTabla.classList.add("filaTabla");
        $filaTabla.id = "filaTabla";
        $filaTabla.innerHTML = /*html*/ `
            <th scope="row"><input class="tablaID" id="tablaID" type="text" /></th>
            <td><input class="tablaDescripcion" id="tablaDescripcion" type="text" /></td>
            <td><input id="tablaCantidad" type="number" value= "1" /></td>
            <td id="tablaVUnitario"></td>
            <td id="tablaVTotal"></td>
            <td><button id="btnEliminar" class="btn btn-danger" type="submit">Eliminar</button></td>
        `;
        return $filaTabla;
    }
    $busquedaID.addEventListener("change", (e) => {
        console.log(e.target.value);
        const $filaTabla = newFilaTablaVenta();
        $bodyTabla.appendChild($filaTabla);
    });

}