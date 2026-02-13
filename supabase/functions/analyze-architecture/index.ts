import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are an expert cloud architecture analyst. When given a description of a cloud architecture, analyze it and return a JSON response with the following structure:

{
  "architectureScore": <number 0-100>,
  "breakdown": {
    "scalability": <number 0-100>,
    "reliability": <number 0-100>,
    "security": <number 0-100>,
    "costEfficiency": <number 0-100>
  },
  "costAnalysis": {
    "currentCost": <estimated monthly cost in USD as integer>,
    "optimizedCost": <optimized monthly cost in USD as integer>,
    "monthlySavings": <savings in USD as integer>
  },
  "recommendations": [<array of 3-5 actionable recommendation strings>]
}

Scoring guidelines:
- architectureScore is a weighted average: scalability(30%) + reliability(25%) + security(25%) + costEfficiency(20%)
- Scalability: auto-scaling, load balancing, CDN, caching, stateless design, horizontal scaling
- Reliability: multi-AZ, backups, health checks, failover, monitoring, redundancy
- Security: encryption, WAF, VPC, private subnets, IAM, security groups, zero-trust
- Cost Efficiency: serverless, spot/reserved instances, right-sizing, caching, CDN
- Cost estimates should be realistic for the described infrastructure
- Recommendations should be specific, actionable, and prioritized

Return ONLY valid JSON, no markdown, no explanation.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();
    
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Architecture description is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this cloud architecture:\n\n${description}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI usage limit reached. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON from the AI response, stripping any markdown fences
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(cleanContent);

    // Add timestamp
    analysis.timestamp = new Date().toISOString();

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('analyze-architecture error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Analysis failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
