import { Router } from "express";
import { UserControllers } from "../controllers/users.controller.js";

const usersController = new UserControllers();
const router = Router();

router.get("/", usersController.getAllUsers);
router.get("/mock", usersController.createUserMock);

router.get("/:uid", usersController.getUser);
router.put("/:uid", usersController.updateUser);
router.delete("/:uid", usersController.deleteUser);
//El front accede a las url otorgadas por el back, en este caso hay 3 iguales, el front debe especificar el tipo de petición, así desde aquí
//el código sabrá a cual acceder (POST, GET, PUT DELETE). Por ejemplo si hubiera un post, vendrá con infromación a través del objeto body.


export default router;
