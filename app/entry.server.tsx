import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable } from '@react-router/node';
import { isbot } from 'isbot';
import {
	type RenderToPipeableStreamOptions,
	renderToPipeableStream,
} from 'react-dom/server';
import {
	type AppLoadContext,
	type EntryContext,
	ServerRouter,
} from 'react-router';

const ABORT_DELAY = 5_000;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	loadContext: AppLoadContext,
) {
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const userAgent = request.headers.get('user-agent');

		const readyOption: keyof RenderToPipeableStreamOptions =
			(userAgent && isbot(userAgent)) || routerContext.isSpaMode
				? 'onAllReady'
				: 'onShellReady';

		const { pipe, abort } = renderToPipeableStream(
			<ServerRouter
				context={routerContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>,
			{
				[readyOption]() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set('Content-Type', 'text/html');

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					if (shellRendered) {
						console.error(error);
					}
				},
			},
		);

		setTimeout(abort, ABORT_DELAY);
	});
}
