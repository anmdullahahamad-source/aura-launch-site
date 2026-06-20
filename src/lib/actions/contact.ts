import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator((input: unknown): ContactFormData => {
    return contactSchema.parse(input);
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return {
        success: false as const,
        error:
          "Email service is not configured. Please set the RESEND_API_KEY environment variable.",
      };
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Contact Form <onboarding@resend.dev>",
          to: "kholilebrahim2005@gmail.com",
          reply_to: data.email,
          subject: `[Portfolio Contact] ${data.subject}`,
          text: [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Subject: ${data.subject}`,
            "",
            `Message:`,
            data.message,
          ].join("\n"),
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("Resend API error:", res.status, body);
        return {
          success: false as const,
          error: "Failed to send message. Please try again later.",
        };
      }

      return { success: true as const };
    } catch (err) {
      console.error("Failed to send email:", err);
      return {
        success: false as const,
        error: "Network error. Please try again.",
      };
    }
  });
