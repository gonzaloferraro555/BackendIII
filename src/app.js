import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";

import { errorHandle } from "./errors/errHandle.js";
import { logger } from "./utils/logger.js";
import swaggerUiExpress from "swagger-ui-express";
import { specs } from "./config/swaggerConfig.js";




const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(`mongodb+srv://admin:43443534254011@codercluster.hajze8d.mongodb.net/BackendIII`);

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs",swaggerUiExpress.serve,swaggerUiExpress.setup(specs));//Le defino la ruta donde va a estar la documentación. 
//Le pasamos como paráemtro el objeto de configuración creado en la config de swagger, es para dejar funcionando la interfaz gráfica.
//Usa lo configurado con swagger en la carpeta config.





//El objeto router acumula endpoints para definir el enramado de accesos que construyen las url completas.
app.use("/api", router);//Conecta el endpoint /api con cada enpoint de las rutas de index.js

// Middleware de manejo de errores
app.use(errorHandle);

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));
