"use client";

import { FormEvent, useEffect, useState } from "react";
import { Note } from "@/app/interfaces";
import { getNotes } from "@/app/actions/notes/getNotes";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createNote } from "@/app/actions/notes/createNote";
import { createClient } from "@/app/lib/supabase/client";

export const NoteComponent = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();

  const fetchNotes = async () => {
    setIsLoading(true);
    const { data, error, isError } = await getNotes();
    if (isError) {
      console.error("Error fetching notes:", error);
      return;
    }

    setIsLoading(false);
    setNotes(data || []);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        () => {
          fetchNotes(); // Vuelve a cargar las notas
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="max-w-md mx-auto space-y-6 w-full">
      <NoteForm isLoading={isLoading} />
      <NotesList notes={notes} isLoading={isLoading} />
    </div>
  );
};

// --- Subcomponents ---

interface NoteFormProps {
  isLoading: boolean;
}

const NoteForm = ({ isLoading }: NoteFormProps) => {
  const [note, setNote] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!note.trim()) return;

    const { data, error, isError } = await createNote(note.trim());

    if (isError) {
      console.error("Error creating note:", error);
      return;
    }

    console.log("Note created successfully:", data);

    setNote(""); // Clear input after submission
    // Optionally, you can update the notes list here or trigger a refetch
  };

  return (
    <form className="space-y-2 mb-6" onSubmit={handleSubmit}>
      <Label htmlFor="note">Create Note</Label>
      <div className="flex gap-2 items-center justify-center">
        <Input
          id="note"
          name="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type your note here..."
          disabled={isLoading}
        />
        {isLoading ? (
          <Skeleton className="h-9 min-w-24 px-2 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90" />
        ) : (
          <Button type="submit" disabled={isLoading} className="min-w-24">
            Add Note
          </Button>
        )}
      </div>
    </form>
  );
};

type NotesListProps = {
  notes: Note[];
  isLoading: boolean;
};

const NotesList = ({ notes, isLoading }: NotesListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3 flex flex-col items-center w-full">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="w-full h-14 bg-gray-200 rounded shadow"
          />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return <div className="text-gray-500">No notes yet.</div>;
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li
          key={note.id}
          className="p-4 bg-white rounded shadow border border-gray-100"
        >
          <div className="text-gray-900">{note.title}</div>
        </li>
      ))}
    </ul>
  );
};
