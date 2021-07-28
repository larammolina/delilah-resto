const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const server = express();
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const { Console } = require('console');
//const { authUser, authRole } = require('./auth');


// parse application/x-www-form-urlencoded
//server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//server.use(bodyParser.json())


function log(req, res, next) {
  const { method, path, query, body } = req;
  console.log(`${method} - ${path} - ${JSON.stringify(query)} - ${JSON.stringify(body)}`);
  next();
}

server.use(log);


//////// PASSPORT ============================================================

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(passport.initialize());
server.use(passport.session());

//////// CONEXION A LA BASE ==============================================================

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123456',
  database: 'delilah_resto',
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});


//inicializamos el server en el puerto 3000
server.listen(3000, () => {
  console.log('servidor iniciado... ');
})


////////// USO PASSPORT ======================================================================== 
passport.use('local-login', new PassportLocal({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'usuario',
  passwordField: 'contrasenia',
  passReqToCallback: true // allows us to pass back the entire request to the callback
},
  function (req, usuario, contrasenia, done) {
    connection.query("SELECT * FROM `usuarios` WHERE `usuario` = '" + usuario + "'", function (err, rows) {
      if (err)
        return done(err);
      if (!rows.length) {
        return done(null, false, { mensajes: 'no se encontro el usuario' });
      }
      if (!(rows[0].contrasenia == contrasenia))
        return done(null, false, { mensaje: 'Oops! Wrong password.' });

      // all is well, return successful user
      return done(null, rows[0]);
    });
  })
);

passport.use('local-signup', new PassportLocal({
  usernameField: 'usuario',
  passwordField: 'contrasenia',
  passReqToCallback: true
}, async (req, usuario, contrasenia, done) => {
  // primero busco el usuario para ver si esta regitrado
  console.log('CHEQUEANDDO')
  connection.query("SELECT * FROM `usuarios` WHERE `usuario` = '" + usuario + "'", function (err, rows) {
    if (err) {
      console.log( "Error1" + err)
      let respuesta = {
        error: true,
        codigo: 401,
        mensajes: 'Error'
      };
      return done(null, null, respuesta);
    }
    if (rows.length > 0) {
      console.log('Ya existe: ' + rows.length)
      let respuesta = {
        error: true,
        codigo: 401,
        mensajes: 'El usuario ya existe'
      };
      return done(null, false, respuesta);
    } else {  //sino lo creo
      //insertar en la tabla de usuarios el usuario ingresado
      console.log('lo voy a crear')
      var insert = `INSERT INTO usuarios (nombreApellido, usuario, contrasenia, telefono, direcciones, mail, perfil) 
        VALUES ('${req.body.nombre_apellido}','${usuario}','${contrasenia}', '${req.body.telefono}', '${req.body.direccion}', '${req.body.mail}','user' )`;
      connection.query(insert, function (err, results, fields) {
        if (err) {
          let respuesta = {
            error: true,
            codigo: 404,
            mensajes: 'No se pudo dar de alta el usuario'
          };
          return done(null, false, respuesta);
        } else {
          // HAY QUE RESPONDERLE EL USUARIO
          connection.query("SELECT * FROM `usuarios` WHERE `usuario` = '" + usuario + "'", function (err, rows) {
            if (err) {
              console.log( "Error2" + err)
              let respuesta = {
                error: true,
                codigo: 401,
                mensajes: 'Error'
              };
              return done(null, null, respuesta);
            }
            console.log('RESULTADO: ' + rows[0])
            let respuesta = {
              error: false,
              codigo: 200,
              mensajes: 'OK'
            };
            done(null, null, respuesta);  // callback para devolver la info. null: pq no hay error, y el usuario
          });
        }

      });
    }
  });

}));


//es para que se guarde el usuario y que se recuerde para no tener que logearse en cada pagina
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//es para enviar el id guardado y el passport lo vea y lo analice
passport.deserializeUser(function (id, done) {
  connection.query("select * from usuarios where id = " + id, function (err, rows) {
    done(err, rows[0]);
  });
});


////////// MIDDLEWARES =========================================================================

function esAdmin(req, res, next) {
  connection.query("SELECT `perfil` FROM `usuarios` WHERE `usuario` = '" + req.body.usuario + "'", function (err, rows) {
    if (err) {
      console.log(err)
      res.status('401').json('no existe usuario')
    }
    console.log('RESULTADO: ' + JSON.stringify(rows))
    //console.log('RESULTADO: ' + rows[0].perfil)
    if (rows[0].perfil === 'admin') {
      next();
    } else {
      console.log(err)
      res.status('401').json('no tiene permisos de admin')
    }
  });
}



////////// ======= ENDPOINTS ====================================================================================


////////// ALTA USUARIO ENDPOINT =============================================================
server.post('/signup', passport.authenticate('local-signup'),  //escucha los datos que envia el user del get
  // le digo que usse el meotod local-signup que cree en routes ara auutennticarse
  function (req, res) {
      // authentication successful
      console.log("Resp:" + res);
      res.json(res); // la respuesta me la el middelware
  }
)


////////// LOGIN ENDPOINT ================================================================================== 
server.post('/login', passport.authenticate('local-login'),
  function (req, res) {
    // authentication successful
    console.log(res);
    res.send('OK')
  }
)


////////// VER PLATOS ENDPOINT ====================================================================================
server.get('/platos', function (req, res) {

  connection.query("SELECT * FROM `platos`", function (err, rows) {
    if (err) {
      console.log(err)
      let respuesta = {
        error: true,
        codigo: 401,
        mensajes: 'Error'
      };
      res.json(respuesta);
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      //console.log('RESULTADO: ' + rows[0].perfil)
      //ver como manda el pedido para mostrarlo por json
      res.status(200).json(rows);
    }
  });
});

////////// VER PLATOS ENDPOINT ====================================================================================
server.get('/platosHabilitados', function (req, res) {

  connection.query("SELECT * FROM `platos` WHERE habilitado=1", function (err, rows) {
    if (err) {
      console.log(err)
      let respuesta = {
        error: true,
        codigo: 401,
        mensajes: 'Error'
      };
      res.json(respuesta);
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      //console.log('RESULTADO: ' + rows[0].perfil)
      //ver como manda el pedido para mostrarlo por json
      //let respuesta = {
      //  error: true,
       // codigo: 200,
      //  mensajes: 'OK'
      //};
      res.status(200).json(rows);
    }
  });
});


////////// ACTUALIZAR PLATOS ENDPOINT ====================================================================================
server.put('/actualizarPlato/:id', esAdmin, function (req, res) {
  const { id } = req.params;
  let descripcion = req.body.descripcion;
  let precio = req.body.precio;
  let actualizarPedido = "UPDATE `platos` SET descripcion='" + descripcion + "', precio='" + precio + "' WHERE id=" + id;
  console.log(actualizarPedido)
  connection.query(actualizarPedido, function (err, rows) {
    if (err) {
      console.log(err)
      console.log('el plato NO se actualizo')
      let respuesta = {
        error: true,
        codigo: 404,
        mensajes: 'Error'
      };
      res.json(respuesta);
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      //console.log('RESULTADO: ' + rows[0].perfil)
      //ver como manda el pedido para mostrarlo por json
      console.log('el plato se actualizo')
      let respuesta = {
        error: false,
        codigo: 200,
        mensajes: 'Se actualizo ok'
      };
      res.json(respuesta);
    }
  });
});

////////// CREAR PLATOS ENDPOINT ====================================================================================
server.post('/crearPlatos', esAdmin, function (req, res) {
  let descripcion1 = req.body.descripcion;
  let precio2 = req.body.precio;
  console.log(descripcion1);
  var crearPlato = "INSERT INTO platos(descripcion, foto, precio, habilitado) VALUES('" + descripcion1 + "','foto', '" + precio2 + "','1')";

  connection.query(crearPlato, function (err, rows) {
    if (err) {
      console.log(err)
      let respuesta = {
        error: true,
        codigo: 404,
        mensajes: 'Error'
      };
      res.json(respuesta);
      console.log('no se pudo dar de alta el plato' + crearPlato)
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      console.log('plato dado de alta ok');
      let respuesta = {
        error: false,
        codigo: 200,
        mensajes: 'Se dio de alta ok'
      };
      res.json(respuesta);
    }
  });
});


////////// BORRAR PLATOS ENDPOINT (seguro queres borrar un plato? no preferis deshabilitarlo?) =========================
server.delete('/borrarPlato/:id', esAdmin, function (req, res) {
  //se debe ingresar el id del plato que se quiere borrar
  const { id } = req.params;
  let borrarPlato = "DELETE FROM platos WHERE id=" + id;
  connection.query(borrarPlato, function (err, rows) {
    if (err) {
      console.log(err)
      console.log('no se pudo borrar el plato')
      let respuesta = {
        error: true,
        codigo: 404,
        mensajes: 'Error'
      };
      res.json(respuesta);
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      //console.log('RESULTADO: ' + rows[0].perfil)
      console.log('Se borro el plato ok')
      let respuesta = {
        error: false,
        codigo: 200,
        mensajes: 'Se borro el plato ok'
      };
      res.json(respuesta);
    }
  });
});

////////// DESHABILITAR PLATOS ENDPOINT ====================================================================================
server.put('/deshabilitarPlato/:id', esAdmin, function (req, res) {
  const { id } = req.params;
  let deshabilitarPlato = "UPDATE platos SET habilitado=0 WHERE id=" + id;

  connection.query(deshabilitarPlato, function (err, rows) {
    if (err) {
      console.log(err)
      let respuesta = {
        error: true,
        codigo: 404,
        mensajes: 'Error'
      };
      res.json(respuesta);
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      //console.log('RESULTADO: ' + rows[0].perfil)
      //ver como manda el pedido para mostrarlo por json
      let respuesta = {
        error: false,
        codigo: 200,
        mensajes: 'Se deshabilito el plato ok'
      };
      res.json(respuesta);
    }
  });
});

////////// HABILITAR PLATOS ENDPOINT ====================================================================================
server.put('/habilitarPlato/:id', esAdmin, function (req, res) {
  //se ingresa el id del plato que se quiere volver a habilitar
  const { id } = req.params;
  let habilitarPlato = "UPDATE platos SET habilitado=1 WHERE id=" + id;

  connection.query(habilitarPlato, function (err, rows) {
    if (err) {
      console.log(err)
      let respuesta = {
        error: true,
        codigo: 404,
        mensajes: 'Error'
      };
      res.json(respuesta);
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      //console.log('RESULTADO: ' + rows[0].perfil)
      //ver como manda el pedido para mostrarlo por json
      let respuesta = {
        error: false,
        codigo: 200,
        mensajes: 'Se habilito el plato ok'
      };
      res.json(respuesta);
    }
  });
});


////////// ALTA PEDIDO ENDPOINT ====================================================================================
//endpoint para dar de alta pedidos
server.post('/altaPedido', function (req, res) {
  //recibir pedidos 
  //recibir usuario
  //busco id de usuario
  console.log("Usuario: "+req.body.usuario);
  var consultaIdUsuario = "SELECT * FROM `usuarios` WHERE `usuario` = '" + req.body.usuario + "'";
  console.log('platos: ' + req.body.platos);
  let platos = req.body.platos;

  connection.query(consultaIdUsuario, function (err, rows) {
    let idUsuario = rows[0].id;
    //console.log('resultado idUsuario' + idUsuario);
    //doy de alta el pedido
    console.log('creando pedido')

    var date = new Date();
    date = date.getUTCFullYear() + '-' +
      pad(date.getUTCMonth() + 1) + '-' +
      pad(date.getUTCDate()) + ' ' +
      pad(date.getUTCHours()) + ':' +
      pad(date.getUTCMinutes()) + ':' +
      pad(date.getUTCSeconds());

    var insertPedido = `INSERT INTO pedidosPorUsuario (idUsuario, monto, formaPago, direccion, estado, fecha) 
        VALUES ('${idUsuario}','${req.body.monto}', '${req.body.formaPago}', '${req.body.direccion}', 'nuevo', '${date}')`;
    console.log(insertPedido);
    connection.query(insertPedido, function (err, results, fields) {
      if (err) {
        let respuesta = {
          error: true,
          codigo: 401,
          mensajes: 'No se pudo dar de alta el pedido1'
        };
        console.log(err);
        res.json(respuesta);

      } else {
        //hacemos una consulta para saber el 

        console.log(JSON.stringify(results.insertId));
        let idPedido = JSON.stringify(results.insertId);

        //if (platos.length <= 1) {
        if(Array.isArray(platos) == false){
          console.log('NO ES ARRAY -- TAMAÑO '+platos.length);
          //envio la lista al SQL
          var sql = `INSERT INTO productosPedidos (idPedido, idPlato, cantidadPlato) VALUES ('${idPedido}', '${platos}', '${1}' )`;

          connection.query(sql, function (err, results, fields) {
            if (err) {
              let respuesta = {
                error: true,
                codigo: 401,
                mensajes: 'No se pudo dar de alta el pedido1'
              };
              console.log(err);
              res.json(respuesta);

            } else {
              let respuesta = {
                error: false,
                codigo: 200,
                mensajes: 'Se dio de alta el pedido exitosamente'
              };
              res.json(respuesta);
            }
          });




        } else {
          console.log('ES ARRAY -- TAMAÑÑÑOOOOOOOOOO '+platos.length);
          let current = 0, cnt = 0;
          //Ordeno la cantidad y saco cuanto hay de cada uno
          platos.sort();
          var count = {};
          platos.forEach(function (i) {
            count[i] = (count[i] || 0) + 1;
          });
          let lista = [];
          Array.from(Object.keys(count)).forEach(function (key) {
            console.log(key + ":" + count[key]);
            aux++;
            let idPlato = key;
            let cantidadPlato = count[key];
            //var insertPlatosPorPedido = `INSERT INTO productosPedidos (idPedido, idPlato, cantidadPlato) 
            //VALUES ('${idPedido}','${idPlato}','${cantidadPlato}' )`;
            //console.log(insertPlatosPorPedido);


            var aux = [parseInt(idPedido, 10), parseInt(idPlato, 10), cantidadPlato]
            console.log("LISTA: " + aux)
            lista.push(aux);

          });

          //envio la lista al SQL
          var sql = "INSERT INTO productosPedidos (idPedido, idPlato, cantidadPlato) VALUES ?";
          console.log(lista)

          connection.query(sql, [lista], function (err, results, fields) {
            if (err) {
              let respuesta = {
                error: true,
                codigo: 404,
                mensajes: 'No se pudo dar de alta el pedido1'
              };
              console.log(err);
              res.json(respuesta);

            } else {
              let respuesta = {
                error: false,
                codigo: 200,
                mensajes: 'Se dio de alta el pedido exitosamente'
              };
              res.json(respuesta);
            }
          });
        }
      }
    });
  });
});
var pad = function (num) { return ('00' + num).slice(-2) };
Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

//////////  LOS PEDIDOS DEL USUARIO ENDPOINT ===================================================================
server.get('/pedidosUsuario/:usuario', function (req, res) {
  //ver todos los pedidos de ese usuario en particular
  const { usuario } = req.params;
  var consultaIdUsuario = "SELECT * FROM `usuarios` WHERE `usuario` = '" + usuario + "'";

  connection.query(consultaIdUsuario, function (err, rows) {
    let idUsuario = rows[0].id;
    console.log('resultado idUsuario' + idUsuario);
    console.log('consultando pedido del usuario')

    var consultaPedidoUsuario = "SELECT * FROM `pedidosPorUsuario` LEFT JOIN productosPedidos ON pedidosPorUsuario.idPedido = productosPedidos.idPedido WHERE pedidosPorUsuario.idUsuario =" + idUsuario;
    connection.query(consultaPedidoUsuario, function (err, rows) {
      if (err) {
        console.log(err)
        res.status('401').json('error')
      } else {
        console.log('RESULTADO: ' + JSON.stringify(rows))
        //console.log('RESULTADO: ' + rows[0].perfil)
        //ver como manda el pedido para mostrarlo por json
        res.status(200).json(rows);
      }
    });
  });
});

////////// TODOS LOS PEDIDOS ADMIN ENDPOINT ===================================================================
server.get('/pedidos', esAdmin, function (req, res) {
  //ver todos los pedidos 
  //pedidosPorUsuario.idPedido, pedidosPorUsuario.idUsuario, productosPedidos.idPlato, productosPedidos.cantidadPlato,pedidosPorUsuario.monto, pedidosPorUsuario.formaPago, pedidosPorUsuario.direccion, pedidosPorUsuario.estado, pedidosPorUsuario.fecha
  var consultaPedido = "SELECT * FROM `pedidosPorUsuario` LEFT JOIN productosPedidos ON pedidosPorUsuario.idPedido = productosPedidos.idPedido ";

  connection.query(consultaPedido, function (err, rows) {
    if (err) {
      console.log(err)
      res.status('401').json('error')
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      //console.log('RESULTADO: ' + rows[0].perfil)
      //ver como manda el pedido para mostrarlo por json
      res.status(200).json(rows);
    }
  });
});


////////// VER ESTADO DE UN PEDIDO ENDPOINT ==========================================================================================

//se debe ingresar el id del pedido para ver el estado del mismo
server.get('/estadoPedido/:idPedido', esAdmin, function (req, res) {
  const { idPedido } = req.params;
  var consultaEstado = "SELECT pedidosPorUsuario.idPedido, pedidosPorUsuario.estado, estados.descripcion FROM `pedidosPorUsuario` LEFT JOIN estados ON pedidosPorUsuario.estado = estados.id WHERE pedidosPorUsuario.idPedido=" + idPedido;
  connection.query(consultaEstado, function (err, rows) {
    if (err) {
      console.log(err)
      res.status('401').json('error')
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      //console.log('RESULTADO: ' + rows[0].perfil)
      //ver como manda el pedido para mostrarlo por json
      res.status(200).json(rows);
    }
  });

});

////////// ACTUALIZAR ESTADO DE UN PEDIDO ENDPOINT ==========================================================================================
server.put('/estadoPedido/:idPedido', esAdmin, function (req, res) {
  //se ingresa el id del pedido que se quiere volver a habilitar
  const { idPedido } = req.params;
  let actualizarEstado = "UPDATE pedidosPorUsuario SET estado='" + req.body.estado + "' WHERE idPedido=" + idPedido;
  connection.query(actualizarEstado, function (err, rows) {
    if (err) {
      console.log(err)
      res.status('401').json('error')
    } else {
      console.log('RESULTADO: ' + JSON.stringify(rows))
      res.status(200).json(rows);
    }
  });
});


