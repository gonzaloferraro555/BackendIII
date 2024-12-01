import swaggerJSDoc from "swagger-jsdoc";

const swaggerConfig = {
    swaggerDefinition:{//Esta información se verá en la interfaz gráfica de swagger.
        openapi:"3.0.1",
        info: {
            title:"Documentación de API Adopciones",
            version:"1.0.0",//Esta la voy actualizando yo con la versión de mi aplicación, deberían ir de la mano, ya que swagger debe ir de la mano.
            description: "API de Adopciones"}
        },
    apis:["./src/docs/**/*.yaml"],//Lo que hago aquí es indicarle que cree la carpeta docs si no existe, y busque en 
                                //todas (**) las carpetas y subarchivos, y en todos(*) los archivos de tipo yaml en ella
                                //para la interfaz gráfica que ofrece swagger.
                                
}

export const specs = swaggerJSDoc(swaggerConfig);//lo que importo es una función, y el objeto creado es de configuración para
                                                //esa función. Guardo el resultado en un objeto que exporto para el módulo que necesite.