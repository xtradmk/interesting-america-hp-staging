import { globalsAdminsAndEditors } from '../access/authz.mjs'
import { linkFields } from '../fields/link.mjs'

export const Header = {
  slug: 'header',
  label: 'Header',
  access: globalsAdminsAndEditors,
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      required: true,
    },
    {
      name: 'brandAriaLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      required: true,
      minRows: 1,
      fields: linkFields(),
    },
  ],
}

