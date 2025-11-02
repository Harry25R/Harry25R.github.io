import { getImpactData } from './data.js';
import { prefersReducedMotion } from './utils.js';

export async function initChart(root = document) {
  const chartContainer = root.querySelector('[data-impact-chart]');
  if (!chartContainer) return;

  const data = await getImpactData();
  if (!data || data.length === 0) {
    chartContainer.innerHTML = '<p class="text-sm text-slate-600 dark:text-slate-300">Impact data unavailable.</p>';
    return;
  }

  const width = 640;
  const height = 240;
  const padding = 40;
  const minValue = Math.min(...data.map((d) => d.value));
  const maxValue = Math.max(...data.map((d) => d.value));
  const valueRange = maxValue - minValue || 1;

  const times = data.map((d) => new Date(`${d.date}T00:00:00`).getTime());
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const timeRange = maxTime - minTime || 1;

  const points = data.map((item) => {
    const x = padding + ((new Date(`${item.date}T00:00:00`).getTime() - minTime) / timeRange) * (width - padding * 2);
    const y = height - padding - ((item.value - minValue) / valueRange) * (height - padding * 2);
    return { x, y, label: item.label, value: item.value, date: item.date };
  });

  const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');

  const circles = points
    .map(
      (point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="5" fill="rgb(37,99,235)" tabindex="0">
        <title>${point.label} (${point.date}): AUROC ${point.value}</title>
      </circle>`
    )
    .join('');

  chartContainer.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="impact-title impact-desc" class="h-full w-full">
      <title id="impact-title">Impact over time</title>
      <desc id="impact-desc">Model AUROC progression from ${data[0].date} to ${data[data.length - 1].date}.</desc>
      <rect x="${padding}" y="${padding}" width="${width - padding * 2}" height="${height - padding * 2}" class="fill-slate-100 dark:fill-slate-900" rx="12" />
      <path d="${pathData}" fill="none" stroke="rgb(37, 99, 235)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      ${circles}
    </svg>
  `;

  if (!prefersReducedMotion.matches) {
    const svg = chartContainer.querySelector('svg path');
    if (svg) {
      svg.style.strokeDasharray = svg.getTotalLength();
      svg.style.strokeDashoffset = svg.getTotalLength();
      svg.style.transition = 'stroke-dashoffset 1.2s ease-out';
      requestAnimationFrame(() => {
        svg.style.strokeDashoffset = '0';
      });
    }
  }
}
