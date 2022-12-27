// define la función cliente
const cliente = () => {
    // lógica para encontrar al cliente
  
    // publica el evento "clienteEncontrado" al objeto editor global
    let res = confirm('¿Desea buscar un cliente?');
    if (res == true) {
        console.log('publicando evento');
        window.editor.publicar('clienteEncontrado', {nombre: 'Juan', apellido: 'Perez'});
        console.log('Fin publicando evento');

    }

};