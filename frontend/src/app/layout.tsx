import { roboto } from '@/lib/theme/font';
import Script from 'next/script';
import './globals.css';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import { DOMAINS } from '@/constants/domains';
import { getPathName } from '@/utils/ssr';

async function getData() {
  const headersList = headers();

  return {
    topLevelDomain: headersList.get('host')?.split('.').at(-1),
    pathname: getPathName(headersList),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { topLevelDomain, pathname } = await getData();

  let metadataBase: URL = DOMAINS.MAIN;

  if (topLevelDomain === 'com') {
    metadataBase = DOMAINS.MAIN;
  } else if (topLevelDomain === 'ca') {
    metadataBase = DOMAINS.CANADA;
  }
  const title = 'Only Latest';
  const description =
    'Discover a marketplace tailored to your unique interests, where you can create, purchase, and sell.';

  const metadata: Metadata = {
    title: {
      template: '%s | Only Latest',
      default: title,
    },
    description,
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1, // Fix for iOS 10
    },
    metadataBase, // Metadata base is required so the opengraph-image and twitter-image tags are generated correctly
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      title,
      description,
    },
  };

  if (pathname) {
    metadata.alternates = {
      canonical: pathname,
    };
  }

  return metadata;
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { topLevelDomain } = await getData();
  const defaultGtmCode = 'GTM-P64GKZM';
  let gtmCode = defaultGtmCode;

  switch (topLevelDomain) {
    case 'com':
      gtmCode = defaultGtmCode;
      break;
    case 'ca':
      gtmCode = 'GTM-MSVH7SX3';
      break;
    default:
      gtmCode = defaultGtmCode;
      break;
  }

  return (
    <html lang="en">
      <body className={roboto.className} id="__next">
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmCode}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        ></noscript>
        {children}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmCode}');`,
          }}
        ></Script>
      </body>
    </html>
  );
}
