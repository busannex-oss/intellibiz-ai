import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Fetch all active PageContent records for a given page_key,
 * optionally filtered by section_key, sorted by order.
 */
export function useCmsContent(pageKey, sectionKey = null) {
  return useQuery({
    queryKey: ['cms', pageKey, sectionKey],
    queryFn: async () => {
      const filter = { page_key: pageKey, is_active: true };
      if (sectionKey) filter.section_key = sectionKey;
      return base44.entities.PageContent.filter(filter, 'order', 200);
    },
    staleTime: 30000,
  });
}

/**
 * Fetch all active PageContent for a page, grouped by section_key.
 * Returns: { hero: [...], service_item: [...], step: [...], ... }
 */
export function useCmsPage(pageKey) {
  const { data = [], isLoading, error } = useCmsContent(pageKey);

  const sections = data.reduce((acc, item) => {
    const key = item.section_key;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // Convenience: get first item of a section as a single object
  const get = (sectionKey) => sections[sectionKey]?.[0] ?? null;
  // Get all items of a section as array
  const list = (sectionKey) => sections[sectionKey] ?? [];

  return { sections, get, list, isLoading, error };
}