import path from 'path'

import { isAdmin, isAdminOrEditor } from '../access/authz.mjs'
import { FRONTEND_IMAGE_ROOT } from '../lib/env.mjs'

export const Media = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'updatedAt'],
  },
  upload: {
    staticDir: FRONTEND_IMAGE_ROOT,
    mimeTypes: ['image/*'],
    adminThumbnail: 'card',
    imageSizes: [
      {
        name: 'card',
        width: 960,
        height: 640,
        position: 'centre',
      },
      {
        name: 'thumbnail',
        width: 400,
        height: 280,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'credit',
      type: 'text',
    },
    {
      name: 'seedKey',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'frontendPath',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            const filename = data?.filename || value
            return filename ? `/images/uploads/cms/${path.basename(filename)}` : value
          },
        ],
      },
    },
  ],
}
