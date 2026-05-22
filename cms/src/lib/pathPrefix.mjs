export function resolvePathPrefix({
  repository = process.env.GITHUB_REPOSITORY,
  explicitPrefix = process.env.ELEVENTY_PATH_PREFIX,
} = {}) {
  if (explicitPrefix) {
    return normalizePrefix(explicitPrefix)
  }

  const repoName = repository?.split('/')[1]

  if (!repoName) {
    return '/'
  }

  return normalizePrefix(`/${repoName}/`)
}

export function normalizePrefix(value = '/') {
  if (!value || value === '/') {
    return '/'
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`

  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export function prefixPath(pathname = '/', prefix = '/') {
  if (!pathname) return prefix === '/' ? '/' : prefix
  if (/^(https?:)?\/\//.test(pathname) || pathname.startsWith('mailto:') || pathname.startsWith('tel:')) {
    return pathname
  }

  const normalizedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname

  if (prefix === '/') {
    return `/${normalizedPath}`.replace(/\/+$/, (match) => (match.length > 1 ? '/' : match))
  }

  return `${prefix}${normalizedPath}`.replace(/\/{2,}/g, '/').replace(/^\/\//, '/')
}

