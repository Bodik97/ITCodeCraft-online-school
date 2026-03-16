import type { APIRoute } from "astro";
import { reportError } from "@/lib/reportError";
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    console.log("DATA FROM FORM:", data);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwueBHdSPupfDOXUfpyHCrDuGzfGmGGA5Q1JKdtPr7WuJN3546pu7EF1LW7CN3kenWcjA/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );


    const text = await response.text();

    console.log("GOOGLE RESPONSE:", text);

    if (text.toLocaleLowerCase().includes("error")) {
      reportError('Error submitting form:', data);

      return new Response(text, { status: 500 });
    }

    return new Response(text, { status: 200 });

  } catch (error) {
    console.error("API ERROR:", error);

    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
};