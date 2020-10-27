class Autenticacion {
  autEmailPass (email, password) {

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {

        // Validamos que si esté verificado
        if (result.user.emailVerified) {
          $('#avatar').attr('src', 'imagenes/usuario_auth.png')
          Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000);
        }
        else {
          // Hacemos el sign out porque firebase guarda de todas maneras las credenciales en el browser
          firebase.auth().signOut();
          Materialize.toast(`Por favor realiza la verificación de la cuenta`, 5000);
        }

        $('.modal').modal('close')

      });
   
  }

  crearCuentaEmailPass (email, password, nombres) {
    // Retorna una promesa, en la oarte de autenticación solo podemos guardar, email, password, url de la foto y un nombre, si quieres guardar alguna otra información se hace en la base de datos
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {

        result.user.updateProfile({
          displayName: nombres
        })

        const configuracion = {
          url: "http://localhost:3000"
        }

        result.user.sendEmailVerification(configuracion).catch(error => {
          console.error(error);
          Materialize.toast(error.message, 4000)
        });

        firebase.auth().signOut();

        Materialize.toast(
          `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
          4000
        )
    
        $('.modal').modal('close')

      })
      .catch(error => {
        console.error(error);
        Materialize.toast(error.message, 4000)
      });
    
  }

  authCuentaGoogle () {

    // De esta forma podermos autenticar con Google
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {

        // Ya google hace el signin y nos devuelve el usuario
        $('#avatar').attr('src', result.user.photoURL)
        $('.modal').modal('close')
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000);

      })
      .catch(error => {
        Materialize.toast(`Error al autenticarse con Google ${error}`, 4000);
      });

  }

  authCuentaFacebook () {
    
    // Así podemos inicar sesión con Facebook después de hacer las configuraciones necesarios en la consola de Facebook (Poner la URL de retorno y obtener el app id y secret para ponerlo en firebase)
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {

        // Ya facebook hace el signin y nos devuelve el usuario
        $('#avatar').attr('src', result.user.photoURL)
        $('.modal').modal('close')
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000);

      })
      .catch(error => {
        Materialize.toast(`Error al autenticarse con Facebook ${error}`, 4000);
      });

  }

  authTwitter () {
    
    // Así podemos inicar sesión con Facebook después de hacer las configuraciones necesarios en la consola de Facebook (Poner la URL de retorno y obtener el app id y secret para ponerlo en firebase)
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {

        // Ya twitter hace el signin y nos devuelve el usuario
        $('#avatar').attr('src', result.user.photoURL)
        $('.modal').modal('close')
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000);

      })
      .catch(error => {
        Materialize.toast(`Error al autenticarse con Twitter ${error}`, 4000);
      });

  }
}
