import { globalsAdminsAndEditors } from '../access/authz.mjs'

export const CompanyInfo = {
  slug: 'company-info',
  label: 'Company Info',
  access: globalsAdminsAndEditors,
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'whatsApp',
      type: 'text',
    },
  ],
}

