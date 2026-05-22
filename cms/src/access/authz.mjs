function hasRole(user, roles) {
  if (!user) return false
  return roles.includes(user.role)
}

export const isAdmin = ({ req: { user } }) => hasRole(user, ['admin'])

export const isAdminOrEditor = ({ req: { user } }) => hasRole(user, ['admin', 'editor'])

export const authenticatedReadOrPublished = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const adminsOnly = {
  create: isAdmin,
  delete: isAdmin,
  read: isAdmin,
  update: isAdmin,
}

export const adminsAndEditors = {
  create: isAdminOrEditor,
  delete: isAdmin,
  read: authenticatedReadOrPublished,
  readVersions: isAdminOrEditor,
  update: isAdminOrEditor,
}

export const globalsAdminsAndEditors = {
  read: authenticatedReadOrPublished,
  update: isAdminOrEditor,
}

