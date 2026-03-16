module.exports = function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Watch targets
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./src/js/");

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
