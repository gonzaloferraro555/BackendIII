import Users from "../../src/dao/Users.dao.js"; //Importo la clase Users.
import mongoose from "mongoose"; //Cuando el test se ejecute, necesito acceder a la DB para probar, por lo que necesito conectarme a ella.
import {expect} from "chai";       /*Chai permitirá conectar palabras del inglés, con el fin de poder realizar una prueba más entendible, 
                                    algunos de estos conectores son:
                                    -to: conector inicial para armar la frase.
                                    -be: para identificar que el elemento sea algo en particular.
                                    -have: para corroborar que el valor a evaluar tenga algo.
                                    -and: para encadenar validaciones.              
                                    
                                    -not: para realizar una negación.
                                    -deep: Para evaluaciones profundas.
                                    -equal: para hacer una comparación de igualdad.
                                    -property: para apuntar a alguna propiedad de un objeto.
                                    */



mongoose.connect(`mongodb+srv://admin:43443534254011@codercluster.hajze8d.mongodb.net/BackendIII`);
/*Aunque me conecte a la DB para testear, tené en cuenta que accedo a una DB de testeo, de developers,
 y que el servidor nunca se levanta, simplemente ejecuto mecanismos y funcionalidades para ver como funcionan.
 De igual forma que con el servidor levantado, cuando ejecuto el test, la conexión a Mongo queda establecida,
 por lo que al terminar el testeo debo cancelar el testeo y su conexión con la DB, sería un "cancelar el trabajo",
 para cerrar la conexión con la DB, con CTRL+C en la terminal. Ver línea 51, seteo la desconexión para evitar esto.*/





 //La función sirve para describir nuestro test, para eso el string.
 /*Esto dará okey en el test, y no testeo nada, sólo con un console.log(), asique el testing es puramente verificaciones
 propias del desarrollador, que pueden contener errores de no confeccionarse adecuadamente. 
 Ahora le agregamos unas condiciones para que testee como corresponde. */
 describe("Test UserDao",()=>{
    const userDao = new Users;

    let userTest; //Para que cada creación del testeo se guarde aquí, al dejarla global, puedo usar el mismo usuario creado en otros expect. Como va a ir cambiando la creo con let.
    //Es global pero para los testeos, no para el archivo completo, igual puedo usarla como tal sin necesidad de ingresarla como parámetro?.

    //Función opcional. Se ejecutan antes y después de todos los test.
    before(()=>{
        console.log("Inicio de todos los test. Se ejecuta antes que todos los testeos dentro del describe.");
    })//En este caso si lo codeaba al final, sale antes de todos los test, pero LUEGO del describe,
        //es decir será la primer ejecución luego del comienzo de los testeos.

    
    //Se ejecuta antes DE CADA test dentro del describe
    beforeEach(()=>{
        console.log("Se ejecuta antes de cada test individual dentro del describe.");
    })


    //De igual manera, tengo el after, y el afterEeach.
    after(()=>{
        console.log("Se ejecuta al final de todos los testeos dentro del describe.")
        mongoose.disconnect();
    })//Aprovecho para prolijamente al finalizar los test, desconectarme de la DB. Evita que tenga que cancelar el proceso, así no queda pendiente por la conexión a Mongo.

    afterEach(()=>{
        console.log("Se ejecuta al final de cada test dentro del describe.")
    })



    //Test Individual
    it("Debe retornar todos los usuarios",async ()=>{
        //console.log("Todos los usuarios.");
        const users = await userDao.get();
        //Busco obtener un arreglo, con usuarios. Para verificar el tipo usamos una herramienta de chai.
        //Esta función verifica que el tipo del objeto obtenido, coincida con la tipificación que espero en el string.
        //expect(users).to.be.an("object"); //Daría error.
        //El tilde es para el test individual completo, no por cada condición del expect.
        expect(users).to.be.an("array");
        expect(users).to.be.not.an("object");

        //console.log(users); No lo ejecuto para no explotar la terminal de datos.
    })

    it("Debe crear y retornar un usuario",async()=>{
        const newUser={
            first_name:"Pepe Test",
            last_name:"Second name test",
            email:"emailtest14@gmail.com",
            password:"123",
            age:30,
            birthDate: new Date()
        }
        /*Tanto age como birthDate, no son tomados por el create de Mongo, porque no forman
        parte del schema DE User. Lo agregamos para chequear que no hayan sido agregados,
        por lo que puedo controlar que age no sea una propiedad, como en la línea 69 o 72.*/

        const user = await userDao.save(newUser); //Es el dao para crear usuarios.

        userTest = user; //Uso el usuario de este test, para el resto de los testeos. La idea es no acceder a la DB para corroborar.

        expect(user).to.be.an("object");
        expect(user.first_name).to.be.equal(newUser.first_name).and.to.be.an("string");
        expect(user.last_name).to.be.equal(newUser.last_name);
        expect(user.password).to.be.equal(newUser.password);
        expect(user).to.have.property("_id");

        //negaciones
        expect(user).to.not.have.property("age");
        expect(user).to.not.have.property("birthDate");//Ojo, me refiero siempre en string, pero a vi del objeto.
        expect(user).to.not.be.null;
        expect(user).to.not.be.an("array");
        expect(user).to.not.have.property("age");
        //Si corro el test varias veces, sólo dará okey en la primera, porque en la segunda y siguientes dará duplicación de emails en la creación del usuario.
        //Ojo, estoy generando modificaciones en la DB asique debe ser una Db de testeo.
        console.log(user);
    }
    //Si no le defino el callback function el test individual me aparece como pending.
    //La idea de pasar el test es que ningun expect de en falso.
    )

    it ("Debe retornar un usuario por su id", async ()=>{
        const user = await userDao.getBy(userTest._id);
        
        //De afirmación
        expect(user).to.be.an("object");
        expect(user).to.have.property("_id");
        expect(user.first_name).to.be.equal(userTest.first_name).and.to.be.an("string");
        expect(user.last_name).to.be.equal(userTest.last_name)

        //De negación
        expect(user).to.not.be.null;

    })

    it ("Debe actualizar un usuario", async()=>{

        const updateData = {
            first_name:"Juancito Actualizado",
            password:"123"
        }

        const user = await userDao.update(userTest._id,updateData); //Pq el dao de update recibe el id y el objeto con los campos de actualización.
        expect(user).to.be.an("object");
        expect(user).to.have.property("_id");
        expect(user.first_name).to.be.equal("Juancito Actualizado").and.to.be.an("string");
        expect(user.last_name).to.be.equal(userTest.last_name)
        expect(user.password).to.be.equal("123");

    })


    it("Debe eliminar un usuario",async()=>{
        await userDao.delete(userTest._id); //Debe eliminar el usuario de testeo.

        const user = await userDao.getBy(userTest._id); //Estará en este archivo pero no debería encontrarse en la DB.

        expect(user).to.be.null; //Con este test, termino el testeo de CRUD, al elimianar el usuario, puedo volver a ejecutar el testeo de chai y mocha
                                //sin tener que recibir el error del usuario que ya cree, porque en cada testeo, creo, actualizo y elimino.

    })
 })

 /*Chai y mocha van de la mano, mocha se encarga de ejecutar los archivos de testeo, y chai nos da las funciones que relizan las verificaciones de 
 aseveraciones (assertions). */