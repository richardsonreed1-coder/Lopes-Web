import { handlePortalPost } from "@/lib/portal-intake";

export async function POST(request: Request) {
  return handlePortalPost(request, {
    fields: [
      { name: "name", label: "Full name", required: true, maxLen: 200 },
      { name: "firm", label: "Firm / company", required: true, maxLen: 200 },
      { name: "email", label: "Email", required: true, maxLen: 200 },
      { name: "phone", label: "Phone", maxLen: 60 },
      { name: "sector", label: "Sector", required: true, maxLen: 80 },
      { name: "dealType", label: "Deal type", required: true, maxLen: 80 },
      { name: "size", label: "Size / raise", maxLen: 120 },
      { name: "summary", label: "The pitch", required: true, maxLen: 4000 },
      { name: "dataroom", label: "Deck / data room link", maxLen: 300 },
    ],
    file: {
      name: "deck",
      label: "Deck / one-pager",
      accept: [".pdf", ".ppt", ".pptx"],
      maxMB: 4,
    },
    subject: (f) => `Deal submission — ${f.firm} (${f.sector})`,
  });
}
