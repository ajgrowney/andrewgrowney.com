/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

 module.exports = {
    /* Your site config here */
    plugins: [
        {
            resolve: `gatsby-plugin-s3`,
            options: {
              bucketName: "andrewgrowney.com",
              protocol: "https",
              hostname: "www.andrewgrowney.com"
            },
        },
        {
          resolve: `gatsby-plugin-google-gtag`,
          options: {
            // You can add multiple tracking ids and a pageview event will be fired for all of them.
            trackingIds: [
              "G-BX1ZXYZWMQ" // Google Analytics / GA
            ],
            // This object is used for configuration specific to this plugin
            pluginConfig: {
              // Puts tracking script in the head instead of the body
              head: true
            }
          }
        }
    ],
  }