module.exports = {
  plugins: [
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-netlify-identity`,
      options: {
        url: `https://boring-brown-d07175.netlify.app`
      }
    }
  ]
};