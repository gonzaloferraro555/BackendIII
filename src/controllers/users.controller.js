import { customError, CustomError } from "../errors/custom.error.js";
import { generateUsersMock } from "../mocks/user.mock.js";
import { UserServices } from "../services/user.services.js";

export class UserControllers {
  constructor() {
    this.userServices = new UserServices();
  }

  createUserMock = async (req, res) => {
    const users = await this.userServices.createMocks();
    console.log(users)
    res.status(201).json({ status: "ok", users });
};

  getAllUsers = async (req, res, next) => {
    try {
      const users = await this.userServices.getAll();
      res.status(200).send({ status: "success", payload: users });
    } catch (error){
      next(error);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const userId = req.params.uid;

      const user = await this.userServices.getById(userId);
      if (!user) throw customError.notFoundError();
      res.status(200).send({ status: "success", payload: user });
    } catch (error) {
      console.log(`Error: ${error.message}`);
      next(error);
    }
  };

  updateUser = async (req, res) => {
    try{
      const updateBody = req.body;
      const userId = req.params.uid;
      const user = await this.userServices.getById(userId);
      if (!user) throw customError.notFoundError();

      const result = await this.userServices.update(userId, updateBody);
      res.status(200).send({ status: "success", message: "User updated" });
  }
  catch(error){
    next(error)
  }};

  deleteUser = async (req, res) => {
    const userId = req.params.uid;
    const result = await this.userServices.remove(userId);
    res.status(200).send({ status: "success", message: "User deleted",payload:result});
  };
}
