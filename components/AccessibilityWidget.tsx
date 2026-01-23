"use client";

import { useState, useEffect } from "react";
import { X, Type, Contrast, Pointer, Eye, RotateCcw } from "lucide-react";

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  largerCursor: boolean;
  readableFont: boolean;
}

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    largerCursor: false,
    readableFont: false,
  });

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings");
    if (savedSettings) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse accessibility settings:", error);
      }
    }
  }, []);

  // Apply settings whenever they change
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = `${settings.fontSize}%`;

    // High contrast
    if (settings.highContrast) {
      root.classList.add("accessibility-high-contrast");
    } else {
      root.classList.remove("accessibility-high-contrast");
    }

    // Larger cursor
    if (settings.largerCursor) {
      root.classList.add("accessibility-large-cursor");
    } else {
      root.classList.remove("accessibility-large-cursor");
    }

    // Readable font
    if (settings.readableFont) {
      root.classList.add("accessibility-readable-font");
    } else {
      root.classList.remove("accessibility-readable-font");
    }

    // Save to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 100,
      highContrast: false,
      largerCursor: false,
      readableFont: false,
    };
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Floating accessibility button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        aria-label="Open accessibility options"
        type="button"
      >
        <Eye className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Accessibility panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-80 max-h-128 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-cyan-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h2 className="text-lg font-semibold">Accessibility Options</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-cyan-700 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close accessibility panel"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-5 overflow-y-auto">
            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="font-size-slider"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Type className="w-4 h-4" />
                  Text Size
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {settings.fontSize}%
                </span>
              </div>
              <input
                id="font-size-slider"
                type="range"
                min="80"
                max="150"
                step="10"
                value={settings.fontSize}
                onChange={(e) =>
                  updateSetting("fontSize", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                aria-valuemin={80}
                aria-valuemax={150}
                aria-valuenow={settings.fontSize}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Smaller</span>
                <span>Larger</span>
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <label
                htmlFor="high-contrast-toggle"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Contrast className="w-4 h-4" />
                High Contrast
              </label>
              <button
                id="high-contrast-toggle"
                onClick={() =>
                  updateSetting("highContrast", !settings.highContrast)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                  settings.highContrast
                    ? "bg-cyan-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                role="switch"
                aria-checked={settings.highContrast}
                type="button"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.highContrast ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Larger Cursor */}
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <label
                htmlFor="large-cursor-toggle"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Pointer className="w-4 h-4" />
                Large Cursor
              </label>
              <button
                id="large-cursor-toggle"
                onClick={() =>
                  updateSetting("largerCursor", !settings.largerCursor)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                  settings.largerCursor
                    ? "bg-cyan-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                role="switch"
                aria-checked={settings.largerCursor}
                type="button"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.largerCursor ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Readable Font */}
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <label
                htmlFor="readable-font-toggle"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Type className="w-4 h-4" />
                Readable Font
              </label>
              <button
                id="readable-font-toggle"
                onClick={() =>
                  updateSetting("readableFont", !settings.readableFont)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                  settings.readableFont
                    ? "bg-cyan-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                role="switch"
                aria-checked={settings.readableFont}
                type="button"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.readableFont ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              type="button"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </>
  );
}
