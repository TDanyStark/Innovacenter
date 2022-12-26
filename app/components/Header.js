export function Header(){
    const $header = document.createElement('header');
    $header.classList.add('header');
    $header.innerHTML = `
    
     <button class="openbtn">&#9776;</button>
        <h1>Dashboard</h1>
        <button type="button" class="btn btn-primary CerrarSesionBtn">Cerrar Sesion</button>
    
    `;
    return $header;
}