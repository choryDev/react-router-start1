import { type LoaderFunctionArgs, redirect } from 'react-router';

import type * as Route from './+types._index';

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = request.headers.get('Cookie');

	return userId ? redirect('/dashboard') : redirect('/login');
}
