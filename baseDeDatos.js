
const mysql = require('mysql2');

let createUsuarios = `create table if not exists usuarios(
    id int primary key auto_increment,
    nombreApellido varchar(255)not null,
    usuario varchar(255)not null,
    contrasenia varchar(255)not null,
    telefono INT not null,
    direcciones varchar(255)not null,
    mail varchar(255)not null,
    perfil varchar(255)not null,
    habilitado int
  )`;

let insertarAdmin = `INSERT INTO usuarios(
  nombreApellido, usuario, contrasenia, telefono, direcciones, mail, perfil, habilitado)
  values('admin', 'admin', 'admin', 111111, 'calle falsa 123', 'admin@admin.com', 'admin', 1)`

let insertarPlato1 = `INSERT INTO platos(descripcion, foto, precio, habilitado)
  values('Tarta de Espinaca', 'null', '200', '1')`;

let insertarPlato2 = `INSERT INTO platos(descripcion, foto, precio, habilitado)
  values('Papas fritas con cheddar', 'null', '300', '1')`;

let insertarPlato3 = `INSERT INTO platos(descripcion, foto, precio, habilitado)
  values('Empanada de Carne', 'null', '150', '1')`;

let insertarPlato4 = `INSERT INTO platos(descripcion, foto, precio, habilitado)
  values('Pizza Napolitana de Masa Madre', 'null', '250', '1')`;

let createPlatos = `create table if not exists platos(
    id int primary key auto_increment,
    descripcion varchar(255) not null,
    foto varchar(255)not null,
    precio varchar(255)not null,
    habilitado int
  )`;

let createPedidosPorUsuario = `create table if not exists pedidosPorUsuario(
    idPedido int primary key auto_increment,
    idUsuario int,
    monto varchar(255)not null,
    formaPago varchar(255)not null,
    direccion varchar(255)not null,
    estado varchar(255)not null,
    fecha DATETIME
  )`;

let createEstados = `create table if not exists estados(
    id int primary key auto_increment,
    descripcion varchar(255)not null
  )`;

let createPlatosPorPedido = `create table if not exists productosPedidos(
    idPlatosPorPedido int primary key auto_increment, 
    idPedido int, 
    idPlato int, 
    cantidadPlato int 
  )`;


configuracionSQL();



function configuracionSQL() {

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

  connection.query(createUsuarios, function (err, results, fields) {
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

   connection.query(insertarAdmin, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results)
    }

  });

  connection.query(insertarPlato1, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results)
    }
  });

  connection.query(insertarPlato2, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results)
    }
  });

  connection.query(insertarPlato3, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results)
    }
  });

  connection.query(insertarPlato4, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results)
    }
  });

}