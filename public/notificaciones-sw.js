importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js')

// Recibir las notificaciones cuando el usuario esta background
firebase.initializeApp({
    projectId: "blog-geek-platzi-42b20",
    messagingSenderId: "992245186098"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {

    const tituloNotificacion = "Ya tenemos un nuevo post";
    const opcionesNotificacion = {
        body: payload.data.titulo,
        icon: "icons/icon_new_post.png",
        click_action: "https://blog-geek-platzi-42b20.web.app/"
    }

    return self.registration.showNotification(tituloNotificacion, opcionesNotificacion);

});