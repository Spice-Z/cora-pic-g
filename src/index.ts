import { genHTML } from './gen.js';

export interface Env {
	BUCKET_CORA_PIC_G: R2Bucket;
	BUCKET_PREVIEW_URL: string;
}

type GenData = {
	base64?: string;
	title?: string;
	width?: string;
	height?: string;
};

export default {
	async fetch(req: Request, env: Env) {
		let url = new URL(req.url);
		let path = url.pathname.replace(/[/]$/, '');

		if (req.method === 'POST' && path === '/gen') {
			console.log('POST /gen')
			const data = await req.json<GenData>();
			console.log(data)
			if (!data.base64 || !data.title) {
				return new Response('Invalid request', { status: 400 });
			}
			const key = await genHTML(
				{
					base64: data.base64,
					title: data.title,
				},
				env.BUCKET_CORA_PIC_G,
				env.BUCKET_PREVIEW_URL
			);
			const htmlUrl = `${env.BUCKET_PREVIEW_URL}/${key}`;
			return new Response(htmlUrl, { status: 200 });
		} else {
			return new Response('Not found', { status: 404 });
		}
	},
};
