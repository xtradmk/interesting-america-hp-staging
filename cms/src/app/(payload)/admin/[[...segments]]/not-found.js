import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'

import { importMap } from '../importMap'

export const generateMetadata = ({ params, searchParams }) =>
  generatePageMetadata({ config, params, searchParams })

export default function PayloadAdminNotFound({ params, searchParams }) {
  return NotFoundPage({ config, params, searchParams, importMap })
}

