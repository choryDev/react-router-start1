import { Outlet } from 'react-router';

import type * as Route from './+types.route';

export default function LoginRoute() {
	return (
		<div className="flex h-screen w-full items-center justify-center px-4">
			<Outlet />
		</div>
	);
}
