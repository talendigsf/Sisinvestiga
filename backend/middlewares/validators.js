import { body, param } from 'express-validator';


// #region -------------------- Validaciones para los Usuarios ------------------- //

export const validateCreateUser = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'),
  body('especializacion').notEmpty().withMessage('La especialización es requerida'),
  body('responsabilidades').isArray().withMessage('Las responsabilidades deben ser un array'),
  body('responsabilidades.*').notEmpty().withMessage('Cada responsabilidad debe ser un string no vacío'),
];

export const validateUpdateUser = [
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('apellido').optional().notEmpty().withMessage('El apellido no puede estar vacío'),
  body('email').optional().isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'),
  body('especializacion').optional().notEmpty().withMessage('La especialización no puede estar vacía'),
  body('responsabilidades').optional().isArray().withMessage('Las responsabilidades deben ser un array'),
  body('responsabilidades.*').optional().notEmpty().withMessage('Cada responsabilidad debe ser un string no vacío'),
];

// #endregion ------------------------------------------------------------------------------------------------------------ //

// #region -------------------- Validaciones para los Roles ------------------- //

export const validateCreateRole = [
  body('roleName')
    .notEmpty().withMessage('El nombre del rol es requerido')
    .isString().withMessage('El nombre del rol debe ser una cadena de texto')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre del rol debe tener entre 2 y 50 caracteres'),
];

export const validateUpdateRole = [
  body('roleName')
    .optional()
    .notEmpty().withMessage('El nombre del rol no puede estar vacío')
    .isString().withMessage('El nombre del rol debe ser una cadena de texto')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre del rol debe tener entre 2 y 50 caracteres'),
];

// #endregion ------------------------------------------------------------------------------------------------------------ //

// #region -------------------- Validaciones para los Proyectos ------------------- //

export const validateCreateProject = [
  body('nombre').notEmpty().withMessage('El nombre del proyecto es requerido'),
  body('descripcion').notEmpty().withMessage('La descripción del proyecto es requerida'),
  body('presupuesto').isNumeric().withMessage('El presupuesto debe ser un número'),
  body('cronograma.fechaInicio').isISO8601().toDate().withMessage('La fecha de inicio debe ser una fecha válida'),
  body('cronograma.fechaFin').isISO8601().toDate().withMessage('La fecha de fin debe ser una fecha válida'),
  body('investigadores').optional().isArray().withMessage('Los investigadores deben ser una lista'),
  body('hitos').isArray().withMessage('Los hitos deben ser una lista'),
  body('hitos.*.nombre').notEmpty().withMessage('El nombre del hito es requerido'),
  body('hitos.*.fecha').isISO8601().toDate().withMessage('La fecha del hito debe ser una fecha válida'),
];

export const validateUpdateProject = [
  body('nombre').optional().notEmpty().withMessage('El nombre del proyecto no puede estar vacío'),
  body('descripcion').optional().notEmpty().withMessage('La descripción del proyecto no puede estar vacía'),
  body('presupuesto').optional().isNumeric().withMessage('El presupuesto debe ser un número'),
  body('cronograma.fechaInicio').optional().isISO8601().toDate().withMessage('La fecha de inicio debe ser una fecha válida'),
  body('cronograma.fechaFin').optional().isISO8601().toDate().withMessage('La fecha de fin debe ser una fecha válida'),
  body('investigadores').optional().isArray().withMessage('Los investigadores deben ser una lista'),
  body('hitos').optional().isArray().withMessage('Los hitos deben ser una lista'),
  body('hitos.*.nombre').optional().notEmpty().withMessage('El nombre del hito es requerido'),
  body('hitos.*.fecha').optional().isISO8601().toDate().withMessage('La fecha del hito debe ser una fecha válida'),
];

// #endregion ------------------------------------------------------------------------------------------------------------ //

// #region  -------------------- Validaciones para las Publicaciones ------------------- //

export const validateCreatePublication = [
  body('titulo').notEmpty().withMessage('El título es requerido'),
  body('fecha').isISO8601().toDate().withMessage('La fecha debe ser válida'),
  body('proyecto').isMongoId().withMessage('ID de proyecto inválido'),
  body('revista').notEmpty().withMessage('La revista es requerida'),
  body('tipoPublicacion').isIn(['Articulo', 'Informe', 'Tesis', 'Presentacion', 'Otro']).withMessage('Tipo de publicación inválido'),
  body('idioma').notEmpty().withMessage('El idioma es requerido'),
];

export const validateUpdatePublication = [
  body('titulo').optional().notEmpty().withMessage('El título no puede estar vacío'),
  body('fecha').optional().isISO8601().toDate().withMessage('La fecha debe ser válida'),
  body('proyecto').optional().isMongoId().withMessage('ID de proyecto inválido'),
  body('revista').optional().notEmpty().withMessage('La revista no puede estar vacía'),
  body('tipoPublicacion').optional().isIn(['Articulo', 'Informe', 'Tesis', 'Presentacion', 'Otro']).withMessage('Tipo de publicación inválido'),
  body('idioma').optional().notEmpty().withMessage('El idioma no puede estar vacío'),
];

// #endregion ------------------------------------------------------------------------------------------------------------ //

// #region -------------------- Validaciones para las Evaluaciones ------------------- //

export const validateCreateEvaluation = [
  body('puntuacion').isInt({ min: 0, max: 100 }).withMessage('La puntuación debe ser un número entre 0 y 100'),
  body('comentarios').isString().notEmpty().withMessage('Los comentarios son requeridos'),
];

export const validateUpdateEvaluation = [
  body('puntuacion').isInt({ min: 0, max: 100 }).withMessage('La puntuación debe ser un número entre 0 y 100'),
  body('comentarios').isString().notEmpty().withMessage('Los comentarios son requeridos'),
];
// #endregion ------------------------------------------------------------------------------------------------------------ //

// #region -------------------- Validaciones para las Request ------------------- //

export const ValidateCreateRequest = [
  body('tipoSolicitud').isIn(['Unirse a Proyecto', 'Recursos', 'Aprobación', 'Permiso', 'Otro']).withMessage('Tipo de solicitud inválido'),
  body('descripcion').notEmpty().withMessage('La descripción es requerida'),
  body('proyecto').optional().isMongoId().withMessage('ID de proyecto inválido'),
];

export const ValidateUpdateRequest = [
  body('estado').optional().isIn(['Pendiente', 'Aprobada', 'Rechazada', 'En Proceso']).withMessage('Estado inválido'),
  body('comentarios').optional().isString().notEmpty().withMessage('El comentario no puede estar vacío'),
];

// #endregion ------------------------------------------------------------------------------------------------------------ //

// #region -------------------- Validaciones para los Olvide Password ------------------- //
export const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un correo electrónico válido'),
];
// #endregion ------------------------------------------------------------------------------------------------------------ //

// #region -------------------- Validaciones para los Resetar Password ------------------- //
export const validateResetPassword = [
  param('token')
    .notEmpty()
    .withMessage('El token de restablecimiento es requerido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage('La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial'),
];
// #endregion ------------------------------------------------------------------------------------------------------------ //