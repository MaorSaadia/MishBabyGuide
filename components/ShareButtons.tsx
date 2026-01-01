"use client";

import React, { useState } from "react";
import { Facebook, Twitter, Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Share:</span>

      {/* Facebook */}
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:shadow-lg"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5" />
      </a>

      {/* Twitter */}
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white transition-all shadow-md hover:shadow-lg"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5" />
      </a>

      {/* Pinterest */}
      <a
        href={shareUrls.pinterest}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-md hover:shadow-lg"
        aria-label="Share on Pinterest"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.027-4.625 4.235 0 1.015.388 1.92 1.218 2.259.135.056.207.031.239-.085l.164-.667c.013-.05.006-.1-.037-.15-.238-.291-.425-.819-.425-1.314 0-1.268.959-2.513 2.592-2.513 1.405 0 2.388.957 2.388 2.337 0 1.546-.785 2.617-1.804 2.617-.563 0-.985-.465-.85-1.037.162-.679.476-1.413.476-1.902 0-.439-.235-.805-.723-.805-.573 0-1.033.593-1.033 1.388 0 .505.171.847.171.847l-.708 3.003c-.172.729-.025 1.792-.013 1.891.006.059.085.073.134.029.07-.062 1.012-1.234 1.214-1.934l.436-1.664c.242.462.948.864 1.697.864 2.235 0 3.821-2.033 3.821-4.548 0-2.414-2.001-4.202-4.646-4.202z" />
        </svg>
      </a>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-md hover:shadow-lg ${
          copied
            ? "bg-green-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
        aria-label="Copy link"
      >
        {copied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default ShareButtons;
