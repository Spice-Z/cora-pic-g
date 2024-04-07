import { randomUUID } from 'node:crypto';
import { genFromTemplate } from './templates/template.html.js';
import { detectType } from './utils.js';


interface GenHtmlArgs {
	base64: string;
	title: string;
}

export async function genHTML({ base64, title }: GenHtmlArgs, bucket: R2Bucket, bucketPreviewUrl: string): Promise<string> {
	const base64Image = base64.split(';base64,').pop();
	if (!base64Image) {
		throw new Error('Invalid base64 image');
	}
	const imageType = detectType(base64Image);
	if (!imageType) {
		throw new Error('Invalid image type');
	}
	const imageBinary = Uint8Array.from(atob(base64Image), (c) => c.charCodeAt(0))
	const uuid = randomUUID();
	const imageKey = `gen/${uuid}.${imageType.suffix}`;
	try	{
		await bucket.put(imageKey, imageBinary, { httpMetadata: { contentType: imageType.mimeType } });
	} catch	(e) {
		throw new Error('Error saving image');
	}
	const imageSrc = `${bucketPreviewUrl}/${imageKey}`;

		const html = genFromTemplate({ imageSrc, title });
		const key = `gen/${uuid}.html`;
		await bucket.put(key, html, { httpMetadata: { contentType: 'text/html' } });
		return key;
}
