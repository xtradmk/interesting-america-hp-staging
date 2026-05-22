import { globalsAdminsAndEditors } from '../access/authz.mjs'
import { linkFields } from '../fields/link.mjs'

export const Footer = {
  slug: 'footer',
  label: 'Footer',
  access: globalsAdminsAndEditors,
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'newsletterPrompt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'newsletterPlaceholder',
      type: 'text',
      defaultValue: 'Email address',
    },
    {
      name: 'newsletterButtonLabel',
      type: 'text',
      defaultValue: 'Subscribe',
    },
    {
      name: 'navItems',
      type: 'array',
      minRows: 1,
      required: true,
      fields: linkFields(),
    },
    {
      name: 'copyrightLine',
      type: 'text',
      required: true,
    },
  ],
}

