'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

interface Props {
  onResult: (code: string) => void;
}

export default function BarcodeScanner({ onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!videoRef.current) return;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const codeReader = new BrowserMultiFormatReader(hints);
    let controls: { stop: () => void } | null = null;
    let stopped = false;

    const startScanner = async () => {
      try {
        controls = await codeReader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
          },
          videoRef.current!,
          (result, err) => {
            if (result && !stopped) {
              stopped = true;
              onResult(result.getText());
              controls?.stop();
            }
          }
        );
      } catch (error) {
        console.error('Erro ao iniciar scanner:', error);
        setErrorMsg('Não foi possível iniciar a câmera.');
      }
    };

    startScanner();

    return () => {
      stopped = true;
      controls?.stop();
    };
  }, [onResult]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-lg border bg-black">
        <video
          ref={videoRef}
          className="w-full h-80 object-contain"
          muted
          playsInline
          autoPlay
        />
        <div className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2">
          <div className="h-20 rounded-lg border-2 border-green-500/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Centralize o código dentro da área verde, com boa luz, e afaste um pouco o celular.
      </p>

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}