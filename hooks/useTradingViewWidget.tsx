'use client';

import { useEffect, useRef } from 'react';

export function useTradingViewWidget(
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configJson = JSON.stringify(config);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = '';

    // Create widget div
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.cssText = `width:100%;height:${height}px;`;
    container.appendChild(widgetDiv);

    // Create script
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.type = 'text/javascript';

    // 🔥 FIX HERE
    script.innerHTML = configJson;

    container.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [scriptUrl, configJson, height]);

  return containerRef;
}