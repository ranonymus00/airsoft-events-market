import { supabase } from "./supabase";

export async function uploadToSupabase(file: File, folder: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const { data, error } = await supabase.storage.from("uploads").upload(fileName, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName);
  return urlData.publicUrl;
}
