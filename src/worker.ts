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
  '/catalogue6.pdf': 'catalogue6.pdf',
  '/catalogue7.pdf': 'catalogue7.pdf',
  '/catalogue8.pdf': 'catalogue8.pdf',
  '/catalogue9.pdf': 'catalogue9.pdf',
};

const VIDEO_FILES: Record<string, string> = {
  '/Video1.mp4': 'Video1.mp4',
  '/video3.mp4': 'video3.mp4',
  '/video4.mp4': 'video4.mp4',
  '/Video5.mp4': 'Video5.mp4',
  '/vidieo2.mp4': 'vidieo2.mp4',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.CATALOGUES) {
      return new Response('Liaison R2 CATALOGUES non configurée', { status: 500 });
    }

    const url = new URL(request.url);

    // --- Catalogues (download as attachment) ---
    const catalogueKey = CATALOGUE_FILES[url.pathname];
    if (catalogueKey) {
      const object = await env.CATALOGUES.get(catalogueKey);
      if (!object || !object.body) {
        return new Response('Catalogue non trouvé dans R2', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Content-Disposition', `attachment; filename="${catalogueKey}"`);
      headers.set('Access-Control-Allow-Origin', '*');

      if (object.size) {
        headers.set('Content-Length', object.size.toString());
      }

      return new Response(object.body, { headers });
    }

    // --- Videos (stream from R2) ---
    const videoKey = VIDEO_FILES[url.pathname];
    if (videoKey) {
      const object = await env.CATALOGUES.get(videoKey);
      if (!object || !object.body) {
        return new Response('Vidéo non trouvée dans R2', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Content-Type', 'video/mp4');
      headers.set('Accept-Ranges', 'bytes');
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

function parseRange(range: string): { offset: number; length?: number } {
  const match = /bytes=(\d+)-(\d*)/.exec(range);
  if (!match) return { offset: 0 };
  const offset = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : undefined;
  return { offset, length: end !== undefined ? end - offset + 1 : undefined };
}
