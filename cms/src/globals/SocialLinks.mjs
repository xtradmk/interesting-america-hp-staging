import { globalsAdminsAndEditors } from '../access/authz.mjs'

export const SocialLinks = {
  slug: 'social-links',
  label: 'Social Links',
  access: globalsAdminsAndEditors,
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
