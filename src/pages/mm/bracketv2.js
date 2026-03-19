import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const LegacyBracketV2Redirect = () => {
	useEffect(() => {
		navigate('/mm-old/bracketv2', { replace: true });
	}, []);

	return null;
};

export default LegacyBracketV2Redirect;