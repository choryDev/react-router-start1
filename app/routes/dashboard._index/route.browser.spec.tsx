import { createRoutesStub } from 'react-router';
import { test } from 'vitest';
import { render } from 'vitest-browser-react';

import Component from './route';

const ReactRouterStub = createRoutesStub([
	{
		path: '/dashboard',
		Component,
	},
]);

test('Render', async () => {
	render(<ReactRouterStub />);
});
