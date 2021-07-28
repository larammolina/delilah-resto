# delilah-resto
API Rest para Delilah Resto - TP3 ACAMICA

Api desarrollada para ser utilizada por un delivery de comidas.
* Documentacion: https://app.swaggerhub.com/apis-docs/larammolina/Delilah-Resto-API/1

* Instalaciones requeridas:

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

* Documentacion: https://app.swaggerhub.com/apis-docs/larammolina/Delilah-Resto-API/1#/

---------
PARA LA CORRECCIÓN:

1 - Poder registrar un nuevo usuario: 

	Usar /singup y luego /login.
	Cuando el usuario se logea se obtiene el JWT. Se debe anotar en un txt y para los endpoints siguientes, se debe ingresar el jwt por header.
	key: "access-token"
	value: "..." (aca iria el JWT obtenido en el login)
	
2 - Un usuario debe poder listar todos los productos disponibles:
	
	Usar  /crearPlatos y luego /platosHabilitados.
	Pasar JWT por header.
	
3 - Un usuario debe poder generar un nuevo pedido al Restaurante con un listado de platos que desea:
	
	Usar  /altaPedido.
	Pasar JWT por header.
	
4 - El usuario con roles de administrador debe poder actualizar el estado del pedido:

	Usar /estadoPedido/idPedido 
	Pasar JWT por header.
	
5 - Un usuario con rol de administrador debe poder realizar las acciones de creación, edición y eliminación de recursos de productos (CRUD de productos).

	Usar  /crearPlatos, /actualizarPlato/idPlato, /borrarPlato/idPlato. 
	(para consultar el id de un plato, usar el endpoint /platos y buscar el plato que se desea consultar)
	Pasar JWT por header.
	
6 - Un usuario sin roles de administrador no debe poder crear, editar o eliminar un producto, ni editar o eliminar un pedido. Tampoco debe poder acceder a informaciones de otros usuarios:

	Usar  /pedidosUsuario/usuario.
	Pasar JWT por header.

La base de datos viene con el admin, y varios platos creados.


---------
AVISO IMPORTANTE: Si se van a enviar por RAW la informacion, en el header se debe colocar:

	Content-Type: application/json
---------

* Creación de usuarios (no admins, solo clientes)

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

---------

* Loguearse

	POST /login   (obtener el JWT para los siguientes endpoints en donde haya que estar logeado)

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

---------

IMPORTANTE!
Para usar los siguientes endpoints, siempre se tiene que estar logeado. Pasar JWT por header.
Se corre npm start, se logea en postman, y luego se usan los endpoints aclarados a continuacion.

---------

* Obtener todos los platos del restoran (los que estan habilitados y los que no.)

	GET /platos

	Hay que hacer login antes de usar este endpoint. Pasar JWT por header.
	
	BODY:

	{ "usuario":"admin"
	  
	}

---------

* Obtener todos los platos del restoran habilitados (Son los que se pueden vender.)
		
	GET /platosHabilitados (los puede consultar el usuario)

	Tenes que estar logeado. Pasar JWT por header.
	
	BODY:

	{ "usuario":"admin"
	  
	}

---------

* Crear un plato. Solo admin.

	POST /crearPlatos

	Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login como admin. Pasar JWT por header.
	Ademas se debe enviarpor body "usuario":"admin", "contrasenia":"admin", descripcion y precio del plato.
	Al dar de alta un plato, se envia por default el estado 1 en la columna habilitado. 
	Si luego se quiere deshabilitar, usar el endpoint deshabilitarPlato/idPlato.

	BODY:

	{
	   "usuario":"admin",
	   "descripcion": "milanesa",
	   "precio": 120
	}

---------
    
* Eliminar plato (funcionalidad apta sólo para administradores). 

	DELETE /borrarPlato/idPlato

	Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login como admin. Pasar JWT por header.
	Se envia por Path el id del plato a borrar. 
	Elimina de la tabla el plato. 
	Si solo se quiere hacer la baja logica del Plato, se recomienda usar el endpoint deshabilitarPlato/idPlato.
	
	BODY:

	{ "usuario":"admin"
	}

---------

* Deshabilitar plato (funcionalidad apta sólo para administradores)

	POST /deshabilitarPlato/idPlato

	Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login como admin. Pasar JWT por header.
	Se envia por Path el id del plato a deshabilitar. 
	Para volver a habilitarlo, de sebe usar el endpoint habilitarPlato/idPlato.
	
	BODY:

	{ "usuario":"admin"
	
	}

---------

* Habilitar plato (funcionalidad apta sólo para administradores)

	POST /habilitarPlato/idPlato
	
	Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login como admin. Pasar JWT por header.
	Se envia por Path el id del plato a habilitar. 
	
	BODY:

	{ "usuario":"admin"
	}

---------

* Crear pedido nuevo

	POST /altaPedido
	
	Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login Pasar JWT por header.
	BODY: este pedido contiene 1 platos, plato con id1. Por default, salen con estado "nuevo" los pedidos.

	{	
	        "usuario":"macmolin",
		 "monto":"250",
		 "formaPago":"efectivo",
		 "direccion":"calle falsa 123",
	   	"platos":["1"]

	 }

---------

* Obtener todos los pedidos (funcionalidad apta sólo para administradores)

	GET /pedidos
	
	Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login como admin. Pasar JWT por header.
	
	BODY:

	{ "usuario":"admin"
	
	}
	

---------

* Modificar estado de un pedido (funcionalidad apta sólo para administradores)

	PUT /estadoPedido/idPedido

	Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login como admin. Pasar JWT por header.
	Se debe enviar por path el idPedido y por body el estado nuevo del pedido
	
	BODY:

	{ "usuario":"admin", 
	  "estado":"entregado"
	}

	Siendo los estados: 1- nuevo 2- confirmado 3- preparando 4- enviando 5- entregado

---------

* Obtener todos los pedidos de un usuario en particular 
	
	GET /pedidosUsuario/usuario , example: /pedidosUsuario/macmolin
	
	Antes de ejecutar este endpoint, tenes que haber ejecutado el endpoint Login. Pasar JWT por header.
	Se envia por path el usuario que se desea consultar.
	
	BODY:

	{ "usuario":"admin"
	}
