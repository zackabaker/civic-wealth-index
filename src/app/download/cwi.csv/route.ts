import { datasetCSV } from "@/lib/export";

export const dynamic = "force-static";

export function GET() {
  return new Response(datasetCSV(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="civic-wealth-index.csv"',
    },
  });
}
