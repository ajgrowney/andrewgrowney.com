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
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Andrew Growney",
        short_name: "AG",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#000000",
        display: "standalone", // This hides the URL bar when launched from the home screen
        icon: "src/images/icon.png", // Path to app icon
      },
    },
    `gatsby-plugin-offline`
  ]
};