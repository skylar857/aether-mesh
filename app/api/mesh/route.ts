import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nodeId, errorType, voltage } = await req.json();

    const systemPrompt = `You are Nemotron-3-Ultra, the core AI agentic guardian for AetherMesh—an autonomous decentralized edge grid. 
An anomaly has been detected on edge node ${nodeId} (${errorType}, current voltage: ${voltage}). 
Analyze the failure, isolate the sector, and generate an immediate, concise neural compensation hot-patch to restabilize the grid. Provide a step-by-step diagnostic and resolution stream.`;

    // Nebius Token Factory API endpoint (OpenAI-compatible standard)
    const response = await fetch("https://api.nebius.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEBIUS_API_KEY}`
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra", // or the exact model string provided by Nebius Token Factory
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Execute emergency diagnostic and patch sequence for node ${nodeId}.` }
        ],
        stream: true,
        temperature: 0.2,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      // Fallback mock stream if API key isn't active yet so the demo never breaks
      return NextResponse.json({ 
        fallback: true, 
        message: `[NEBIUS_FALLBACK]: Token Factory container initialized for ${nodeId}.\n> Isolating voltage regulator...\n> Applying Nemotron-3 neural filter weights...\n> Grid successfully normalized to 230.4V.` 
      });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}