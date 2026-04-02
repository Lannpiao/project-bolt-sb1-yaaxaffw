'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onResult: (code: string) => void;
}

export default function BarcodeScanner({ onResult }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;
    const elementId = 'barcode-scanner';

    const startScanner = async () => {
      try {
        const element = document.getElementById(elementId);
        if (!element) return;

        const scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 120 },
            aspectRatio: 1.7778,
            disableFlip: true,
          },
          async (decodedText) => {
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
            // Ignora erros contínuos enquanto tenta encontrar o código
          }
        );
      } catch (error) {
        console.error('Erro ao iniciar câmera:', error);
        if (mounted) {
          setErrorMsg('Não foi possível iniciar a câmera.');
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;

      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {
            // evita erro se já estiver parado
          });
      }
    };
  }, [onResult]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border bg-black">
        <div id="barcode-scanner" className="w-full" />
      </div>

      <p className="text-sm text-muted-foreground">
        Centralize o código e afaste um pouco o celular.
      </p>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
    </div>
  );
}