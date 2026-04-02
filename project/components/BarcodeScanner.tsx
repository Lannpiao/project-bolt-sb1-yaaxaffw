'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useId, useRef, useState } from 'react';

interface Props {
  onResult: (code: string) => void;
}

export default function BarcodeScanner({ onResult }: Props) {
  const elementId = useId().replace(/:/g, '');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 280, height: 140 },
            aspectRatio: 1.7778,
            disableFlip: true,
          },
          (decodedText) => {
            if (!isMounted) return;

            onResult(decodedText);

            scanner
              .stop()
              .then(() => scanner.clear())
              .catch((err) => {
                console.error('Erro ao parar scanner:', err);
              });
          },
          () => {
            // ignora erros contínuos de leitura
          }
        );
      } catch (error) {
        console.error('Erro ao iniciar câmera:', error);
        if (isMounted) {
          setErrorMsg('Não foi possível iniciar a câmera.');
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;

      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {
            // evita quebrar ao desmontar se já tiver parado
          });
      }
    };
  }, [elementId, onResult]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border bg-black">
        <div id={elementId} className="w-full" />
      </div>

      <p className="text-sm text-muted-foreground">
        Centralize o código na área de leitura e afaste um pouco o celular.
      </p>

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}