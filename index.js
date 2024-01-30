import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { build as esbuild } from "esbuild";
import { URL, fileURLToPath } from "node:url";
import { renderToString } from 'react-dom/server';
import { createElement } from 'react'
const app = new Hono();

app.get("/", async (c) => {
	const Page = await import ('./build/Page.js')
	const html = renderToString(createElement(Page.default))
	return c.html(html);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve(app, async (info) => {
	await build();
	console.log(`App is running on ${info.port}`);
});

async function build() {
	await esbuild({
		bundle: true,
		format:'esm',
		logLevel:'error',
		entryPoints: [resolveApp('Page.jsx')],
		outdir: resolveBuild(),
		packages:'external'
	});
}

const appDir = new URL('./app/',import.meta.url)
const buildDir=  new URL('./build/',import.meta.url)

function resolveApp(path=''){
	return fileURLToPath(new URL(path,appDir))
}
function resolveBuild(path=''){
	return fileURLToPath(new URL(path,buildDir))
}