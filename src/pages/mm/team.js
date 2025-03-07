import React from 'react'
import { TeamPage } from '../../components/Views/mm/js'
import { MMBracket } from '../../images/Blogs/MarchMadnessML'
import { IMAGE_HOST } from '../../images'
import 'bootstrap/dist/css/bootstrap.css'
const tp = () => <TeamPage />
export default tp;

export const Head = ({  location, params, data, pageContext }) => {
    return (
        <>
        <title>Team Profile</title>
        <meta name="image" property="og:image" content={`${IMAGE_HOST}${MMBracket}`} />
        <meta name="description" property="og:description" content="March Madness - Team Profile" />
        <meta name="author" content="Andrew Growney" />
        </>
    )
}