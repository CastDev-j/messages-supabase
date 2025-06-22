import { getNotes } from "@/app/actions/notes/getNotes";

export default async function Page() {
  const { data: notes, error, isError } = await getNotes();

  if (isError) {
    console.error("Error fetching notes:", error);
    return <div>Error loading notes</div>;
  }

  return <pre>{JSON.stringify(notes, null, 2)}</pre>;
}
