import { Cliente } from "./Cliente.js";
import { VentaProducto } from "./VentaProducto.js";

export function Ventas() {
    const $MAIN = document.getElementById("main");
    const $ventas = document.createElement("div");
    $ventas.classList.add("ventas");
    $ventas.id = "ventas";
    $MAIN.appendChild($ventas);

    
    Cliente();
    
    // la primera vez que se carga la página, no hay cliente
    VentaProducto();

    // cuando se encuentra un cliente, se carga la tabla venta de productos
    window.editor.suscribir('clienteEncontrado', VentaProducto);

}
