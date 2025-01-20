import { validationResult } from 'express-validator';
import PublicationService from '../services/publicationService.js';
import User from '../models/User.js';
import emailService from '../services/emailService.js';
import { BadRequestError } from '../utils/errors.js';

// #region Crear Publicacion ************************************************* //
export const createPublication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Error de validación', errors.array());
    }

    if (typeof req.body.palabrasClave === 'string') {
      req.body.palabrasClave = JSON.parse(req.body.palabrasClave);
    }

    const publication = await PublicationService.createPublication(req.body, req.user._id, req.userRole);

    // Obtener el autor principal
    const mainAuthor = await User.findById(publication.autores[0]);

    // Enviar email de notificación de creación
    await emailService.sendPublicationCreationEmail(mainAuthor, publication);

    res.status(201).json({ message: 'Publicación creada exitosamente', publication });
  } catch (error) {
    next(error);
  }
};

// #endregion *************************************************************** //


// #region Actualizar Publicacion ************************************************* //
export const updatePublication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Error de validación', errors.array());
    }

    const { id } = req.params;

    if (typeof req.body.palabrasClave === 'string') {
      req.body.palabrasClave = JSON.parse(req.body.palabrasClave);
    }

    // Parsear 'existingAnexos' si viene como cadena JSON
    if (typeof req.body.existingAnexos === 'string') {
      req.body.existingAnexos = JSON.parse(req.body.existingAnexos);
    }
    // Combinar 'existingAnexos' y 'anexos' (nuevos anexos subidos)
    const combinedAnexos = [];
    // Añadir anexos existentes
    if (Array.isArray(req.body.existingAnexos)) {
      combinedAnexos.push(...req.body.existingAnexos);
    }
    // Añadir nuevos anexos (si los hay)
    if (Array.isArray(req.body.anexos)) {
      combinedAnexos.push(...req.body.anexos);
    } else if (req.body.anexos) {
      // Si 'anexos' es un solo objeto
      combinedAnexos.push(req.body.anexos);
    }
    // Asignar el arreglo combinado de anexos a 'req.body.anexos'
    req.body.anexos = combinedAnexos;

    // Eliminar 'existingAnexos' de 'req.body' para que no interfiera con la validación
    delete req.body.existingAnexos;

    const publication = await PublicationService.updatePublication(id, req.body, req.user._id, req.userRole);
    res.status(200).json({ message: 'Publicación actualizada correctamente', publication });
  } catch (error) {
    next(error);
  }
};

// #endregion *************************************************************** //

// #region Actualizar Publicacion Para Admins ************************************************* //
export const updateAdmPublication = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Parse JSON strings
    ['palabrasClave', 'existingAnexos', 'autores'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        req.body[field] = JSON.parse(req.body[field]);
      }
    });

    // Combine existing and new anexos
    const combinedAnexos = [
      ...(Array.isArray(req.body.existingAnexos) ? req.body.existingAnexos : []),
      ...(Array.isArray(req.body.anexos) ? req.body.anexos : [req.body.anexos].filter(Boolean))
    ];

    // Assign combined anexos to req.body.anexos
    req.body.anexos = combinedAnexos;

    // Remove existingAnexos from req.body
    delete req.body.existingAnexos;

    const publication = await PublicationService.updateAdmPublication(id, req.body);

    res.status(200).json({ message: 'Publicación actualizada correctamente', publication });
  } catch (error) {
    next(error);
  }
};

// #endregion *************************************************************** //


// #region Eliminar publicaciones ************************************************* //

export const deletePublication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const publication = await PublicationService.deletePublication(id, req.user._id, req.userRole);

    // Obtener el autor principal
    const mainAuthor = await User.findById(publication.autores[0]);
    const isAdmin = req.userRole === 'Administrador';

    // Enviar email de notificación de eliminación
    await emailService.sendPublicationDeletionEmail(mainAuthor, publication, isAdmin);

    res.status(200).json(publication);
  } catch (error) {
    next(error);
  }
};

// #endregion **************************** END ************************************************ //


// #region Restaurar Publicación (Soft Restore) ************************************************* //
export const restorePublication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const publication = await PublicationService.restorePublication(id, req.user._id, req.userRole);

    // Obtener el autor principal
    const mainAuthor = await User.findById(publication.autores[0]);

    // Enviar email de notificación de restauración
    await emailService.sendPublicationRestorationEmail(mainAuthor, publication);

    res.status(200).json(publication);
  } catch (error) {
    next(error);
  }
};

// #endregion ************************************************************************************ //


// #region ********************************  Seccion de busqueda ************************************************* //

// #region Obtener todas las publicaciones ************************************************* //
export const getAllPublications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tipoPublicacion, estado, titulo, isDeleted } = req.query;
    const filters = {};
    if (tipoPublicacion) filters.tipoPublicacion = tipoPublicacion;
    if (estado) filters.estado = estado;
    if (titulo) filters.titulo = titulo;
    if (isDeleted !== undefined) filters.isDeleted = isDeleted === 'true';

    const userRole = req.userRole || 'Invitado';

    const result = await PublicationService.getAllPublications(filters, parseInt(page), parseInt(limit), userRole);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// #endregion **************************** END ************************************************ //


// #region Obtener tus propias publicaciones ************************************************* //
export const getUserPublications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await PublicationService.getUserPublications(req.user._id, page, limit, search);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// #endregion **************************** END ************************************************ //

// #region Obtener publicaciones por ID ************************************************* //
export const getPubById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.userRole || 'Invitado';

    const publication = await PublicationService.getPubById(id, userRole);
    res.status(200).json(publication);
  } catch (error) {
    next(error);
  }
}

//  #endregion **************************** END ************************************************ //


// #region Obtener publicaciones por el titulo ************************************************* //

export const getPubByTitle = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    if (!query) {
      throw new BadRequestError('Se requiere un término de búsqueda');
    }
    const result = await PublicationService.searchPublications(query, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

// #endregion **************************** END ************************************************ //

//#endregion **************************** END ************************************************ //