import { genHTML } from './gen.js';

export interface Env {
	BUCKET_CORA_PIC_G: R2Bucket;
	BUCKET_PREVIEW_URL: string;
}

export default {
	async fetch(req: Request, env: Env) {
		console.log(env)
		let url = new URL(req.url);
		let path = url.pathname.replace(/[/]$/, '');

		switch (path) {
			case '/gen': {
				const key = await genHTML(
					{
						imageSrc: 'https://www.cora-pic.com/_next/image?url=%2Fimages%2Fja%2Fsamples%2Ftv_subtitle.jpg&w=256&q=75',
						title: 'Example',
					},
					env.BUCKET_CORA_PIC_G
				);
				const htmlUrl = `${env.BUCKET_PREVIEW_URL}/${key}`;
				return new Response(htmlUrl, { status: 200 });
			}
			default: {
				return new Response('Not found', { status: 404 });
			}
		}
	},
};
