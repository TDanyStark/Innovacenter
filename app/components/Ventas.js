import { Cliente } from "./Cliente.js";
import { VentaProducto } from "./VentaProducto.js";

export function Ventas() {
    const $MAIN = document.getElementById("main");
    const $ventas = document.createElement("div");
    $ventas.classList.add("ventas");
    $ventas.id = "ventas";
    $MAIN.appendChild($ventas);

    
    Cliente();
    VentaProducto();
    console.log("inicio suscripción")
    window.editor.suscribir('clienteEncontrado', VentaProducto);
    console.log("fin suscripción")

}
