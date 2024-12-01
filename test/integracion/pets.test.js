import { expect } from "chai";
import supertest from "supertest";

const request = supertest("http://localhost:8080/api/pets");

//Cualquier modificación de código debe contemplarse tanto en la documentación con swagger como con los testeos.
//script: npm run test.

describe("Test de Integración Pets",()=>{


    //Debe estar el servidor levantado, para poder acudir a los endpoints. Por eso puedo abrir otra terminal y ejecutar el npm run dev.
    let petTest;

    it("[GET] /api/pets - Debe devolver un array con mascotas",async()=>{ //La descripción es la que usa el profe, detallando el método.


        /*La devolución al cliente cuando accede a un endpoint se desarrolla en la capa de controllers,
        y lo que les llega es el res.send con el objeto status y el payload de resultado. Al cliente este payload
        le llego en el body, para hacer con esa info lo que desee. */

        const {status, body} =await request.get("/"); //Recordá que la url o enpoint se definió arriba, por lo menos la main branch de la ruta.
        console.log(status);//Contiene el código de respuesta.
        //console.log(body) //Contiene el payload que se envía al cliente. Tambien contiene la vi status, es decir que el body lleva todo el objeto de respuesta que va al cliente.
        expect(body.payload).to.be.an("array"); 
        expect(status).to.be.equal(200);//Este status, no es igual a body.status, que sería "Succes", sino que hace alusión al status del mensaje, que se envia también en la respuesta. Son dos datos diferentes.

    })


    it("[POST] /api/pets - Debe crear una nueva mascotas",async()=>{ //La descripción es la que usa el profe, detallando el método.
        
        const newPet = {
            name:"PetTest",
            specie:"Gato",
            birthDate:"10/10/2023",
            image:"blabla avatar"
        }

        

        /*En el caso del POST, antes de analizar lo que se devuelve en status y body a partir
        de la invocación del endpoint, la misma debe acompañarse con lo que sería el "body"
        que enviaría el cliente para crear la mascota, usamos el método send. */
        const {status, body} =  await request.post("/").send(newPet);

        petTest = body.payload; //Le doy el payload. Se ve que el payload está dentro del body en la devolución del objeto respuesta del servidor al cliente. Igual que status, va aparte el código de status.
                                //Creo que así como nosotros tomamos del body la información del cliente, cuando le devolvemos el payload, ellos también lo toman desde el objeto body.

        console.log(status);//Contiene el código de respuesta que se envía al cliente.
        console.log(body) //Contiene el payload que se envía al cliente.
        expect(status).to.be.equal(201);
        expect(petTest).to.be.an("object");
        expect(petTest.name).to.be.equal("PetTest");
        expect(petTest.specie).to.be.equal("Gato");
        //Puedo poner muchos expect, pero el mini test es la unidad que se aprueba, LA MÍNIMA UNIDAD DE TESTEO, y no los expect.
        //Si falla, fallo el it, me detallará en que assertion falló.


    })

    it("[PUT] /api/pets/:pid - Debe actualizar la mascota",async()=>{ //La descripción es la que usa el profe, detallando el método.
        
        const newPet = {
            name:"PetTest Modificado",
            specie:"Era gato, modifique a León"
        }

        //Debo verificar que el dao de update devuelva el objeto actualizado, de lo contrario el await devuelve el objeto viejo, por más que se haya actualizado en la DB.
        const {status, body} =  await request.put(`/${petTest._id}`).send(newPet); //Ojo, la ruta se arma con dos puntos para denotar un parámetro que viaja por la url,
                                                                                // pero aquí estoy accediendo a la url, va directamente el id.

        console.log(status);//Contiene el código de respuesta que se envía al cliente, es distinto al status del body, que es "success", o "Error".
        console.log(body.payload) //Contiene el payload que se envía al cliente.
        expect(status).to.be.equal(200);
        expect(body.payload).to.be.an("object");
        expect(body.payload.name).to.be.equal("PetTest Modificado");
        expect(body.payload.specie).to.be.equal("Era gato, modifique a León");


        })

        it("[DELETE] /api/pets/:pid - Debe eliminar la mascota",async()=>{ //La descripción es la que usa el profe, detallando el método.
        
    
            //Debo verificar que el dao de delete devuelva el objeto actualizado, de lo contrario el await devuelve el objeto viejo, por más que se haya actualizado en la DB.
            const {status, body} =  await request.delete(`/${petTest._id}`); //Ojo, la ruta se arma con dos puntos para denotar un parámetro que viaja por la url,
                                                                                    // pero aquí estoy accediendo a la url, va directamente el id.
            

            //El body que obtiene el cliente tiene el payload, por lo que confirmo que elimine el objeto correcto.
            console.log(status);//Contiene el código de respuesta que se envía al cliente, no es igual al body.status, que sería "Success", en la respuesta al cliente.
            console.log(body.payload) //Contiene el payload que se envía al cliente en e objeto body.
            expect(status).to.be.equal(200);
            expect(body.payload).to.be.an("object");
            expect(body.payload.name).to.be.equal("PetTest Modificado");
            expect(body.payload.specie).to.be.equal("Era gato, modifique a León");
    
    
            })
    })