const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
exports.crearTarea = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { proyecto } = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    // Revisar si el proyecto actual pertecene al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // Crear un nuevo tarea
    const tarea = new Tarea(req.body);

    // Guardamos el tarea
    await tarea.save();
    res.status(200).json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error' });
  }
};

// Obtiene todos las tareas de un proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    const { proyecto } = req.query;
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    // Revisar si el proyecto actual pertecene al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    const tareas = await Tarea.find({ proyecto }).sort({ creado: 'desc' });
    res.status(200).json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error', error });
  }
};
// Actualizar un tarea
exports.actualizarTarea = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  // extraer la informacion del tarea
  const { nombre } = req.body;
  const nuevoTarea = {};
  if (nombre) {
    nuevoTarea.nombre = nombre;
  }
  try {
    // Extraer el proyecto y comprobar si existe
    const { proyecto, nombre, estado } = req.body;

    // Si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: 'No existe esa tarea' });
    }

    // extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }
    // Crear un objeto con la nueva información
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    // Guardar la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });

    res.status(200).json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error en el servidor' });
  }
};

exports.eliminarTarea = async (req, res) => {
  try {
    // Extraer el proyecto y comprobar si existe
    const { proyecto } = req.query;

    // Si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: 'No existe esa tarea' });
    }

    // extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    console.log(existeProyecto.creador.toString());
    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }

    // Eliminar
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ msg: 'Tarea eliminado' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error en el servidor' });
  }
};
