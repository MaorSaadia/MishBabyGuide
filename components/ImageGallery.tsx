"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from "lucide-react";

interface ImageGalleryProps {
  images: Array<{
    url: string;
    alt: string;
  }>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Handle touch events for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isZoomed || isFullscreen) {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "Escape") {
          setIsZoomed(false);
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isZoomed, isFullscreen]);

  // Prevent body scroll when zoomed or fullscreen
  useEffect(() => {
    if (isZoomed || isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isZoomed, isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Maximize2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            No image available
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div
        className="relative aspect-square bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Main Image with smooth transition */}
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            fill
            className={`object-contain p-4 transition-all duration-500 ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Navigation Arrows (if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-900 dark:text-white" />
            </button>
          </>
        )}

        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Fullscreen Button (Mobile only) */}
          <button
            onClick={toggleFullscreen}
            className="lg:hidden bg-linear-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-md p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 dark:border-gray-700 group/fullscreen"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-5 w-5 text-gray-900 dark:text-white group-hover/fullscreen:scale-110 transition-transform" />
          </button>

          {/* Zoom Button (Desktop) */}
          <button
            onClick={() => setIsZoomed(true)}
            className="hidden lg:block bg-linear-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-md p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 dark:border-gray-700 group/zoom"
            aria-label="Zoom image"
          >
            <ZoomIn className="h-5 w-5 text-gray-900 dark:text-white group-hover/zoom:scale-110 transition-transform" />
          </button>
        </div>

        {/* Image Counter with modern design */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 dark:bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/10">
            <span className="text-white">{currentIndex + 1}</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-gray-300">{images.length}</span>
          </div>
        )}
      </div>

      {/* Horizontal Scrollable Thumbnails - Similar to the examples */}
      {images.length > 1 && (
        <div className="relative">
          {/* Scroll container */}
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide hover:scrollbar-default scroll-smooth ml-6 mr-6">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 300);
                }}
                className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden transition-all duration-300 snap-center group/thumb ${
                  index === currentIndex
                    ? "ring-1 ring-cyan-500 dark:ring-cyan-400 shadow-lg scale-105 ml-1 mt-2"
                    : "hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500 ring-offset-2 dark:ring-offset-gray-900 hover:scale-105 shadow-md hover:shadow-lg opacity-70 hover:opacity-100 mt-3 ml-1"
                }`}
              >
                {/* Thumbnail gradient overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-br from-transparent to-black/20 dark:to-black/40 transition-opacity ${
                    index === currentIndex
                      ? "opacity-0"
                      : "opacity-100 group-hover/thumb:opacity-50"
                  }`}
                />

                <Image
                  src={image.url}
                  alt={`${image.alt} thumbnail ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                  sizes="100px"
                />

                {/* Active indicator */}
                {index === currentIndex && (
                  <div className="absolute inset-0 border-2 border-cyan-500 dark:border-cyan-400 rounded-2xl" />
                )}
              </button>
            ))}
          </div>

          {/* Scroll hint gradient on edges */}
          <div className="absolute top-0 left-0 h-full w-8 bg-linear-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-8 bg-linear-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Mobile Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black z-50 flex flex-col animate-[fadeIn_0.3s_ease-out]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md">
            <div className="text-white font-semibold">
              {currentIndex + 1} / {images.length}
            </div>
            <button
              onClick={toggleFullscreen}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-full transition-all duration-300"
              aria-label="Exit fullscreen"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Image Area */}
          <div className="flex-1 relative flex items-center justify-center">
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              fill
              className={`object-contain transition-all duration-500 ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
              sizes="100vw"
              quality={100}
            />

            {/* Navigation Arrows in fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  disabled={isTransitioning}
                  className="absolute left-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full shadow-2xl transition-all duration-300 disabled:opacity-50"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={isTransitioning}
                  className="absolute right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full shadow-2xl transition-all duration-300 disabled:opacity-50"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip - Horizontal Scroll */}
          {images.length > 1 && (
            <div className="bg-black/50 backdrop-blur-md p-4">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsTransitioning(false), 300);
                    }}
                    className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 snap-center${
                      index === currentIndex
                        ? "ring-2 ring-cyan-400 scale-110 opacity-100"
                        : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Desktop Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setIsZoomed(false)}
        >
          {/* Main Modal Container - Controls size (Not full screen) */}
          <div
            className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - Now attached to the image container */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-12 right-0 md:top-4 md:right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
              aria-label="Close zoom"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons - Now absolute to the container */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  disabled={isTransitioning}
                  className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 z-50 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all hover:scale-110 disabled:opacity-50 border border-white/10"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  disabled={isTransitioning}
                  className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 z-50 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all hover:scale-110 disabled:opacity-50 border border-white/10"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Zoomed Image */}
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                fill
                className={`object-contain transition-all duration-500 ${
                  isTransitioning
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
                sizes="(max-width: 1280px) 100vw, 1280px"
                quality={100}
              />
            </div>
          </div>

          {/* Instruction hint */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium drop-shadow-md">
            Press ESC to close
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
