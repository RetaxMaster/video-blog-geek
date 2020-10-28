class Post {

  constructor () {

      // Inicializa firestore, igual podemos pasarle un objeto con settings settings
      this.db = firebase.firestore();

  }

  crearPost (uid, emailUser, titulo, descripcion, imagenLink, videoLink) {

    // Inserción de documentos
    // Si usamos add, firestore general el id del documento, si uso .doc("id_personalizado").set() puedo para mi id personalizado
    return this.db.collection("posts").add({
        uid, titulo, descripcion, imagenLink, videoLink,
        autor: emailUser,
        fecha: firebase.firestore.FieldValue.serverTimestamp() // <- Obtenemos el timestamp del servidor
    })
    .then(refDoc => {
        console.log(`Id del post => ${refDoc.id}`);
    })
    .catch(error => {
        console.log(`Error creando el post => ${error}`);
    });
    
  }

  // Los obtendremos en realtime!
  consultarTodosPost () {

    // Agregamos el listener a la colección posts
    /*

    Firestore usa índices (Como el índice de un libro), para ir y tomar el dato directamente sin tener que leer los datos un por uno, para campos individuales, firestore crea un índice automáticamente, y es el que usa cuando hacemos ordenamientos individuales, pero cuando hacemos ordenamientos compuestos, tenemos que crear índices compuestos. Afortunadamente, el error que arroja firestore en la consola del navegador a falta de un índice viene acompañado de un enlace con la sugerencia de cuál índice crear:D!

    Importante: Por cada diferente combinación de wheres, orders, etc. Hay que crear un nuev índice compuesto, incluso si se editan los campos o algo
    
    */
    this.db.collection("posts")
    .orderBy("fecha", "asc")
    .orderBy("titulo", "asc")
    .onSnapshot(querySnapshot => {

        $("#posts").empty();

        if (querySnapshot.empty) {
            $("#posts").append(this.obtenerTemplatePotVacio());
        }
        else {
            querySnapshot.forEach(post => {
                
                let postHtml = this.obtenerPostTemplate(
                    post.data().autor,
                    post.data().titulo,
                    post.data().descripcion,
                    post.data().videoLink,
                    post.data().imagenLink,
                    Utilidad.obtenerFecha(post.data().fecha.toDate())
                );

                $("#posts").append(postHtml);

            });
        }

    });
    
  }

  consultarPostxUsuario (emailUser) {

    this.db.collection("posts")
    .orderBy("fecha", "asc")
    .where("autor", "==", emailUser) // <- Así se hacen los filtros
    .onSnapshot(querySnapshot => {

        $("#posts").empty();

        if (querySnapshot.empty) {
            $("#posts").append(this.obtenerTemplatePotVacio());
        }
        else {
            querySnapshot.forEach(post => {
                
                let postHtml = this.obtenerPostTemplate(
                    post.data().autor,
                    post.data().titulo,
                    post.data().descripcion,
                    post.data().videoLink,
                    post.data().imagenLink,
                    Utilidad.obtenerFecha(post.data().fecha.toDate())
                );

                $("#posts").append(postHtml);

            });
        }

    });
    
  }

  obtenerTemplatePostVacio () {
    return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
              frameborder="0"></iframe>
          </figure>
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`
  }

  obtenerPostTemplate (
    autor,
    titulo,
    descripcion,
    videoLink,
    imagenLink,
    fecha
  ) {
    if (imagenLink) {
      return `<article class="post">
            <div class="post-titulo">
                <h5>${titulo}</h5>
            </div>
            <div class="post-calificacion">
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-vacia" href="*"></a>
            </div>
            <div class="post-video">                
                <img id="imgVideo" src='${imagenLink}' class="post-imagen-video" 
                    alt="Imagen Video">     
            </div>
            <div class="post-videolink">
                <a href="${videoLink}" target="blank">Ver Video</a>                            
            </div>
            <div class="post-descripcion">
                <p>${descripcion}</p>
            </div>
            <div class="post-footer container">
                <div class="row">
                    <div class="col m6">
                        Fecha: ${fecha}
                    </div>
                    <div class="col m6">
                        Autor: ${autor}
                    </div>        
                </div>
            </div>
        </article>`
    }

    return `<article class="post">
                <div class="post-titulo">
                    <h5>${titulo}</h5>
                </div>
                <div class="post-calificacion">
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-vacia" href="*"></a>
                </div>
                <div class="post-video">
                    <iframe type="text/html" width="500" height="385" src='${videoLink}'
                        frameborder="0"></iframe>
                    </figure>
                </div>
                <div class="post-videolink">
                    Video
                </div>
                <div class="post-descripcion">
                    <p>${descripcion}</p>
                </div>
                <div class="post-footer container">
                    <div class="row">
                        <div class="col m6">
                            Fecha: ${fecha}
                        </div>
                        <div class="col m6">
                            Autor: ${autor}
                        </div>        
                    </div>
                </div>
            </article>`
  }
}
