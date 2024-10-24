import FooterIcon from './FooterIcon';
import { FacebookIcon } from '@/assets/icons/FacebookIcon';
import { InstagramIcon } from '@/assets/icons/InstagramIcon';
import { LinkedinIcon } from '@/assets/icons/LinkedinIcon';
import { TwitterIcon } from '@/assets/icons/TwitterIcon';

const FooterSocialIcons = () => (
  <>
    <FooterIcon
      icon={<FacebookIcon aria-label="Facebook" />}
      href="https://facebook.com/onlylatest"
      target="_blank"
    />
    <FooterIcon
      icon={<InstagramIcon aria-label="Instagram" />}
      href="https://www.instagram.com/only.latest"
      target="_blank"
    />
    <FooterIcon
      icon={<TwitterIcon aria-label="Twitter" />}
      href="https://twitter.com/only_latest"
      target="_blank"
    />
    {/* <FooterIcon
      icon={<YoutubeIcon aria-label="Youtube" />}
      href="https://www.youtube.com/@onlylatestinc"
      target="_blank"
    /> */}
    <FooterIcon
      icon={<LinkedinIcon aria-label="Linkedin" />}
      href="https://www.linkedin.com/company/onlylatest"
      target="_blank"
    />
  </>
);

export default FooterSocialIcons;
