module.exports = function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("src/favicon-20260527.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16-20260527.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32-20260527.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon-20260527.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-192x192-20260527.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512-20260527.png");

  // Watch targets
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./src/js/");
  eleventyConfig.addWatchTarget("./cms/src/");
  eleventyConfig.addWatchTarget("./cms/data/");

  // Year shortcode for footer
  eleventyConfig.addShortcode("year", () => {
    return new Date().getFullYear();
  });

  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const autoPathPrefix = repoName ? `/${repoName}/` : "/interesting-america-hp/";
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || autoPathPrefix;

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
