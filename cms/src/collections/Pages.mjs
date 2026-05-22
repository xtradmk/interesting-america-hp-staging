import { PageBlocks } from '../blocks/index.mjs'
import { adminsAndEditors } from '../access/authz.mjs'
import { slugify } from '../lib/slugify.mjs'

const PREVIEW_BASE_URL = process.env.CMS_PUBLIC_SERVER_URL || 'http://127.0.0.1:3000'

export const Pages = {
  slug: 'pages',
  access: adminsAndEditors,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: (doc) => {
      if (!doc?.slug) return PREVIEW_BASE_URL
      return `${PREVIEW_BASE_URL}/preview/${doc.slug}?secret=${process.env.PAYLOAD_PREVIEW_SECRET || ''}`
    },
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                position: 'sidebar',
              },
              hooks: {
                beforeValidate: [
                  ({ value, siblingData }) => slugify(value || siblingData?.title || ''),
                ],
              },
            },
            {
              name: 'pageClasses',
              type: 'text',
              defaultValue: 'subpage-home',
            },
            {
              name: 'hideFooter',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'pageBlocks',
              type: 'blocks',
              required: true,
              blocks: PageBlocks,
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
            },
            {
              name: 'seoDescription',
              type: 'textarea',
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
}

