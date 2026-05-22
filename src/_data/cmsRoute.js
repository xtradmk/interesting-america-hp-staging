module.exports = function createCmsRouteData(slug, { excludeFromCollections = false } = {}) {
  return {
    layout: 'base.njk',
    templateEngineOverride: 'njk',
    eleventyExcludeFromCollections: excludeFromCollections,
    eleventyComputed: {
      cmsPage: (data) => data.cms?.pagesBySlug?.[slug],
      title: (data) => data.cms?.pagesBySlug?.[slug]?.title || '',
      metaTitle: (data) => data.cms?.pagesBySlug?.[slug]?.seoTitle || data.cms?.pagesBySlug?.[slug]?.title || '',
      description: (data) => data.cms?.pagesBySlug?.[slug]?.seoDescription || data.cms?.seoSettings?.defaultDescription || '',
      pageClasses: (data) => data.cms?.pagesBySlug?.[slug]?.pageClasses || '',
      hideFooter: (data) => Boolean(data.cms?.pagesBySlug?.[slug]?.hideFooter),
      metaOgImage: (data) => data.cms?.pagesBySlug?.[slug]?.ogImagePath || data.cms?.seoSettings?.defaultOgImagePath || '',
    },
  }
}
