import React from 'react';

export interface ScoreGaugeProps {
  score: number;
  confidence?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  useBrandedLabel?: boolean;
  className?: string;
  testId?: string;
}

export interface RatingBandInfo {
  strokeColor: string;
  glowColor: string;
  brandedLabel: string;
  specLabel: string;
}

export function getScoreBandInfo(score: number): RatingBandInfo {
  const s = Math.round(score);
  if (s >= 90) {
    return {
      strokeColor: '#00C853', // emerald
      glowColor: 'rgba(0, 200, 83, 0.45)',
      brandedLabel: 'Pinnacle',
      specLabel: 'Exceptional',
    };
  }
  if (s >= 80) {
    return {
      strokeColor: '#00C6FF', // cyan
      glowColor: 'rgba(0, 198, 255, 0.45)',
      brandedLabel: 'Superior',
      specLabel: 'Excellent',
    };
  }
  if (s >= 70) {
    return {
      strokeColor: '#0066FF', // blue
      glowColor: 'rgba(0, 102, 255, 0.45)',
      brandedLabel: 'Capable',
      specLabel: 'Good',
    };
  }
  if (s >= 60) {
    return {
      strokeColor: '#FFA000', // amber
      glowColor: 'rgba(255, 160, 0, 0.45)',
      brandedLabel: 'Competent',
      specLabel: 'Fair',
    };
  }
  if (s >= 50) {
    return {
      strokeColor: '#FF5E3A', // orange
      glowColor: 'rgba(255, 94, 58, 0.45)',
      brandedLabel: 'Mediocre',
      specLabel: 'Weak',
    };
  }
  return {
    strokeColor: '#EF4444', // red
    glowColor: 'rgba(239, 68, 68, 0.45)',
    brandedLabel: 'Deficient',
    specLabel: 'Poor',
  };
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  confidence,
  size = 72,
  strokeWidth = 6,
  showLabel = true,
  useBrandedLabel = true,
  className = '',
  testId = 'titan-score-badge',
}) => {
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const band = getScoreBandInfo(clampedScore);
  const displayLabel = useBrandedLabel ? band.brandedLabel : band.specLabel;

  return (
    <div
      data-testid={testId}
      className={`inline-flex flex-col items-center justify-center ${className}`}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          aria-label={`TITAN Score: ${clampedScore} out of 100 (${displayLabel})`}
        >
          {/* Subtle Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Animated Score Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={band.strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 6px ${band.glowColor})`,
              transition: 'stroke-dashoffset 0.8s ease',
            }}
          />
        </svg>

        {/* Center Score Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span
            className="font-black tracking-tight leading-none brand-font"
            style={{ fontSize: `${Math.max(12, Math.round(size * 0.32))}px`, color: band.strokeColor }}
          >
            {clampedScore}
          </span>
          {size >= 64 && (
            <span className="text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-0.5">
              TITAN
            </span>
          )}
        </div>
      </div>

      {/* Label Badge */}
      {showLabel && (
        <div className="mt-1 flex flex-col items-center">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs"
            style={{
              backgroundColor: `${band.strokeColor}1A`,
              color: band.strokeColor,
              border: `1px solid ${band.strokeColor}33`,
            }}
          >
            {displayLabel}
          </span>
          {confidence !== undefined && (
            <span
              data-testid="confidence-badge"
              className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5"
            >
              {Math.round(confidence)}% verified
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default ScoreGauge;
