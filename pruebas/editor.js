// define el objeto editor como una variable global
window.editor = {
    suscriptores: {},
  
    suscribir(evento, suscriptor) {
      if (!this.suscriptores[evento]) {
        this.suscriptores[evento] = [];
      }
  
      this.suscriptores[evento].push(suscriptor);
    },
  
    publicar(evento, datos) {
      if (!this.suscriptores[evento]) {
        return;
      }
  
      this.suscriptores[evento].forEach(suscriptor => suscriptor(datos));
    },
  };