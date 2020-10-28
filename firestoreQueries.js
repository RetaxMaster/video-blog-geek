const db = firebase.firestore();

/**Insertar un documento con la capacidad de asignar yo el nombre */
db.collection("collection_name").doc("doc_name").set({
    //data
})

/**Insertar un documento con el nombre autogenerado por firestore */
db.collection("collection_name").add({
    //data
})

/**Capacidad de hacer operaciones en paralelo usando batch */
const batch = db.batch();

const ref1 = db.collection("collection_name").doc("doc_name1");
batch.set(ref1, { titulo: "123456789" }); // <- Solo lo estamos adjuntando al batch

const ref2 = db.collection("collection_name").doc("doc_name2");
batch.set(ref2, { titulo: "987654321" });

const ref3 = db.collection("collection_name").doc("doc_name3");
batch.set(ref3, { titulo: "456789" });

// Esto si lo ejecuta
batch.commit()
.then(() => {
    console.log("Btch correcto");
})
.catch(error => {
    console.log(error);
});

/**Adicionar propiedades a los documentos (Si usamos set va a borrar lo que teníamos, de esta menta podemos "pushear" un nuevo atributo) */
this.db.collection("collection_name").doc("doc_name").set({
    // Campos a agregar
},{
    merge: true // Junta estos campos a los campos que ya tiene el documento
});

/**Actualizar campos */
let refUser = this.db.collection("collection_name").doc("doc_name");

refUser.update({
    //fieldsToUpdate
    field: "value"
})

/**Actualizar objetos */
let refUser = this.db.collection("collection_name").doc("doc_name");

refUser.update({
    //fieldsToUpdate
    "document.field": "value"
})

/**Eliminar campos especificos */
this.db.collection("collection_name").doc("doc_name").update({
    //fieldsToDelete
    field: firebase.firestore.FieldValue.delete()
});

/**Eliminar todo un documento */
this.db.collection("collection_name").doc("doc_name").delete();

/**Consulta directa (No realtime) */
this.db.collection("collection_name").doc("doc_name").get().then(respDoc => {
    console.log(respDoc.data());
});

/**Consulta directa usando filtros (No realtime) */
this.db.collection("collection_name")
.where("field", "==", "value") // Puede ser un solo where (No es permitido el !=)
.where("field", "==", "value") // Si agregamos otro where se toma como AND
.get()
.then(respDoc => {
    console.log(respDoc.data());
});

/**Consulta directa con ordenamientos y límites (No realtime) */
this.db.collection("collection_name")
.orderBy("field", "asd")
.limit(2)
.get()
.then(respDoc => {
    console.log(respDoc.data());
});