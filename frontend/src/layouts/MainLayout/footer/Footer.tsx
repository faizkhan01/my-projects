import { getPageFooter } from '@/services/API/page-sections';
import FooterInfoDesktop from './FooterInfoDesktop';
import FooterInfoMobile from './FooterInfoMobile';
import { PageFooter } from '@/types/page-section';

const Footer = async () => {
  let footer: PageFooter | null;

  try {
    footer = await getPageFooter();
  } catch (_) {
    footer = null;
  }

  return (
    <footer className="bg-primary-main text-white">
      <FooterInfoDesktop data={footer} />
      <FooterInfoMobile data={footer} />
    </footer>
  );
};

export default Footer;
