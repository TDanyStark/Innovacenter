import { App } from "./App.js";
import { Router } from "./components/Router.js";

// define el objeto editor como una variable global
// para manejar el tema de los eventos

const d = document;

d.addEventListener("DOMContentLoaded", App);
window.addEventListener("hashchange", Router);
