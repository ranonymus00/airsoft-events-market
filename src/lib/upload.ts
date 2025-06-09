import { supabase } from "./supabase";

export async function uploadToSupabase(file: File, bucket: string, folder: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
  if (error) throw error;
  // If using signed URLs for private buckets:
  const { data: signedData, error: signedError } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(fileName, 60 * 60);
  if (signedError) throw signedError;
  return signedData.signedUrl;
}
