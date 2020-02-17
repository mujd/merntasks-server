const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
exports.crearProyecto = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    // Crear un nuevo proyecto
    const proyecto = new Proyecto(req.body);

    // Guardar creador via JWT
    proyecto.creador = req.usuario.id;

    // Guardamos el proyecto
    await proyecto.save();
    res.status(200).json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error' });
  }
};

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.status(200).json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error' });
  }
};
// Actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  // extraer la informacion del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);

    // si el proyecto existe o no
    if (!proyecto) {
      res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // verificar creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // actualizar
    proyecto = await Proyecto.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    res.status(200).json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error en el servidor' });
  }
};

exports.eliminarProyecto = async (req, res) => {
  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);

    // si el proyecto existe o no
    if (!proyecto) {
      res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // verificar creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // actualizar
    proyecto = await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ msg: 'Proyecto eliminado' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error en el servidor' });
  }
};
