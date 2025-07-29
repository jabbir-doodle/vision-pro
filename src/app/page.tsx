'use client'
import { useState } from "react";
import VisionProUpload from "../components/VisionProUpload";

export default function Home() {
  const [uploadedContent, setUploadedContent] = useState<string>("");

  const handleFileLoaded = (content: string) => {
    setUploadedContent(content);
    console.log("File loaded:", content.slice(0, 200) + "...");
  };

  return (
    <main className="min-h-screen">
      <VisionProUpload onFileLoaded={handleFileLoaded} />
      
      {/* Show uploaded content preview if available */}
      {uploadedContent && (
        <div className="fixed bottom-4 right-4 max-w-sm p-4 bg-black/80 backdrop-blur-lg rounded-xl border border-white/20 text-white text-sm z-50">
          <h3 className="font-bold mb-2">File Uploaded Successfully!</h3>
          <p className="text-gray-300 text-xs">
            Content preview: {uploadedContent.slice(0, 100)}...
          </p>
        </div>
      )}
    </main>
  );
}