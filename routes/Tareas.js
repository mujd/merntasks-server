// Rutas para Tareas
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
// Crea tareas
// api/tareas
router.post(
  '/',
  auth,
  [
    check('nombre', 'El Nombre del tarea es obligatorio.')
      .not()
      .isEmpty(),
    check('nombre', 'El Proyecto es obligatorio.')
      .not()
      .isEmpty(),
  ],
  tareaController.crearTarea
);
// Obtener todos los tareas de 1 proyecto
router.get('/', auth, tareaController.obtenerTareas);

// Actualizar tarea por ID
router.put(
  '/:id',
  auth,
  [
    check('nombre', 'El nombre del tarea es obligatorio.')
      .not()
      .isEmpty(),
  ],
  tareaController.actualizarTarea
);
// Eliminar tarea por ID
router.delete('/:id', auth, tareaController.eliminarTarea);

module.exports = router;
