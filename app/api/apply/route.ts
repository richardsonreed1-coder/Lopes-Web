import { handlePortalPost } from "@/lib/portal-intake";

export async function POST(request: Request) {
  return handlePortalPost(request, {
    fields: [
      { name: "name", label: "Full name", required: true, maxLen: 200 },
      { name: "email", label: "Email", required: true, maxLen: 200 },
      { name: "phone", label: "Phone", maxLen: 60 },
      { name: "position", label: "Applying for", required: true, maxLen: 60 },
      { name: "area", label: "Area of interest", required: true, maxLen: 80 },
      { name: "link", label: "LinkedIn / portfolio", maxLen: 300 },
      { name: "note", label: "The note", required: true, maxLen: 4000 },
    ],
    file: {
      name: "resume",
      label: "Résumé",
      required: true,
      accept: [".pdf", ".doc", ".docx"],
      maxMB: 4,
    },
    subject: (f) => `Application — ${f.name} (${f.position})`,
  });
}
