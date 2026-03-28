import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

/**
 * Agent Memory Log — Vector-like storage using keyword similarity scoring.
 * Actions: store | retrieve | list | archive | delete
 */
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { action, agent_name, content, memory_type, importance, session_id, project_id, tags, query, limit, memory_id } = body;

  // ── STORE: save a new memory with AI-generated summary + keywords ──────────
  if (action === 'store') {
    if (!agent_name || !content || !memory_type) {
      return Response.json({ error: 'agent_name, content, and memory_type are required' }, { status: 400 });
    }

    const aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Analyze this AI agent memory and return a JSON with:
- "summary": one concise sentence summarizing the memory (max 120 chars)
- "keywords": array of 5-10 relevant keywords for search/retrieval

Memory content: "${content}"
Agent: ${agent_name}
Type: ${memory_type}`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    const memory = await base44.asServiceRole.entities.AgentMemoryLog.create({
      agent_name,
      memory_type,
      content,
      summary: aiResult?.summary || content.slice(0, 120),
      keywords: aiResult?.keywords || [],
      importance: importance || 5,
      session_id: session_id || null,
      project_id: project_id || null,
      tags: tags || [],
      access_count: 0,
      last_accessed: new Date().toISOString(),
      is_archived: false,
    });

    return Response.json({ success: true, memory });
  }

  // ── RETRIEVE: keyword similarity search ────────────────────────────────────
  if (action === 'retrieve') {
    if (!agent_name || !query) {
      return Response.json({ error: 'agent_name and query are required' }, { status: 400 });
    }

    const allMemories = await base44.asServiceRole.entities.AgentMemoryLog.filter(
      { agent_name, is_archived: false }
    );

    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    const scored = allMemories.map(mem => {
      const keywords = (mem.keywords || []).map(k => k.toLowerCase());
      const contentLower = (mem.content || '').toLowerCase();
      const summaryLower = (mem.summary || '').toLowerCase();

      let score = 0;
      for (const word of queryWords) {
        if (keywords.some(k => k.includes(word) || word.includes(k))) score += 3;
        if (contentLower.includes(word)) score += 1;
        if (summaryLower.includes(word)) score += 2;
      }
      score += (mem.importance || 5) * 0.1;

      return { ...mem, _score: score };
    });

    const results = scored
      .filter(m => m._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, limit || 10);

    // Update access_count for retrieved memories
    for (const mem of results) {
      await base44.asServiceRole.entities.AgentMemoryLog.update(mem.id, {
        access_count: (mem.access_count || 0) + 1,
        last_accessed: new Date().toISOString(),
      });
    }

    return Response.json({ success: true, memories: results, total: results.length });
  }

  // ── LIST: get all memories for an agent ────────────────────────────────────
  if (action === 'list') {
    if (!agent_name) return Response.json({ error: 'agent_name is required' }, { status: 400 });

    const filter = { agent_name };
    if (body.include_archived !== true) filter.is_archived = false;

    const memories = await base44.asServiceRole.entities.AgentMemoryLog.filter(filter);
    memories.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    return Response.json({ success: true, memories, total: memories.length });
  }

  // ── LIST ALL AGENTS ────────────────────────────────────────────────────────
  if (action === 'list_agents') {
    const all = await base44.asServiceRole.entities.AgentMemoryLog.list();
    const agentMap = {};
    for (const mem of all) {
      if (!agentMap[mem.agent_name]) {
        agentMap[mem.agent_name] = { agent_name: mem.agent_name, total: 0, archived: 0, avg_importance: 0 };
      }
      agentMap[mem.agent_name].total++;
      if (mem.is_archived) agentMap[mem.agent_name].archived++;
      agentMap[mem.agent_name].avg_importance += (mem.importance || 5);
    }
    const agents = Object.values(agentMap).map(a => ({
      ...a,
      avg_importance: Math.round((a.avg_importance / a.total) * 10) / 10
    }));
    return Response.json({ success: true, agents });
  }

  // ── ARCHIVE: soft-delete a memory ─────────────────────────────────────────
  if (action === 'archive') {
    if (!memory_id) return Response.json({ error: 'memory_id is required' }, { status: 400 });
    await base44.asServiceRole.entities.AgentMemoryLog.update(memory_id, { is_archived: true });
    return Response.json({ success: true });
  }

  // ── DELETE: hard delete ────────────────────────────────────────────────────
  if (action === 'delete') {
    if (!memory_id) return Response.json({ error: 'memory_id is required' }, { status: 400 });
    await base44.asServiceRole.entities.AgentMemoryLog.delete(memory_id);
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
});