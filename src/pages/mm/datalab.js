import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const LegacyDataLabRedirect = () => {
	useEffect(() => {
		navigate('/mm-old/datalab', { replace: true });
	}, []);

	return null;
};

export default LegacyDataLabRedirect;