const MODEL = "gemini-2.5-flash";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function askGemini(prompt: string, context?: string) {
  if (!API_KEY) {
    return "⚠️ No Gemini API key configured. Please set EXPO_PUBLIC_GEMINI_API_KEY.";
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
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
                  text: `
You are a world-class AI Chef.

Context:
${context || ""}

User:
${prompt}

Rules:
- Simple cooking language
- Step-by-step instructions
- Helpful cooking tips
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();

    // IMPORTANT DEBUG SAFETY
    if (data?.error) {
      return `⚠️ ${data.error.message}`;
    }

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No AI response received"
    );

  } catch (err) {
    console.log(err);
    return "⚠️ Network error";
  }
}