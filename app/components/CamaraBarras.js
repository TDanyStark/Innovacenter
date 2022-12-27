
export function CamaraBarras(){
    const $VENTAS = document.getElementById("ventas");
    const $CAMARABARRAS = document.createElement("div");
    $CAMARABARRAS.classList.add("camarabarras");
    $CAMARABARRAS.innerHTML = /*html*/ `
        <video id="camera" autoplay></video>
        <h2 id="resul"></h2>
    `;

    $VENTAS.appendChild($CAMARABARRAS);
      const camera = document.getElementById('camera');
      let $H2 = document.getElementById('resul');

      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {

        console.log("Let's get this party started")
      }else{
        $H2.textContent = "todo mal"
        console.log("No camera available.")
      }

      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        // El usuario ha aceptado el permiso, se puede acceder al stream de la cámara
        camera.srcObject = stream;

      }).catch(function(error) {
        // El usuario ha denegado el permiso o ha ocurrido un error
        $H2.textContent = error
       });


        Quagga.init({
            inputStream: {
              type: 'LiveStream',
              target: camera
            },
            decoder: {
              readers: ['code_128_reader']
            }
          }, function(err) {
            if (err) {
              $H2.textContent = "iniciando mal"

              console.log(err);
              return;
            }
            console.log('Initialization finished. Ready to start');
            Quagga.start();
            $H2.textContent = "iniciando bien"
          });
          
          Quagga.onDetected(function(result) {
            console.log(result.codeResult.code);
            $H2.textContent = result.codeResult.code
          });

};