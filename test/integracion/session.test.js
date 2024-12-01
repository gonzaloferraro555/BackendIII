import { expect } from "chai";
import supertest from "supertest";


const request = supertest("http://localhost:8080/api/sessions");
const userRequest = supertest("http://localhost:8080/api/users");
/*Podría unificar más los endpoint´s y no dividir en archivos, es decir cortar la url en api, y completo
las url en el mismo archivo, mezcla un poco más la cuestión, pero también es correcto. */

//Cualquier modificación de código debe contemplarse tanto en la documentación con swagger como con los testeos.
//script: npm run test.

describe("Test de Integración Sessions",()=>{


    //Debe estar el servidor levantado, para poder acudir a los endpoints. Por eso puedo abrir otra terminal y ejecutar el npm run dev.

    let userSession;


    it("[POST] /api/sessions - Debe registrar un usuario",async()=>{ //La descripción es la que usa el profe, detallando el método.


        /*La devolución al cliente cuando accede a un endpoint se desarrolla en la capa de controllers,
        y lo que les llega es el res.send con el objeto que detalla vi status y el payload de resultado. Al cliente, este payload
        le llego en el body, para hacer con esa info lo que desee. */


        const newUser = {
                first_name:"Pepe Test",
                last_name:"Second name test",
                email:"emailtest22@gmail.com",
                password:"123"
        }


        const {status, body} = await request.post("/register").send(newUser); //Recordá que la url o enpoint se definió arriba, por lo menos la main branch de la ruta.
        console.log(status);//Contiene el código de respuesta.

        userSession = body.payload; //Para manejar el usuario registrado desde aquí. También me permitirá eliminarlo si deseo al 
                                    //finalizar el test. Si no hago esto con body.payload, no tengo el usuario de la DB con el _id,
                                    //sino que tengo el objeto que cree manualmente antes de ingresar en la DB porque usaría newUser.

        //console.log(body) //Contiene el payload que se envía al cliente. Lo comente todo porque me invade la respuesta con mucha info.
        expect(body.payload).to.be.an("object"); //Porqué debo aclarar el payload?, no debería también aclarar body.status?.
        expect(status).to.be.equal(201);
        expect(body.status).to.be.equal("success");
        expect(body.payload.email).to.be.equal(newUser.email);
        expect(body.payload.last_name).to.be.equal(newUser.last_name);
        expect(body.payload.password).to.not.be.equal(newUser.password);//Porque una vez que va el newUser, la password se hashea, por lo que el payload.password no debería ser "123".

    })

    after(async ()=>{
        //await userModel.deleteOne(userSession._id); 
        //Ojo, esto lo elimina al finalizar TODOS LOS TESTS, por lo tanto puedo usar userSession para el siguiente.
        //Esto no funciona porque no pasa por la app y por mongo, por lo tanto cualquier contacto ocn la DB necesita de la conexión con mongoDB, para
        //los test no es necesario porque al acudir a una url de la app, ya se ejecuta sobre el servidor que tengo levantado en paralelo, y allí mongo ya está conectado,
        //pero en esta función, intento eliminar desde mongo un usuariom sin haberme conectado a la DB, ya que no accedo a ninguna url y por ende no circulo por el servidor.  

        /*Para hacer esto, debo usar una url de mi servidor activo, pero no puedo usar request, porque está asociado a un endpoint
        de sessions al inicio del archivo, y debo invocar al endpoint de users, 
        debo generar otro en paralelo, de esta forma puedo usar dos endpoint´s*/
        await userRequest.delete(`/${userSession._id}`);//OJO, COMPLETAR LA URL SIEMPRE ES CON UN STRING, ASIQUE DEBO INCLUIR EN ÉL EL VALOR DEL ID.
                                                 //el id sería el uid que espera la url de user.


    })                                              

    it("[POST] /api/sessions - Debe loguear un usuario",async()=>{ //La descripción es la que usa el profe, detallando el método.


        /*La devolución al cliente cuando accede a un endpoint se desarrolla en la capa de controllers,
        y lo que les llega es el res.send con el objeto que detalla vi status y el payload de resultado. Al cliente, este payload
        le llego en el body, para hacer con esa info lo que desee. */
        const dataSignIn={
            email:"emailtest15@gmail.com",
            password:"123"
        }

        const {status, body} = await request.post("/login").send(dataSignIn); //Recordá que la url o enpoint se definió arriba, por lo menos la main branch de la ruta.
        console.log(status);//Contiene el código de respuesta.

        //console.log(body) //Contiene el payload que se envía al cliente. Lo comente todo porque me invade la respuesta con mucha info.
        expect(body.payload).to.be.an("object"); //Porqué debo aclarar el payload?, no debería también aclarar body.status?.
        expect(status).to.be.equal(200);
        expect(body.status).to.be.equal("success");
        expect(body.payload.email).to.be.equal(dataSignIn.email);
        expect(body.message).to.be.an("string");
        expect(body.payload.password).to.not.be.equal(dataSignIn.password);//Porque una vez que va el newUser, la password se hashea, por lo que el payload.password no debería ser "123".

    })
})

    