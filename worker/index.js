const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    const url = new URL(request.url)

    if (url.pathname === '/signatures' && request.method === 'GET') {
      const data = await env.SIGNATURES.get('petition-list', 'json')
      return Response.json(data || [], { headers: CORS_HEADERS })
    }

    if (url.pathname === '/signatures' && request.method === 'POST') {
      const body = await request.json()
      const { name, city } = body

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return Response.json(
          { error: 'Nome obrigatório (mín. 2 caracteres)' },
          { status: 400, headers: CORS_HEADERS }
        )
      }

      const existing = (await env.SIGNATURES.get('petition-list', 'json')) || []

      const entry = {
        name: name.trim().slice(0, 100),
        city: city ? city.trim().slice(0, 100) : null,
        date: new Date().toISOString().slice(0, 10),
      }

      existing.push(entry)
      await env.SIGNATURES.put('petition-list', JSON.stringify(existing))

      return Response.json(
        { ok: true, total: existing.length },
        { status: 201, headers: CORS_HEADERS }
      )
    }

    return Response.json(
      { error: 'Not found' },
      { status: 404, headers: CORS_HEADERS }
    )
  },
}
