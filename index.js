/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    const cache = caches.default

    const url = new URL(request.url)
    url.hostname = 'i.pximg.net'
    url.port = '80'
    const upstreamRequest = new Request(url, {
      method: 'GET',
      headers: {
        'Referer': 'https://www.pixiv.net/',
        'User-Agent': 'Cloudflare Workers'
      },
    })

    let cachedResponse = await cache.match(upstreamRequest)

    if (!cachedResponse) {
      const res = await fetch(upstreamRequest)
      cachedResponse = new Response(res.body, res)
      await cache.put(upstreamRequest, cachedResponse.clone())
    }

    return cachedResponse
  },
}
