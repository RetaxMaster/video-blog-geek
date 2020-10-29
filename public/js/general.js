$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // Adicionar el service worker
  navigator.serviceWorker.register("notificaciones-sw.js")
  .then(registro => {
    console.log("Service worker registrado");
    firebase.messaging().useServiceWorker(registro);
  })
  .catch(error => {
    console.error(`Error al registrar el service worker ${error}`);
  });

  // Init Firebase nuevamente
  firebase.initializeApp(varConfig);

  // Registrar LLave publica de messaging
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey("BIWuvmy6tFPsgyH4pabzlCL-8HEfohTODO5rPpzb1upuLXdt1IqG2clkIStxtomLIRzPF-OenWrIT1mKNvo73BQjvjg");

  // Solicitar permisos para las notificaciones
  messaging.requestPermission()
  .then(() => {
    console.log("Si dio permiso");
    return messaging.getToken();
  })
  .then(token => {

    const db = firebase.firestore();
    
    db.collection("token").doc(token).set({ token })
    .catch(error => {
      console.log(`Error al insertar el token en la base de datos ${error}`);
    });

  });

  // Obtener el token cuando se refresca
  messaging.onTokenRefresh(() => {
    messaging.getToken().then(token => {

      console.log("token se ha renovado");

      const db = firebase.firestore();
    
      db.collection("token").doc(token).set({ token })
      .catch(error => {
        console.log(`Error al insertar el token en la base de datos ${error}`);
      });

    });
  });

  // Recibir las notificaciones cuando el usuario esta foreground (Cuando el usuario se encuentra en la aplicación)
  messaging.onMessage(payload => {
    Materialize.toast(`Ya tenemos un nuevo post. Revísalo, se llama ${payload.data.titulo}`, 6000);
  });

  // Listening real time
  const post = new Post();
  post.consultarTodosPost();

  // Firebase observador del cambio de estado, se ejecuta cada vez que cambia el estado del usuario (login, logout)
  firebase.auth().onAuthStateChanged(user => {

    if (user) {
      $('#btnInicioSesion').text('Salir');
      if(user.photoURL)
        $('#avatar').attr('src', user.photoURL);
      else
        $('#avatar').attr('src', 'imagenes/usuario_auth.png');

    }
    else {

      $('#btnInicioSesion').text('Iniciar Sesión');
      $('#avatar').attr('src', 'imagenes/usuario.png')

    }

  });

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {

    // Así obtenemos al usuario actual
    const user = firebase.auth().currentUser;

    if (user) {

      return firebase.auth().signOut()
        .then(() => {
          // Colocamos el avatar por defecto
          $('#avatar').attr('src', 'imagenes/usuario.png');
          Materialize.toast(`SignOut Correcto!`, 4000);
        })
        .catch(error => {
          Materialize.toast(`Error al realizar SignoOut ${error}`, 4000);
        });

    }
    

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  // Hacemos el logout dandole click al avatar
  $('#avatar').click(() => {
    firebase.auth().signOut()
      .then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png');
        Materialize.toast(`SignOut correcto`, 4000);
      })
      .catch(error => {
        Materialize.toast(`Error al realizar el SignOut ${error}`, 4000);
      });
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')
    post.consultarTodosPost();
  })

  $('#btnMisPost').click(() => {

    const user = firebase.auth().currentUser;

    if (user) {

      post.consultarPostxUsuario(user.email)
      $('#tituloPost').text('Mis Posts') 

    }
    else {
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)   
    }
    
  })
})
