import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { prefersReducedMotion } from '@/scripts/utils';

export type SidebarItem = { slug: string; title: string };
export type SidebarGroup = { group: string; items: SidebarItem[] };

export const home: SidebarItem = { slug: 'index', title: 'Home' };

export const sidebar: SidebarGroup[] = [
  {
    group: 'Foundation',
    items: [
      { slug: 'YinYang', title: 'Yin & Yang' },
      { slug: 'WuXing', title: 'Wu Xing (Five Phases)' },
    ],
  },
  {
    group: 'Substances',
    items: [
      { slug: 'Qi', title: 'Qi (Vital Energy)' },
      { slug: 'Jing', title: 'Jing (Essence)' },
      { slug: 'Shen', title: 'Shen (Spirit)' },
      { slug: 'Xue', title: 'Xue (Blood)' },
      { slug: 'JinYe', title: 'Jin Ye (Body Fluids)' },
    ],
  },
  {
    group: 'Synthesis & Anatomy',
    items: [
      { slug: 'ZangFu', title: 'Zang-Fu (Organs)' },
      { slug: 'Jingmai', title: 'Jingmai (Meridians)' },
    ],
  },
  {
    group: 'Causes of Disease',
    items: [
      { slug: 'LiuYin', title: 'Liu Yin (Six Pathogens)' },
      { slug: 'QiQing', title: 'Qi Qing (Seven Emotions)' },
    ],
  },
  {
    group: 'Diagnostic Apparatus',
    items: [
      { slug: 'BaGang', title: 'Ba Gang (Eight Principles)' },
      { slug: 'SiZhen', title: 'Si Zhen (Four Examinations)' },
    ],
  },
  {
    group: 'Practice',
    items: [{ slug: 'Qigong', title: 'Qigong' }],
  },
];

export const flatOrder: SidebarItem[] = [home, ...sidebar.flatMap((g) => g.items)];

export function slugFromPath(path: string): string {
  if (path === '/' || path === '') return 'index';
  // `?? 'index'` is unreachable at runtime — String.prototype.split always
  // returns a non-empty array. The fallback is here to satisfy TS's
  // `noUncheckedIndexedAccess` widening of tuple[0] to `string | undefined`.
  return path.slice(1).split('/')[0] ?? 'index';
}

export function neighbors(currentSlug: string): {
  prev: SidebarItem | null;
  next: SidebarItem | null;
} {
  const idx = flatOrder.findIndex((i) => i.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? (flatOrder[idx - 1] ?? null) : null,
    next: idx < flatOrder.length - 1 ? (flatOrder[idx + 1] ?? null) : null,
  };
}

const pages = import.meta.glob('../pages/*.md');

for (const item of flatOrder) {
  if (!pages[`../pages/${item.slug}.md`]) {
    throw new Error(`router.ts: no markdown file for sidebar slug "${item.slug}"`);
  }
}
const notFound = pages['../pages/NotFound.md'];
if (!notFound) {
  throw new Error('router.ts: src/pages/NotFound.md is required for the catch-all route');
}

const routes: RouteRecordRaw[] = flatOrder.map((item) => ({
  path: item.slug === 'index' ? '/' : `/${item.slug}`,
  component: pages[`../pages/${item.slug}.md`]!,
}));
routes.push({ path: '/:pathMatch(.*)*', component: notFound });

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      return { el: to.hash, behavior: prefersReducedMotion() ? 'auto' : 'smooth' };
    }
    return { top: 0 };
  },
});
