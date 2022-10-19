import { useState } from "react";
import axios from "axios";

export const useUploadForm = (url: string) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadForm = async (formData: FormData) => {
    setIsLoading(true);
    await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 50;
        setProgress(progress);
      },
      onDownloadProgress: (progressEvent) => {
        const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
        console.log(progress);
        setProgress(progress);
      },
    });
    setProgress(100);
    await new Promise((resolve) => {
      setTimeout(() => resolve("success"), 500);
    });
    console.log("success");
    setIsSuccess(true);
    setProgress(0);
  };

  return { uploadForm, isSuccess, isLoading, progress };
};
