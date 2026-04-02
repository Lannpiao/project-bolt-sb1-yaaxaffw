'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onResult: (code: string) => void;
}

export default function BarcodeScanner({ onResult }: Props) {
  const scannerRef = useRef<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;
    let localScanner: any = null;

    const startScanner = async () => {
      try {
        const elementId = 'barcode-scanner';
        const element = document.getElementById(elementId);

        if (!element) {
          setErrorMsg('Área do scanner não encontrada.');
          return;
        }

        const { Html5Qrcode } = await import('html5-qrcode');

        if (!mounted) return;

        const scanner = new Html5Qrcode(elementId);
        localScanner = scanner;
        scannerRef.current = scanner;

        setReady(true);

        await scanner.start(
          { facingMode: { ideal: 'environment' } },
          {
            fps: 10,
            qrbox: { width: 250, height: 120 },
            aspectRatio: 1.7778,
            disableFlip: true,
          },
          async (decodedText: string) => {
            if (!mounted) return;

            onResult(decodedText);

            try {
              await scanner.stop();
              await scanner.clear();
            } catch (err) {
              console.error('Erro ao parar scanner:', err);
            }
          },
          () => {
            // ignora tentativas sem leitura
          }
        );
      } catch (error) {
        console.error('Erro ao iniciar câmera:', error);
        if (mounted) {
          setErrorMsg('Não foi possível iniciar a câmera.');
        }
      }
    };

    const timer = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      mounted = false;
      clearTimeout(timer);

      const scanner = localScanner || scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, [onResult]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border bg-black min-h-[260px]">
        <div id="barcode-scanner" className="w-full min-h-[260px]" />
      </div>

      {!ready && !errorMsg && (
        <p className="text-sm text-muted-foreground">
          Iniciando câmera...
        </p>
      )}

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}