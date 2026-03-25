'use client';

import { memo } from 'react';
import { useTradingViewWidget } from '@/hooks/useTradingViewWidget';
import { cn } from '@/lib/utils';

interface TradingViewWidgetProps {
  title?:     string;
  scriptUrl:  string;
  config:     Record<string, unknown>;
  height?:    number;
  className?: string;
}

function TradingViewWidget({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  return (
    <div className="w-full">
      {title && (
        <h3 className="font-semibold text-2xl text-gray-100 mb-5">{title}</h3>
      )}
      <div
        ref={containerRef}
        className={cn('tradingview-widget-container', className)}
      >
        {/* TradingView injects its widget iframe into this div */}
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: '100%' }}
        />
      </div>
    </div>
  );
}

// memo prevents unnecessary re-renders when parent re-renders but props haven't changed
export default memo(TradingViewWidget);
