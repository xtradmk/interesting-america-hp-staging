class CMSGeneratedPagesTemplate {
  data() {
    return {
      layout: 'base.njk',
      pagination: {
        data: 'cms.generatedPages',
        size: 1,
        alias: 'cmsGeneratedPage',
      },
      permalink: (data) => data.cmsGeneratedPage?.permalinkPath || false,
      eleventyComputed: {
        title: (data) => data.cmsGeneratedPage?.title || '',
        metaTitle: (data) => data.cmsGeneratedPage?.seoTitle || data.cmsGeneratedPage?.title || '',
        description: (data) => data.cmsGeneratedPage?.seoDescription || data.cms?.seoSettings?.defaultDescription || '',
        pageClasses: (data) => data.cmsGeneratedPage?.pageClasses || '',
        hideFooter: (data) => Boolean(data.cmsGeneratedPage?.hideFooter),
        metaOgImage: (data) => data.cmsGeneratedPage?.ogImagePath || data.cms?.seoSettings?.defaultOgImagePath || '',
      },
    }
  }

  render(data) {
    return data.cmsGeneratedPage?.renderedHtml || ''
  }
}

module.exports = CMSGeneratedPagesTemplate
