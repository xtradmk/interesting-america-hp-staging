import { globalsAdminsAndEditors } from '../access/authz.mjs'

export const SEOSettings = {
  slug: 'seo-settings',
  label: 'SEO Settings',
  access: globalsAdminsAndEditors,
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'titleSuffix',
      type: 'text',
      required: true,
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

