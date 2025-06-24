"use server";

import { Note } from "@/app/interfaces";
import { createClient } from "@/app/lib/supabase/server";

interface GetNotesResponse {
  isError: boolean;
  error: string | null;
  data: Note[];
}

export const getNotes = async (): Promise<GetNotesResponse> => {
  const supabase = await createClient();

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay for loading state

  // Fetch notes
  const { data: notes, error } = await supabase.from("notes").select("*");

  if (error) {
    return {
      isError: true,
      error: error.message,
      data: [],
    };
  }
  return {
    isError: false,
    error: null,
    data: notes || [],
  };
};
