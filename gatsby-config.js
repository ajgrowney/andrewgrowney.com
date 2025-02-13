/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `andrewgrowney.com`,
    siteUrl: `https://www.andrewgrowney.com`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "G-BX1ZXYZWMQ", // Google Analytics / GA
        ],
      },
    }
  ]
};