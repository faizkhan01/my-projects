import { getHelpTopics } from '@/services/API/help';
import HelpCenterPage from './HelpCenterPage';

export const metadata = {
  title: 'Help Center',
};

const HelpCenter = async () => {
  const helpTopics = await getHelpTopics();

  return <HelpCenterPage helpTopics={helpTopics} />;
};

export default HelpCenter;
