import { createClient } from "@/lib/supabase/server";

export const getNotes = async () => {
  const supabase = await createClient();

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
