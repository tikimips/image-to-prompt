export async function generatePromptFromImage(base64: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this image in prompt format for AI image generation.",
            },
            {
              type: "image_url",
              image_url: { url: base64 },
            },
          ],
        },
      ],
      max_tokens: 300,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "No prompt generated";
}
