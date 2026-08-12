import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';

interface Env {
  CATALOGUES: R2Bucket;
  ASSETS: Fetcher;
}

const CATALOGUE_FILES: Record<string, string> = {
  '/catalogue1.pdf': 'catalogue1.pdf',
  '/catalogue2.pdf': 'catalogue2.pdf',
  '/catalogue3.pdf': 'catalogue3.pdf',
  '/catalogue4.pdf': 'catalogue4.pdf',
  '/catalogue5.pdf': 'catalogue5.pdf',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.CATALOGUES) {
      return new Response('Liaison R2 CATALOGUES non configurée', { status: 500 });
    }

    const url = new URL(request.url);
    const objectKey = CATALOGUE_FILES[url.pathname];

    if (objectKey) {
      const object = await env.CATALOGUES.get(objectKey);
      if (!object || !object.body) {
        return new Response('Catalogue non trouvé dans R2', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Content-Disposition', `attachment; filename="${objectKey}"`);
      headers.set('Access-Control-Allow-Origin', '*');

      if (object.size) {
        headers.set('Content-Length', object.size.toString());
      }

      return new Response(object.body, { headers });
    }

    if (!env.ASSETS) {
      return new Response('Aucun asset statique configuré', { status: 500 });
    }

    return env.ASSETS.fetch(request);
  },
};
