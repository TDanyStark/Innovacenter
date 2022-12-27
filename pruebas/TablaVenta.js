// define la función tablaVenta
const tablaVenta = (datos) => {
    if(datos){
        console.log('Se ha encontrado un cliente', datos);
    }else{
        console.log('No se ha encontrado un cliente aun');
    }
    // suscribe la función tablaVenta al evento "clienteEncontrado" del objeto editor global
    console.log("inicio suscripción")
    window.editor.suscribir('clienteEncontrado', tablaVenta);
      console.log("fin suscripción")
  };
  