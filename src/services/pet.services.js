import Pet from "../dao/Pets.dao.js";
import { customError } from "../errors/custom.error.js";

export class PetServices {
  constructor() {
    this.petDao = new Pet();
  }
  async getAll() {
    const pets = await this.petDao.get();
    return pets;
  }


  async getById(id) {
    const pet = await this.petDao.getById(id);
    if (!pet) throw customError.notFoundError(`User id ${id} not found`);
    return pet;
  }


  async create(data) {
    const pet = await this.petDao.save(data);
    return pet;
  }
  async createMany(data) {
    const pets = await this.petDao.saveMany(data);
    return pets;
  }

  async update(id, data) {
    const pet = await this.petDao.update(id, data,{new:true});
    return pet;
  }

  async remove(id) {
    return await this.petDao.delete(id);
  }
}
