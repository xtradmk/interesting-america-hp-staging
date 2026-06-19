module.exports = function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon-precomposed.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("src/favicon-20260527.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16-20260527.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32-20260527.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon-20260527.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-192x192-20260527.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512-20260527.png");
  eleventyConfig.addPassthroughCopy("src/favicon-20260618.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-20260618.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16-20260618.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32-20260618.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon-20260618.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-192x192-20260618.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512-20260618.png");
  eleventyConfig.addPassthroughCopy("src/favicon-20260619.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-20260619.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16-20260619.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32-20260619.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon-20260619.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-192x192-20260619.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512-20260619.png");
  eleventyConfig.addPassthroughCopy("src/favicon-20260619-02.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-20260619-02.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16-20260619-02.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32-20260619-02.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon-20260619-02.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-192x192-20260619-02.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512-20260619-02.png");

  // Watch targets
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./src/js/");

  // Year shortcode for footer
  eleventyConfig.addShortcode("year", () => {
    return new Date().getFullYear();
  });

  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

  return {
    pathPrefix,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
      layouts: "_includes/layouts"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
