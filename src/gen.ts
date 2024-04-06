import { randomUUID } from 'node:crypto';
import { genFromTemplate } from './templates/template.html.js';


interface GenHtmlArgs {
	imageSrc: string;
	title: string;
}

export async function genHTML({ imageSrc, title }: GenHtmlArgs, bucket: R2Bucket): Promise<string> {
		const html = genFromTemplate({ imageSrc, title });

		const uuid = randomUUID();
		const key = `gen/${uuid}.html`;
		await bucket.put(key, html, { httpMetadata: { contentType: 'text/html' } });
		return key;
}
