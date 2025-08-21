export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.SECRET_RESEND_API);

export const POST: APIRoute = async ({ request }) => {
    try {
        const raw = await request.text();
        console.log("RAW BODY:", raw);

        const { name, email, message } = JSON.parse(raw);

        const { data, error } = await resend.emails.send({
            from: "Contacto Web <onboarding@resend.dev>",
            to: "byronjvh02@gmail.com",
            subject: `Nuevo mensaje de ${name}`,
            html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
        });

        if (error) {
            return new Response(
                JSON.stringify({ message: "❌ Error al enviar", error }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ message: "✅ Mensaje enviado con éxito", data }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ message: "❌ Error interno", error: String(err) }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
