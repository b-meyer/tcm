import { ref } from 'vue';

type Theme = 'light' | 'dark';

const HUE_DEFAULT = 210;
const INTENSITY_DEFAULT = 50;

function readNumber(key: string, fallback: number, min: number, max: number): number {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
}

const theme = ref<Theme>(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
const hue = ref<number>(readNumber('brand-hue', HUE_DEFAULT, 0, 360));
const intensity = ref<number>(readNumber('brand-intensity', INTENSITY_DEFAULT, 0, 100));

function setTheme(t: Theme): void {
  theme.value = t;
  localStorage.setItem('theme', t);
  document.documentElement.classList.toggle('dark', t === 'dark');
}

function setHue(h: number): void {
  hue.value = h;
  localStorage.setItem('brand-hue', String(h));
  document.documentElement.style.setProperty('--brand-hue', String(h));
}

function setIntensity(i: number): void {
  intensity.value = i;
  localStorage.setItem('brand-intensity', String(i));
  document.documentElement.style.setProperty('--brand-intensity', String(i / 100));
}

export function useTheme() {
  return { theme, hue, intensity, setTheme, setHue, setIntensity };
}
