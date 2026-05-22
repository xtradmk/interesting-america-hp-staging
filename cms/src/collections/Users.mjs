import { isAdmin } from '../access/authz.mjs'

export const Users = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: true,
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return user.id === id
    },
    update: ({ req: { user }, id, data }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.id !== id) return false
      return data?.role ? false : true
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}

