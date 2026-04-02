'use client';

import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface Props {
  onResult: (code: string) => void;
}

export default function BarcodeScanner({ onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let controls: { stop: () => void } | null = null;
    let stopped = false;

    if (!videoRef.current) return;

    codeReader
      .decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoRef.current,
        (result, error) => {
          if (result && !stopped) {
            stopped = true;
            onResult(result.getText());
            controls?.stop();
          }
        }
      )
      .then((ctrl) => {
        controls = ctrl;
      })
      .catch((error) => {
        console.error('Erro ao iniciar leitor de código de barras:', error);
      });

    return () => {
      stopped = true;
      controls?.stop();
    };
  }, [onResult]);

  return (
    <div className="overflow-hidden rounded-lg border">
      <video
        ref={videoRef}
        className="w-full h-64 object-cover"
        muted
        playsInline
      />
    </div>
  );
}