import { datasetJSON } from "@/lib/export";

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(datasetJSON(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="civic-wealth-index.json"',
    },
  });
}
