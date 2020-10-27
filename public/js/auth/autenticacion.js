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
    //$('#avatar').attr('src', result.user.photoURL)
    //$('.modal').modal('close')
    //Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
  }

  authCuentaFacebook () {
    //$('#avatar').attr('src', result.user.photoURL)
    //$('.modal').modal('close')
    //Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
  }

  authTwitter () {
    // TODO: Crear auth con twitter
  }
}
