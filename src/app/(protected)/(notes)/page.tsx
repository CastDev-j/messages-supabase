import { NoteComponent } from "./note-component";

export default async function Page() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <NoteComponent />
    </div>
  );
}
