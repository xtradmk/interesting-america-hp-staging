const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Markdown setup
  const md = new markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  
  eleventyConfig.setLibrary("md", md);
  
  // Filters
  eleventyConfig.addFilter("markdown", function(content) {
    return md.render(content);
  });
  
  eleventyConfig.addFilter("dateFormat", function(date) {
    return new Date().getFullYear();
  });
  
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/images");
  
  // Watch targets for live reload
  eleventyConfig.addWatchTarget("./src/_data/");
  
  return {
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
    dataTemplateEngine: false
  };
};
