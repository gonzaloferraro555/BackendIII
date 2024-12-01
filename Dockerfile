
# Definimos una imagen base de node y su versión para nuestro contenedor. Le defino la versión de node con la que desarrolle la app, 
# para que cualquiera que use ésta imagen, use el servidor pero en el contenedor se usará la versión indicada por el dockerfile.
#Recordá que el contenedor levanta la imagen que estamos por crear, y es ésta la que, en base al archivo dockerfile, definió las versiones
#de node y demás paquetes a utilizar. Si no detallo nada se instala la última versión encontrada o disponible.
FROM node:22.11.0

# Definimos el directorio de trabajo dentro del contenedor donde se instalará la aplicación.
#El contenedor instala un SO de linux muy liviano, sin carpetas en su interior. Sólo es la consola y el kernel de linux, no hay carpetas.
#De esta forma, el contenedor lo ejecuta windows, pero lo hace a través de linux en una versión básica especial que sólo tiene lo necesario
#para ejecutar la aplicación. Usamos /app por un stándar, pero puedo poner cualquiera. Si tipeo con ubuntu el comando ls, veré que no hay carpetas
#creadas en mi SO virtual de linux, ahora tendré app.
WORKDIR /app

# Copiamos el archivo package.json a la carpeta de trabajo, es decir dentro de la carpeta app, lo que va haciendo es armar el proyecto
#en la carpeta /app dentro de linux, a través de éstas instrucciones de dockerfile. Esto me permitirá luego instalar las dependencias del proyecto que usé originalmente.
# Lo que queda fuera del package.json es la versión de node, por eso lo primero es definir con la primer instrucción la versión de node que usaremos desdel inux con el "FROM".
COPY package.json .

# Instalamos las dependencias del proyecto a partir del package.json copiado, lo que instalará todos los paquetes en las versiones correctas.
RUN npm install

RUN npm install bcryptjs
# Copiamos el resto de los archivos a la carpeta de trabajo. De lo contrario, no tendría ni la carpeta src, 
#ni la .gitignore, ni test, nada estaría incluído.
COPY . .

# Exponemos el puerto 8080. 
EXPOSE 8080

# Definimos el comando para correr nuestra aplicación. Se arma en CMD con un arreglo que elige las instrucciones que conforman el comando.
#El start no necesita el run como si lo necesitaría el dev, son iguales efectos, pero no sería en versión dev, sino ya en producción, porque
#no ejecuta el watch (reemplazo de nodemon).
CMD ["npm", "start"]

# Luego de crear el Dockerfile, debemos construir la imagen de nuestro contenedor
# Para esto, debemos ejecutar el siguiente comando en la terminal:
# docker build -t nombre-de-la-imagen . (reemplazar nombre-de-la-imagen por el nombre que quieras darle a tu imagen, no obviar el espacio y el punto).

# Una vez que la imagen se haya construido, podemos correr uno o varios contenedores a partir de ella, podremos verla desde el docker desktop.
#Tené en cuenta que docker se instala en windows, pero se ejecuta en linux. Lo que no queda claro es donde ocupa espacio la imagen.
# Para esto, debemos ejecutar el siguiente comando en la terminal:

# docker run -p 8080:8080 nombre-de-la-imagen (reemplazar nombre-de-la-imagen por el nombre que le diste a tu imagen O NÚMERO DE ID DE LA IMAGEN).
#El primer puerto es el de nuestra PC, el que usa nuestra PC, y el segundo es el que nos vincula con nuestro contenedor.
#Si quiero crear otro contenedor a partir de la misma imagen, simplemente cambio el primer puerto. Así tendré habilitados
#dos contenedores desde docker, para lanzarlos en paralelo, usando distintos puertos de mi PC, pero dentro de cada uno usarán
#el mismo puerto de linux para la aplicación, y no dará error porque son distintos "SO linux" para cada contenedor. Es como ejecutar varias mini PC´que levantan mi servidor,
#por eso en cada una de ellas puedo usar el puerto 8080, es el puerto del contenedor, para usar mi servidor, y obviamente con el que 
# debe conectarse el front para acceder al endpoint, lo que irá cambiando es el puerto que se usa para correr el contenedor desde 
#la PC que lo o los ejecuta, esto queda configurado al armar el contenedor, en nuestro caso, armamos dos contenedores que usarán 8080 y 3000 en la PC que los ejecute,
# pero los endpoint´s dentro de cada contenedor son accesible por el 8080 en todos los casos. 
#Todos los contenedores se crean en base a la misma imagen que arma dockerfile, por eso manejan las mismas versiones en todos los paquetes.
#La gestión de los recursos que consume cada contenedor, la administra el windows del hardware que levanta el contenedor.
#Si yo contrato un servicio de amazon o erasure para levantar servidores, lo único que debo hacer es levantar mi contenedor, que levanta un 
#servidor en base a una imagen de mi aplicativo armada a "medida". De ésta forma, quién nos cobra por el hardware, ejecuta contenedores,
#armados con versiones de sus elementos preestablecidas, en base a una sola imagen. Lo quie yo le pido es, x cantidade de SO con cierta capacidad,
# para ejecutar los contenedores.
#La ejecución de docker, en el hardware que maneja la ejecución de los contenedores, que para el caso comentado sería la PC 
#virtual que nos está "alquilando" amazon, ejecuta mi docker personal y el contenedor en cuestión. Docker detecta en el 
#SO que está siendo ejecutado, en este caso el virtual de amazon, la cantidad de cpu´s disponibles, y será esa la máx de servidores en paralelos que 
#ese SI virtual podría correr.
#Este máx está definido por los procesadores lógicos de tu procesador (no es lo mismo que los núcleos), en ellos está la máxima capacidad
#de tu hardware de ejecutar en paralelo, tantos contenedores (SO linux), como sea posible.
#La imagen creada da error al rato al profe, porque intenta conectarse a MONGO DB desde el contenedor, y necesita que esté instalado Mongo en el mismo, y no lo está,
#porque el profe no tiene mongo instalado localmente. En mi caso no da ese error, porque ejecutaría los contenedores desde mi PC, en este caso
#yo reemplazo el sistema operativo virtual que me alquilaría amazon, podré ejecutar tantos contenedores en paralelo como núcleos virtuales posea mi PC,
#y no tendré problemas con MongoDB porque lo tengo instalado, pero ojo, los puertos deben ser diferentes, refiriéndonos al primero de los dos que detallamos al crear el contenedor.
#Una forma de solucionarle esto al profe es, desde mi SO virtual, con el que ejecutaré mi contenedor, ejecutar docker invocando un servidor de mongo, que está
#en el mismo docker hub, de ésta forma, mi SO virtual detecta que no tiene esa imagen de mongo, y la descarga, lo que deja mi SO virtual listo
#para utilizar mongoDB cuando levante mi contenedor.
#Docker hub es como github, pero me permite crear repositorios que almacenen contenedores,
# necesitaré subirlso desde el docker de mi pc local que ejecuta los contenedores, o que tenía la imagen y los contenedores.
#Estos contenedores por regla general contienen:

# 1)Una pequeña distribución de Linux
# 2)Todas las dependencias necesarias para que tu aplicación se ejecute.
# 3)El código de tu aplicación
#La imagen instalará mi aplicación en base a Dockerfile, por lo es que es fundamental incluirle todo lo necesario, incluso el software de DB.

#Para subir a docker-hub:

#Debo loguerame a docker desde consola, con el comando "docker login". Si no estaba logueado localmente me pide usuario y contraseña. Salgo con docker logout.
#Debo crear un tag para la imagen:
    #"docker tag (nombre de la imagen) (nombre de usuario/nombre repositorio):(tag)".
    #El tag es el número de versión, comenzas con el 1.0.0, luego podes usar "latest".

#Descarga de la imagen desde docker-hub
#docker pull entregafinal:1.0.0 , es decir pull (nombre del repositorio):tag