let createUsuarios = `create table if not exists usuarios(
    id int primary key auto_increment,
    nombreApellido varchar(255)not null,
    usuario varchar(255)not null,
    contrasenia varchar(255)not null,
    telefono INT not null,
    direcciones varchar(255)not null,
    mail varchar(255)not null,
    perfil varchar(255)not null
    habilitado tinyint,
  )`;

let createPlatos = `create table if not exists platos(
    id int primary key auto_increment,
    descripcion varchar(255)not null,
    foto varchar(255)not null,
    precio varchar(255)not null,
    habilitado tinyint,
  )`;

let createPedidosPorUsuario = `create table if not exists pedidosPorUsuario(
    idPedido int primary key auto_increment,
    idUsuario int,
    monto varchar(255)not null,
    formaPago varchar(255)not null,
    direccion varchar(255)not null,
    estado varchar(255)not null,
    fecha DATETIME
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
  )`;

let createEstados = `create table if not exists estados(
    id int primary key auto_increment,
    descripcion varchar(255)not null
  )`;

let createPlatosPorPedido = `create table if not exists productosPedidos(
    idPlatosPorPedido int primary key auto_increment, //id de la tabla
    idPedido int, //id del pedido 
    idPlato int, //id del plato que tiene el pedido
    cantidadPlato int // cantidad de ese plato en ese pedido
  )`;


let insertarAdmin = `INSERT INTO usuarios(
  nombreApellido, usuario, contrasenia, telefono, direcciones, mail, perfil, habilitados)
  values('admin', 'admin', 'admin', 111111, 'calle falsa 123', 'admin@admin.com', 'admin', 1)
)`

connection.query(createUsuarios, function (err, results, fields) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(results)
  }

});

connection.query(insertarAdmin, function (err, results, fields) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(results)
  }

});

connection.query(createPlatos, function (err, results, fields) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(results)
  }

});

connection.query(createPedidosPorUsuario, function (err, results, fields) {
  if (err) {
      console.log(err.message);
  } else {
      console.log(results)
  }

});

connection.query(createPlatosPorPedido, function (err, results, fields) {
  if (err) {
      console.log(err.message);
  } else {
      console.log(results)
  }

});
connection.query(createEstados, function (err, results, fields) {
  if (err) {
      console.log(err.message);
  } else {
      console.log(results)
  }

});

