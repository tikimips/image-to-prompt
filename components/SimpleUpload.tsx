import React, { useState } from 'react';

function SimpleUpload() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 p-10">
      <label htmlFor="file-upload" className="cursor-pointer border border-dashed border-slate-300 p-8 rounded-xl block text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <div className="text-blue-800 font-semibold mb-2">Upload an Image</div>
        <p className="text-slate-600 text-sm">Click to browse or drag and drop</p>
      </label>

      {preview && (
        <div className="bg-slate-50 p-4 rounded-xl">
          <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg mx-auto" />
          <p className="text-center text-sm text-slate-600 mt-3">{selectedImage?.name}</p>
        </div>
      )}
    </div>
  );
}

export default SimpleUpload;
