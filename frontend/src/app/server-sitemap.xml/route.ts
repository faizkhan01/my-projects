import { getCategories } from '@/services/API/categories';
import { getHelpTopics } from '@/services/API/help';
import {
  IAlternateRef,
  ISitemapField,
  getServerSideSitemap,
} from 'next-sitemap';

const DOMAINS: { url: string; lang: string }[] = [
  { url: 'https://www.onlylatest.com', lang: 'en' },
  { url: 'https://www.onlylatest.ca', lang: 'en-CA' },
];

// For priority: https://slickplan.com/blog/xml-sitemap-priority-changefreq

const getAllLocAndRefs = (
  path: string,
  opts?: Omit<ISitemapField, 'loc' | 'alternateRefs'>,
) => {
  const fields: ISitemapField[] = [];

  for (const domain of DOMAINS) {
    const loc = `${domain.url}${path}`;
    const alternateRefs: IAlternateRef[] = DOMAINS.map((d) => {
      const href = `${d.url}${path}`;
      return {
        href,
        hreflang: d.lang,
      };
    });

    fields.push({
      loc,
      alternateRefs,
      ...opts,
    });
  }

  return fields;
};

const getStaticPageUrls = (): ISitemapField[] => {
  return [
    ...getAllLocAndRefs('/', {
      priority: 1,
    }),
    ...getAllLocAndRefs('/cart', {
      priority: 0.8,
    }),
    ...getAllLocAndRefs('/wishlist', {
      priority: 0.8,
    }),
    ...getAllLocAndRefs('/checkout', {
      priority: 0.8,
    }),

    ...getAllLocAndRefs('/search', {
      priority: 0.8,
    }),
    ...getAllLocAndRefs('/privacy-policy', {
      priority: 0.8,
    }),
  ];
};

const getCategoriesUrls = async (): Promise<ISitemapField[]> => {
  const categories = await getCategories();

  return categories
    .map((c) => {
      let path = '';

      if (c?.children?.length) {
        path = `/catalog/${c.slug}/${c.id}`;
      } else {
        path = `/categories/${c.slug}`;
      }
      const priority = 0.6;
      const routes: ISitemapField[] = getAllLocAndRefs(path, {
        priority,
      });

      return routes;
    })
    .flat();
};

const getHelpCenterUrls = async (): Promise<ISitemapField[]> => {
  const help = await getHelpTopics();

  return help
    .map((h) => {
      const base = '/help';
      const priority = 0.4;
      const path = `${base}/${h.slug}`;
      const routes: ISitemapField[] = getAllLocAndRefs(path, {
        priority,
      });

      h.questions.forEach((q) => {
        const path = `${base}/${h.slug}/${q.slug}`;
        routes.push(
          ...getAllLocAndRefs(path, {
            priority,
          }),
        );
      });

      return routes;
    })
    .flat();
};

export async function GET() {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const [helpCenterUrls, categoriesUrls] = await Promise.allSettled([
    getHelpCenterUrls(),
    getCategoriesUrls(),
  ]);
  const staticPageUrls = getStaticPageUrls();

  return getServerSideSitemap(
    [
      ...(helpCenterUrls.status === 'fulfilled' ? helpCenterUrls.value : []),
      ...(categoriesUrls.status === 'fulfilled' ? categoriesUrls.value : []),
      ...staticPageUrls,
    ].sort((a, b) => {
      // sort  by priority
      if ((a?.priority ?? 0) > (b.priority ?? 0)) return -1;
      if ((a?.priority ?? 0) < (b.priority ?? 0)) return 1;
      return 0;
    }),
    {
      'Content-Type': 'application/xml',
    },
  );
}
