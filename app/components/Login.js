export function Login(){
    const $login = document.createElement('div');
    $login.classList.add('login');
    $login.innerHTML = `
    <div id="contenedor">
        <div id="central">
            <div id="login">
                <div class="titulo">
                    Bienvenido a 
                    <p>Innova System</p>
                </div>
                <form id="loginform">
                    <input type="text" name="usuario" placeholder="Usuario" required>
                    
                    <input type="password" placeholder="Contraseña" name="password" required>
                    
                    <button type="submit" title="Ingresar" name="Ingresar">Login</button>
                </form>
                
            </div>
            <div class="inferior">
                
            </div>
        </div>
    </div>
    `;
    
    return $login;
}