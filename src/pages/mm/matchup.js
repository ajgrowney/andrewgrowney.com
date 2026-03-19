import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const LegacyMatchupRedirect = () => {
	useEffect(() => {
		navigate('/mm-old/matchup', { replace: true });
	}, []);

	return null;
};

export default LegacyMatchupRedirect;