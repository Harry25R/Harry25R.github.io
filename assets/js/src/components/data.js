const cache = new Map();

async function fetchJSON(path) {
  if (cache.has(path)) return cache.get(path);
  try {
    const response = await fetch(path, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    const data = await response.json();
    cache.set(path, data);
    return data;
  } catch (error) {
    console.error(error);
    cache.set(path, []);
    return [];
  }
}

export function getProjects() {
  return fetchJSON('/assets/data/projects.json');
}

export function getPublications() {
  return fetchJSON('/assets/data/publications.json');
}

export function getTalks() {
  return fetchJSON('/assets/data/talks.json');
}

export function getTestimonials() {
  return fetchJSON('/assets/data/testimonials.json');
}

export async function getImpactData() {
  const path = '/assets/data/impact.csv';
  if (cache.has(path)) return cache.get(path);
  try {
    const response = await fetch(path, { headers: { 'Accept': 'text/csv' } });
    if (!response.ok) throw new Error('Failed to load impact.csv');
    const text = await response.text();
    const lines = text.trim().split('\n');
    const [, ...rows] = lines;
    const data = rows
      .map((row) => {
        const [date, value, label] = row.split(',');
        return { date, value: Number(value), label };
      })
      .filter((entry) => !Number.isNaN(entry.value));
    cache.set(path, data);
    return data;
  } catch (error) {
    console.error(error);
    cache.set(path, []);
    return [];
  }
}
