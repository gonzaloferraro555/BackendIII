import { expect } from "chai";
import supertest from "supertest";

const request = supertest("http://localhost:8080/api/adoptions");
const requestPets = supertest("http://localhost:8080/api/pets");
const requestUsers = supertest("http://localhost:8080/api/users");



describe("Test funcional para las rutas de adoptions.",()=>{

    let adoptionTest;
    
    it("[POST] - Crear adopción.",async ()=>{

        const {status,body} = await request.post("/6716d349a9c28488719ddb6f/6716d211a9c28488719ddb0a");

        adoptionTest = body.payload;

        expect(body.payload).to.be.an("object");
        expect(body.payload).to.not.be.null;
        expect(body.payload.owner).to.be.an("string");
        expect(body.payload.pet).to.be.an("string");
        expect(body.status).to.be.equal("success");
        expect(status).to.be.equal(201);
        



    })    
    
      
    it("[GET] - Obtener todas las adopciones.",async ()=>{

        const {status,body} = await request.get("/");
        expect(body.payload).to.be.an("array");
        expect(body.payload[0]).to.be.an("object");
        expect(body.payload).to.not.be.null;
        expect(body.status).to.be.equal("success");
        expect(status).to.be.equal(200);
        

    })

    after("Se elimina el registro de la adopción, y se actualiza la data de la mascota y del dueño", async ()=>{
        //Eliminación de la adopción
        await request.delete(`/${adoptionTest._id}`);
        //Modificación del campo que define a la mascota como adoptada.
        const updatedPet={adopted:false};
        await requestPets.put(`/6716d211a9c28488719ddb0a`).send(updatedPet);

        //Modificación del arreglo del dueño que detalla sus mascotas.
        const {body} = await requestUsers.get("/6716d349a9c28488719ddb6f");
        body.payload.pets.pop();
        const updatedUser={pets:body.payload.pets};
        await requestUsers.put(`/6716d349a9c28488719ddb6f`).send(updatedUser); //Ojo con la barra de la url, en un intento no la detalle.
    
    })

})