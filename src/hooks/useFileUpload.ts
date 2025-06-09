import { useState } from "react";

/**
 * Hook for uploading files using uploadToSupabase, with loading and error state.
 */
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * Upload files to a dynamic bucket and folder.
   * @param files Files to upload
   * @param bucket Bucket name (e.g., 'map-photos', 'team-logos')
   * @param folder Folder path inside the bucket
   */
  async function uploadFiles(files: File[], bucket: string, folder: string): Promise<string[]> {
    setIsUploading(true);
    setUploadError(null);
    try {
      const uploadModule = await import("../lib/upload");
      const urls = await Promise.all(
        files.map((file) => uploadModule.uploadToSupabase(file, bucket, folder))
      );
      setIsUploading(false);
      return urls;
    } catch (err: any) {
      setUploadError("Failed to upload files. Please try again.");
      setIsUploading(false);
      throw err;
    }
  }

  return { uploadFiles, isUploading, uploadError };
}
