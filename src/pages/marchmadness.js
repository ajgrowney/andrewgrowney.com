import React from 'react'
import { HomePage } from '../components/Views/mm/js'
import { MMBracket } from '../images/Blogs/MarchMadnessML'
import { IMAGE_HOST } from '../images'
const mmHome = () => <HomePage />
export default mmHome;

export const Head = ({ location, params, data, pageContext }) => {
    return (
        <>
        <title>{"Madness Suite"}</title>
        <meta name="image" property="og:image" content={`${IMAGE_HOST}${MMBracket}`} />
        <meta name="description" property="og:description" content={"March Madness Predictions"} />
        <meta name="author" content="Andrew Growney" />
        </>
    )
}