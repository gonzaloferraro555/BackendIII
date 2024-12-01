import { Router } from "express";
import { AdoptionsController } from "../controllers/adoptions.controller.js";

const adoptionsController = new AdoptionsController();
const router = Router();

router.get("/", adoptionsController.getAllAdoptions);
router.get("/:aid", adoptionsController.getAdoption);
router.post("/:uid/:pid", adoptionsController.createAdoption);
router.delete("/:aid",adoptionsController.removeAdoption);

export default router;
