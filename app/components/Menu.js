export function Menu(props){
    const $menu = document.createElement('div');
    $menu.classList.add('menu');
    $menu.innerHTML = /*html */`
        <div id="mySidebar" class="sidebar">
            <button class="cerrarBtn">×</button>
            <a class="itemsA" href="#/dashboard">Innova</a>
            <hr />
            <a class="itemsA" href="#/ventas">Ventas y ST</a>
            <a class="itemsA" href="#/Services">Services</a>
            <a class="itemsA" href="#/Clients">Clients</a>
            ${props == true ? `<a class="itemsA" href="#/Contact">Contact</a>` : ""}
        </div>
        <div id="main">
            <h2>Aqui irian las cosas generadas</h2>
            <p>Content...</p>
        </div>
    `;
    
    return $menu;
}