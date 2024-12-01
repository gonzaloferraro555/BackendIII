import petModel from "./models/Pet.js";

export default class Pet {

    get = (params) =>{
        return petModel.find(params)
    }

    getById = (params) =>{
        return petModel.findById(params);
    }

    save = (doc) =>{
        return petModel.create(doc);
    }

    saveMany = (docs) =>{
        return petModel.insertMany(docs);
    }

    update = (id,doc) =>{
        return petModel.findByIdAndUpdate(id,{$set:doc},{new:true});
    }

    delete = (id) =>{
        const result = petModel.findByIdAndDelete(id,{new:true});
        return result;
    }
}