import { redirect } from "next/navigation";

export default function ExportAlias({ params }: { params: { id: string } }) {
  redirect(`/app/project/${params.id}/map`);
}
