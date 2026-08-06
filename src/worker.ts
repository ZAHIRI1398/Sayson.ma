import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';

interface Env {
  CATALOGUES: R2Bucket;
  ASSETS: Fetcher;
}

const CATALOGUE_FILES: Record<string, string> = {
  '/catalogue1.pdf': 'catalogue1.pdf',
  '/catalogue2.pdf': 'catalogue2.pdf',
  '/catalogue3.pdf': 'catalogue3.pdf',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const objectKey = CATALOGUE_FILES[url.pathname];

    if (objectKey) {
      const object = await env.CATALOGUES.get(objectKey);
      if (!object) {
        return new Response('Catalogue non trouvé', { status: 404 });
      }

      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', `attachment; filename="${objectKey}"`);
      headers.set('Access-Control-Allow-Origin', '*');

      if (object.size) {
        headers.set('Content-Length', object.size.toString());
      }

      // L'objet R2 body est un ReadableStream<Uint8Array> ou null
      return new Response(object.body, { headers });
    }

    // Pour toutes les autres routes, servir les assets statiques (Vite dist)
    return env.ASSETS.fetch(request);
  },
};
