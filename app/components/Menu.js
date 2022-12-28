export function Menu(props){
    const $menu = document.createElement('div');
    $menu.classList.add('menu');
    $menu.innerHTML = /*html */`
        <div id="mySidebar" class="sidebar">
            <button class="cerrarBtn">×</button>
            <a class="itemsA" href="#/dashboard">Innova</a>
            <hr />
            <a class="itemsA" href="#/ventas">Ventas</a>
            <a class="itemsA" href="#/st">Servicios Tecnicos</a>
            ${props == true ? `<a class="itemsA" href="#/inventario">Inventario</a>` : ""}
        </div>
        <div id="main">
            <h2>Aqui irian las cosas generadas</h2>
            <p>Content...</p>
        </div>
    `;
    
    return $menu;
}