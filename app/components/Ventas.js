import { clienteFound } from "../helpers/firebase.js";
import { Cliente } from "./Cliente.js";
import { VentaProducto } from "./VentaProducto.js";
import { CamaraBarras } from "./CamaraBarras.js";

export function Ventas() {
    const $MAIN = document.getElementById("main");
    const $ventas = document.createElement("div");
    $ventas.classList.add("ventas");
    $ventas.id = "ventas";
    $MAIN.appendChild($ventas);
    Cliente();
    CamaraBarras();
    VentaProducto();
}
