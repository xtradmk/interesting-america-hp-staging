export function linkFields({ withStyle = false } = {}) {
  const fields = [
    {
      name: 'label',
      type: 'text',
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
    },
  ]

  if (withStyle) {
    fields.push({
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Text', value: 'text' },
      ],
    })
  }

  return fields
}
