
export function VentaProducto() {
    const $VENTAS = document.getElementById("ventas");
    const $VENTAPRODUCTO = document.createElement("div");
    $VENTAPRODUCTO.classList.add("ventaproducto");
    $VENTAPRODUCTO.innerHTML = /*html*/ `
            <table id="tablaVentaProducto" class="table table-dark table-striped" style="display: none;">
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
                <tr>
                    <th scope="row">7854587985</th>
                    <td>Cargador Lenovo 20v 1.7A Squared</td>
                    <td><input id="tablaCantidad" type="number" value= "1" /></td>
                    <td>$ 75.000</td>
                    <td>$ 75.000</td>
                </tr>
            </tbody>
        </table>
    `;

    $VENTAS.appendChild($VENTAPRODUCTO);
}