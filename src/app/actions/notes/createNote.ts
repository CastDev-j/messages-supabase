"use server";

import { createClient } from "@/app/lib/supabase/server";

export const createNote = async (title: string) => {
  const supabase = await createClient();

  // Fetch notes
  const { data: note, error } = await supabase
    .from("notes")
    .insert([{ title }])
    .select();

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
    data: note || {},
  };
};
