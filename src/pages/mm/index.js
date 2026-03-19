import React from 'react';
import { HomePage2026 } from '../../components/Views/mm2026/js';
import bracketPreviewImage from '../../images/bracket-preview.png';
import { IMAGE_HOST } from '../../images';

const MM2026HomeRoute = () => <HomePage2026 />;

export default MM2026HomeRoute;

export const Head = () => {
	const previewImageUrl = `${IMAGE_HOST}${bracketPreviewImage}`;

	return (
		<>
			<title>Madness Suite</title>
			<meta name="description" property="og:description" content="Build a 2026 bracket, explore team insights, and test March Madness models." />
			<meta property="og:title" content="Madness Suite" />
			<meta property="og:type" content="website" />
			<meta property="og:image" content={previewImageUrl} />
			<meta property="og:image:alt" content="Madness Suite bracket preview" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content="Madness Suite" />
			<meta name="twitter:description" content="Build a 2026 bracket, explore team insights, and test March Madness models." />
			<meta name="twitter:image" content={previewImageUrl} />
			<meta name="author" content="Andrew Growney" />
		</>
	);
};