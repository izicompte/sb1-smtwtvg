import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../layout/Logo';

interface LogoUploaderProps {
  value?: string;
  width?: number;
  height?: number;
  onChange: (value: string) => void;
  onSizeChange?: (width: number, height: number) => void;
}

export function LogoUploader({ 
  value, 
  width = 32, 
  height = 32,
  onChange,
  onSizeChange 
}: LogoUploaderProps) {
  // Add URL validation
  const handleUrlChange = (url: string) => {
    // Basic URL validation
    if (url && !url.match(/^https?:\/\/.+\/.+$/)) {
      return; // Invalid URL
    }
    onChange(url);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Logo du Restaurant
      </label>
      
      <div className="flex items-center space-x-4">
        <div 
          className="rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {value ? (
            <img 
              src={value} 
              alt="Logo preview"
              className="w-full h-full object-contain"
              onError={() => onChange('')} // Clear invalid image URLs
            />
          ) : (
            <Logo className="w-full h-full" />
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
          />
          
          <div className="flex gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Largeur (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => onSizeChange?.(Number(e.target.value), height)}
                min="16"
                max="200"
                className="w-24 rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Hauteur (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => onSizeChange?.(width, Number(e.target.value))}
                min="16"
                max="200"
                className="w-24 rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {value && (
          <Button
            type="button"
            variant="danger"
            onClick={() => onChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Format recommandé: PNG ou SVG avec fond transparent. L'URL doit commencer par http:// ou https://
      </p>
    </div>
  );
}