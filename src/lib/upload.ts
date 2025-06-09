import { supabase } from "./supabase";

export async function uploadToSupabase(file: File, bucket: string, folder: string): Promise<string> {
  // Upload a single file and return the signed URL

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
  if (error) throw error;
  // If using signed URLs for private buckets:
  const { data: signedData, error: signedError } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(fileName, 60 * 60);
  if (signedError) throw signedError;
  return signedData.signedUrl;
}

// Upload an array of files to a bucket/folder and return an array of URLs
// Use this utility in all forms that need to upload one or more files on submit
export async function uploadFilesBatch(files: File[], bucket: string, folder: string): Promise<string[]> {
  return Promise.all(files.map(file => uploadToSupabase(file, bucket, folder)));
}
