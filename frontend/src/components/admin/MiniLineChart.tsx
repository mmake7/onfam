'use client';

interface DataPoint {
  label: string;
  value: number;
}

interface MiniLineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export default function MiniLineChart({
  data,
  color = '#FFD55A',
  height = 200,
}: MiniLineChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const padding = { top: 20, right: 16, bottom: 40, left: 50 };
  const chartWidth = 500;
  const chartHeight = height;
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1 || 1)) * innerW,
    y: padding.top + innerH - (d.value / maxValue) * innerH,
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`;

  // Y-axis ticks (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = (maxValue / 4) * i;
    const y = padding.top + innerH - (val / maxValue) * innerH;
    return { val, y };
  });

  // X-axis labels — show subset to avoid overlap
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
            {t.val >= 1000 ? `${(t.val / 1000).toFixed(0)}k` : Math.round(t.val)}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill={color} opacity={0.1} />

      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="white" stroke={color} strokeWidth={2} />
      ))}

      {/* X-axis labels */}
      {points.map((p, i) =>
        i % labelStep === 0 || i === points.length - 1 ? (
          <text
            key={i}
            x={p.x}
            y={chartHeight - 8}
            textAnchor="middle"
            className="text-[10px]"
            fill="#A8A29E"
          >
            {p.label}
          </text>
        ) : null,
      )}
    </svg>
  );
}
