import { linkFields } from '../fields/link.mjs'

const mediaUploadField = (name, label, { required = false } = {}) => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  required,
})

const textAreaField = (name, label, { required = false } = {}) => ({
  name,
  label,
  type: 'textarea',
  required,
})

const richTextField = (name, label, { required = false } = {}) => ({
  name,
  label,
  type: 'richText',
  required,
})

const primaryLinkGroup = {
  name: 'primaryLink',
  type: 'group',
  fields: linkFields({ withStyle: true }),
}

const secondaryLinkGroup = {
  name: 'secondaryLink',
  type: 'group',
  fields: linkFields({ withStyle: true }),
}

export const HeroBlock = {
  slug: 'hero',
  labels: {
    plural: 'Hero Blocks',
    singular: 'Hero Block',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'subpage',
      options: [
        { label: 'Home Slider', value: 'home' },
        { label: 'Subpage Hero', value: 'subpage' },
      ],
      required: true,
    },
    {
      name: 'kicker',
      type: 'text',
    },
    textAreaField('title', 'Title', { required: true }),
    textAreaField('copy', 'Copy'),
    {
      name: 'subcopyItems',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'home',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    textAreaField('typewriterText', 'Typewriter Text'),
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        mediaUploadField('image', 'Image', { required: true }),
        {
          name: 'caption',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'dimmingPercent',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 100,
    },
    primaryLinkGroup,
    {
      ...secondaryLinkGroup,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'home',
      },
    },
  ],
}

export const RichTextBlock = {
  slug: 'richTextSection',
  labels: {
    plural: 'Rich Text Sections',
    singular: 'Rich Text Section',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
    },
    richTextField('content', 'Content', { required: true }),
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: 'regular',
      options: [
        { label: 'Regular', value: 'regular' },
        { label: 'Wide', value: 'wide' },
        { label: 'Legal', value: 'legal' },
      ],
    },
  ],
}

export const ImageBlock = {
  slug: 'image',
  fields: [
    mediaUploadField('image', 'Image', { required: true }),
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'objectPosition',
      type: 'text',
      defaultValue: 'center center',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'contained',
      options: [
        { label: 'Contained', value: 'contained' },
        { label: 'Full Width', value: 'fullWidth' },
      ],
    },
  ],
}

export const GalleryBlock = {
  slug: 'gallery',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'Simple Grid', value: 'grid' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        mediaUploadField('image', 'Image', { required: true }),
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        textAreaField('summary', 'Summary'),
        textAreaField('detail', 'Detail'),
        textAreaField('secondaryDetail', 'Secondary Detail'),
      ],
    },
  ],
}

export const CTABlock = {
  slug: 'cta',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    textAreaField('text', 'Text'),
    {
      name: 'background',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    primaryLinkGroup,
  ],
}

export const FAQBlock = {
  slug: 'faq',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        richTextField('answer', 'Answer', { required: true }),
      ],
    },
  ],
}

export const LogosBlock = {
  slug: 'logos',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'text',
      options: [
        { label: 'Text Labels', value: 'text' },
        { label: 'Logo Images', value: 'image' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          ...mediaUploadField('logo', 'Logo'),
          admin: {
            condition: (_, siblingData) => siblingData?.displayMode === 'image',
          },
        },
      ],
    },
  ],
}

export const StatsBlock = {
  slug: 'stats',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        textAreaField('description', 'Description'),
      ],
    },
  ],
}

export const TestimonialBlock = {
  slug: 'testimonial',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        textAreaField('quote', 'Quote', { required: true }),
        {
          name: 'author',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
  ],
}

export const SplitSectionBlock = {
  slug: 'splitSection',
  fields: [
    mediaUploadField('image', 'Image', { required: true }),
    {
      name: 'headline',
      type: 'text',
      required: true,
    },
    richTextField('content', 'Content', { required: true }),
    {
      name: 'reverse',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'objectPosition',
      type: 'text',
      defaultValue: 'center center',
    },
    primaryLinkGroup,
  ],
}

export const SpacerBlock = {
  slug: 'spacer',
  fields: [
    {
      name: 'size',
      type: 'select',
      required: true,
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
  ],
}

export const ProcessStepsBlock = {
  slug: 'processSteps',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'index',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        textAreaField('text', 'Text', { required: true }),
        {
          name: 'tone',
          type: 'select',
          required: true,
          defaultValue: 'blue',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Red', value: 'red' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    },
  ],
}

export const TimelineBlock = {
  slug: 'timeline',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        textAreaField('text', 'Text', { required: true }),
      ],
    },
  ],
}

export const ClientListBlock = {
  slug: 'clientList',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

export const ContactFormBlock = {
  slug: 'contactForm',
  fields: [
    textAreaField('introText', 'Intro Text'),
    textAreaField('noteText', 'Direct Email Note'),
    {
      name: 'showTrustBadge',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export const PageBlocks = [
  HeroBlock,
  RichTextBlock,
  ImageBlock,
  GalleryBlock,
  CTABlock,
  FAQBlock,
  LogosBlock,
  StatsBlock,
  TestimonialBlock,
  SplitSectionBlock,
  SpacerBlock,
  ProcessStepsBlock,
  TimelineBlock,
  ClientListBlock,
  ContactFormBlock,
]
