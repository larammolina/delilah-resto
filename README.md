# delilah-resto
API Rest para Delilah Resto - TP3 ACAMICA

Api desarrollada para ser utilizada por un delivery de comidas.
Instalaciones requeridas:

    Postman
    NodeJs
    Visual Studio Code
    MySQL2
		
		const express = require('express');
		const bodyParser = require('body-parser');
		const mysql = require('mysql2');
		const server = express();
		const path = require('path');
		const passport = require('passport');
		const session = require('express-session');
		const PassportLocal = require('passport-local').Strategy;
		const { Console } = require('console');

		

Pasos a seguir:

1 - Ejecutar el siguiente comando desde la carpeta del proyecto:

 //ver npm con gasti npm i bcrypt body-parser dotenv express jsonwebtoken mysql2 nodemon

2 - Copiar el contenido del archivo db.sql que está en la carpeta database y ejecutarlo en MySql Workbench.


4 - Ejecutar:

```npm start```

5- Desde Postman escribir las rutas con sus correspondientes recursos (GET, POST, PUT, DELETE).

Documentacion: https://app.swaggerhub.com/apis-docs/larammolina/Delilah-Resto-API/1#/

    Creación de usuarios (no admins, solo clientes)

POST /singup 

Se debe ingresar por BODY los siguientes datos:

{
  "usuario":"macmolin",
  "contrasenia":"macmolin",
  "mail":"maca@maca.com",
  "nombreApellido":"macarena molina",
  "direcciones":"Calle Falsa 123",
  "telefono":"43556776"
}


    Loguearse

POST /login

Se debe ingresar por BODY los siguientes datos:

{
  "usuario":"macmolin",
  "contrasenia":"macmolin"
}


Admin de prueba:

{
   "usuario":"admin",
   "contrasenia":"admin"
}

Para usar los siguientes endpoints, siempre se tiene que estar logeado. 
Se corre npm start, se logea en postman, y luego se usan los endpoints.

    Obtener todos los platos del restoran (los que estan habilitados y los que no.)

GET /platos

No requiere body. Para acceder tenes que estar logeado, y solo el admin tiene permiso.

	Obtener todos los platos del restoran habilitados (Son los que se pueden vender.)
	
GET /platosHabilitados (los puede consultar el usuario)

No requiere body. Tenes que estar logeado.

    Crear un plato. Solo admin.

POST /crearPlatos

BODY:

{
   "descripcion": "milanesa",
   "precio": 120
}

    
    Eliminar plato (funcionalidad apta sólo para administradores). Se requiere estar logeado.

DELETE /borrarPlato/idPlato

No requiere Body. Se envia por Path el id del plato a borrar. Borrar elimina de la tabla el plato. 
Si solo se quiere hacer la baja logica del Plato, se recomienda usar el endpoint deshabilitarPlato/idPlato.

 	Deshabilitar plato (funcionalidad apta sólo para administradores)

POST /deshabilitarPlato/idPlato

No requiere Body. Se envia por Path el id del plato a deshabilitar. No borrar elimina de la tabla el plato. 
Para volver a habilitarlo, de sebe usar el endpoint habilitarPlato/idPlato.

	Habilitar plato (funcionalidad apta sólo para administradores)

POST /habilitarPlato/idPlato

No requiere Body. Se envia por Path el id del plato a habilitar. 

    Crear pedido nuevo

POST /altaPedido

BODY: este pedido contiene 3 platos, plato con id2, plato con id1 y plato con id5. Por default, salen con estado "nuevo" los pedidos.

{	
   "idUsuario":"1",
	 "monto":"250",
	 "formaPago":"efectivo",
	 "direccion":"calle falsa 123",
   "platos":"2",
	 "platos":"1",
	 "platos":"5",

 }

    Obtener todos los pedidos (funcionalidad apta sólo para administradores)

GET /pedidos

No requiere body.

    Modificar estado de un pedido (funcionalidad apta sólo para administradores)

PUT /estadoPedido/idPedido

Se debe enviar por path el idPedido y por body el estado nuevo del pedido
BODY:

{
   "estado":"entregado"
}

Siendo los estados: 1- nuevo 2- confirmado 3- preparando 4- enviando 5- entregado

 	Obtener todos los pedidos de un usuario en particular 
	
GET /pedidosUsuario/usuario , example: /pedidosUsuario/macmolin

No requiere body. Se envia por path el usuario que se desea consultar.
