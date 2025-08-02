"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { generatePromptFromImage } from "@/utils/generatePrompt";

export default function Upload() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      setLoading(true);
      const result = await generatePromptFromImage(base64);
      setPrompt(result);
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div className="p-4 border border-dashed rounded-xl text-center cursor-pointer" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag & drop an image, or click to select</p>
      {loading && <p className="mt-2 text-gray-500">Generating prompt...</p>}
      {prompt && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <strong>Prompt:</strong>
          <p>{prompt}</p>
        </div>
      )}
    </div>
  );
}
