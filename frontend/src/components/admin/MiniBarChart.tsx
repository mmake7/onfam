'use client';

interface DataPoint {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export default function MiniBarChart({
  data,
  color = '#22C55E',
  height = 200,
}: MiniBarChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const padding = { top: 20, right: 16, bottom: 40, left: 50 };
  const chartWidth = 500;
  const chartHeight = height;
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const barGap = 4;
  const barWidth = Math.min(
    (innerW - barGap * (data.length - 1)) / data.length,
    30,
  );
  const totalBarsWidth = data.length * barWidth + (data.length - 1) * barGap;
  const offsetX = padding.left + (innerW - totalBarsWidth) / 2;

  const bars = data.map((d, i) => {
    const barH = (d.value / maxValue) * innerH;
    return {
      x: offsetX + i * (barWidth + barGap),
      y: padding.top + innerH - barH,
      width: barWidth,
      height: barH,
      ...d,
    };
  });

  // Y-axis ticks
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = (maxValue / 4) * i;
    const y = padding.top + innerH - (val / maxValue) * innerH;
    return { val, y };
  });

  const labelStep = data.length <= 7 ? 1 : Math.ceil(data.length / 7);

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={t.y}
            x2={chartWidth - padding.right}
            y2={t.y}
            stroke="#E7E5E4"
            strokeDasharray="4 2"
            strokeWidth={0.5}
          />
          <text
            x={padding.left - 8}
            y={t.y + 4}
            textAnchor="end"
            className="text-[11px]"
            fill="#A8A29E"
          >
            {t.val >= 1000000
              ? `${(t.val / 1000000).toFixed(1)}M`
              : t.val >= 1000
                ? `${(t.val / 1000).toFixed(0)}k`
                : Math.round(t.val)}
          </text>
        </g>
      ))}

      {/* Bars */}
      {bars.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={b.y}
            width={b.width}
            height={b.height}
            rx={3}
            fill={color}
            opacity={0.85}
          />
          {/* Hover area (invisible wider rect) */}
          <rect
            x={b.x - 2}
            y={padding.top}
            width={b.width + 4}
            height={innerH}
            fill="transparent"
          />
        </g>
      ))}

      {/* X-axis labels */}
      {bars.map((b, i) =>
        i % labelStep === 0 || i === bars.length - 1 ? (
          <text
            key={i}
            x={b.x + b.width / 2}
            y={chartHeight - 8}
            textAnchor="middle"
            className="text-[10px]"
            fill="#A8A29E"
          >
            {b.label}
          </text>
        ) : null,
      )}
    </svg>
  );
}
