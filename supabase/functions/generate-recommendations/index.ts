const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
    };
    
Deno.serve(async (req) => {
  // Handle the browser's CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { score, gaps } = await req.json();
    

    if (!Array.isArray(gaps)) {
      return new Response(
        JSON.stringify({ error: "Invalid gaps data" }),
        {
          status: 400,
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" },
        }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `
You are assisting with a prototype summer-camp safety assessment.

The application's deterministic rules have already calculated
the risk score and identified the safety gaps.

Do not recalculate the risk score.
Do not determine whether the camp is safe or unsafe.
Do not make legal or regulatory compliance determinations.

Risk score: ${score}/100

Identified safety gaps:
${JSON.stringify(gaps, null, 2)}

For each identified gap:
1. Give a short recommendation title.
2. Give a practical recommended action.
3. Briefly explain why the action is useful.

Keep the recommendations concise and easy for a camp administrator
to understand.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini error:", errorText);

      return new Response(
        JSON.stringify({
          error: "Unable to generate recommendations",
          details: errorText,
        }),
        {
          status: 500,
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    const recommendations =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Unable to generate recommendations",
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" },
      }
    );
  }
});