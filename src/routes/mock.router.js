import { Router } from "express";
import { generateUsersMock } from "../mocks/user.mock.js";
import { UserServices } from "../services/user.services.js";
import { generatePetsMock } from "../mocks/pets.mock.js";
import { PetServices } from "../services/pet.services.js";

const userServices = new UserServices();
const petsServices = new PetServices();
const router = Router();

router.get("/mockingpets", async (req, res) => {
  const pets = generatePetsMock(100);
  const response = await petsServices.createMany(pets);
  res.status(201).json({ status: "ok", payload: response });
});

router.get("/mockingusers", async (req, res, next) => {
  try {
    const users = await generateUsersMock(50);
    const response = await userServices.createMany(users);

    res.status(201).json({ status: "ok", payload: response });
  } catch (error) {
    error.path = "[GET] api/mocks/mockingusers"; //Invento del profe para la ruta, para agregarlo al error genérico.
    next(error);
  }
});

router.get("/generateData/:cu/:cp", async (req, res) => {
  const { cu, cp } = req.params;

  const users = await generateUsersMock(Number(cu));
  const pets = generatePetsMock(Number(cp));
  const usersResponse = await userServices.createMany(users);
  const petsResponse = await petsServices.createMany(pets);

  res
    .status(201)
    .json({ status: "ok", payload: { usersResponse, petsResponse } });
});

export default router;
