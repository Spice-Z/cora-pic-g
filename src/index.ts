import { Hono } from 'hono';
import { genHTML } from './gen.js';
import { cors } from 'hono/cors';

type Bindings = {
	BUCKET_CORA_PIC_G: R2Bucket;
	BUCKET_PREVIEW_URL: string;
	NODE_ENV: "local" |  "development" | "production";
};

type Variables = {
	BUCKET_PREVIEW_URL: string;
};

type GenData = {
	base64?: string;
	title?: string;
	width?: string;
	height?: string;
};

const app = new Hono<{
	Bindings: Bindings;
	Variables: Variables;
}>();


app.use('*', cors({
	origin: (_,c) => { 
		if (c.env.NODE_ENV	=== 'local') {
			return '*';
		} 
		if (c.env.NODE_ENV === 'development') {
			return 'http://localhost:3000';
		}
		return 'https://cora-pic.com';
	},
	allowHeaders: ['Content-Type', 'Authorization'],
	allowMethods: ['POST', 'GET', 'OPTIONS'],
	exposeHeaders: ['Content-Length'],
	maxAge: 600,
	credentials: true,
}))

// app.use(async (c, next) => {
//   console.log(`[${c.req.method}] ${c.req.url}`)
//   await next()
// })

app.post('/gen', async (c) => {
	const data = await c.req.json<GenData>();
	if (!data.base64 || !data.title) {
		return c.json({ error: 'Invalid request' }, 400);
	}
	const key = await genHTML(
		{
			base64: data.base64,
			title: data.title,
		},
		c.env.BUCKET_CORA_PIC_G,
		c.env.BUCKET_PREVIEW_URL
	);
	const htmlUrl = `${c.env.BUCKET_PREVIEW_URL}/${key}`;
	return c.json({ url: htmlUrl });
});

export default app;
