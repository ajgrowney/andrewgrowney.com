import React from 'react'
import { BracketPage } from '../../components/Views/mm/js'
import { MMBracket } from '../../images/Blogs/MarchMadnessML'
import { IMAGE_HOST } from '../../images'

import 'bootstrap/dist/css/bootstrap.css'
const mm = () => <BracketPage />
export default mm;

export const Head = ({ location, params, data, pageContext }) => {
    console.log("head", location, params, data, pageContext)
    return (
        <>
        <title>{"Bracket Insights"}</title>
        <meta name="image" property="og:image" content={`${IMAGE_HOST}${MMBracket}`} />
        <meta name="description" property="og:description" content={"March Madness Predictions"} />
        <meta name="author" content="Andrew Growney" />
        </>
    )
}