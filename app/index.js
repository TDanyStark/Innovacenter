import { App } from "./App.js";
import { Router } from "./components/Router.js";

const d = document;

d.addEventListener("DOMContentLoaded", App);
window.addEventListener("hashchange", Router);
