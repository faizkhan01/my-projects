export const getShareUrl = (
  network: 'twitter' | 'facebook' | 'linkedin',
  data: {
    pageUrl: string;
    title: string;
  },
): string => {
  if (network === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${data.pageUrl}&p[title]=${data.title}`;
  }

  if (network === 'twitter') {
    return `https://twitter.com/share?text=${data.title}&url=${data.pageUrl}`;
  }

  if (network === 'linkedin') {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${data.pageUrl}`;
  }

  return '';
};
