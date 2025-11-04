import type { NextApiRequest, NextApiResponse } from "next";

import { createResumePdf } from "@/lib/resumePdf";
import type { ResumeData } from "@/types/resume";

type ErrorResponse = {
  error: string;
};

function normalizePayload(payload: unknown): ResumeData {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid resume payload");
  }
  if ("resume" in (payload as Record<string, unknown>)) {
    const value = (payload as Record<string, unknown>).resume;
    if (value && typeof value === "object") {
      return value as ResumeData;
    }
  }
  return payload as ResumeData;
}

function sanitizeFileName(name: string | undefined): string {
  if (!name) {
    return "resume";
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return "resume";
  }
  return trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-")
    .slice(0, 80) || "resume";
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Buffer | ErrorResponse>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const payload = normalizePayload(req.body);
    const pdf = createResumePdf(payload);
    const fileName = `${sanitizeFileName(payload.basics?.name ?? (req.query.name as string | undefined))}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.status(200).send(pdf);
  } catch (error) {
    console.error("Failed to generate PDF", error);
    res.status(400).json({ error: error instanceof Error ? error.message : "Failed to generate PDF" });
  }
}
