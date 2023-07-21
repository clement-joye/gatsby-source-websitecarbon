module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-websitecarbon",
      options: {
        url: "www.google.com",
        verbose: true,
        nocache: false,
      },
    },
  ],
};
