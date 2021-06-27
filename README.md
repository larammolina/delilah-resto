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

	npm i  body-parser express  mysql2 passport passport-local express-session

2 - Se debe configurar en archivo index.js y baseDeDatos.js el host(ip o direccion de la aplicacion sql), user(usuario configurado en el servidor sql) y password(contraseña del usuario sql) segun la ubicacion del sql.

3- Ejecutar la configuracion de la Base de Datos:

	node baseDeDatos.js

4 - Ejecutar:

	npm start

5- Desde Postman escribir las rutas con sus correspondientes recursos (GET, POST, PUT, DELETE).

Documentacion: https://app.swaggerhub.com/apis-docs/larammolina/Delilah-Resto-API/1#/

	1 - Poder registrar un nuevo usuario: Usar /singup y luego /login.
	
	2 - Un usuario debe poder listar todos los productos disponibles. Usar /login, luego /crearPlatos y luego /platosHabilitados.
	
	3 - Un usuario debe poder generar un nuevo pedido al Restaurante con un listado de platos que desea.	Usar /login, luego /altaPedido.
	
	4 - El usuario con roles de administrador debe poder actualizar el estado del pedido. Usar /login, luego /estadoPedido/idPedido
	
	5 - Un usuario con rol de administrador debe poder realizar las acciones de creación, edición y eliminación de recursos de productos (CRUD de productos). Usar /login, luego /crearPlatos, /actualizarPlato/idPlato, /borrarPlato/idPlato.	
	
	6 - Un usuario sin roles de administrador no debe poder crear, editar o eliminar un producto, ni editar o eliminar un pedido. Tampoco debe poder acceder a informaciones de otros usuarios. Usar /login, luego /pedidosUsuario/usuario.




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
Se corre npm start, se logea en postman, y luego se usan los endpoints aclarados a continuacion:

    Obtener todos los platos del restoran (los que estan habilitados y los que no.)

GET /platos

No requiere body.  solo el admin tiene permiso. Hay que hacer login antes de usar este endpoint.

	Obtener todos los platos del restoran habilitados (Son los que se pueden vender.)
	
GET /platosHabilitados (los puede consultar el usuario)

No requiere body. Tenes que estar logeado.

    Crear un plato. Solo admin.

POST /crearPlatos

Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login como admin. Ademas se debe enviarpor body "usuario":"admin", "contrasenia":"admin", descripcion y precio del plato. Al dar de alta un plato, se envia por default el estado 1 en la columna habilitado. Si luego se quiere deshabilitar, usar el endpoint deshabilitarPlato/idPlato.

BODY:

{
   "usuario":"admin",
   "contrasenia":"admin"
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
