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
        }
    ],
  }