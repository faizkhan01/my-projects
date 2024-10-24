'use client';
import Help from '@/views/dashboard/customer/Help';
import { HelpTopic } from '@/types/help';

const HelpCenterPage = ({ helpTopics }: { helpTopics: HelpTopic[] }) => (
  <Help topics={helpTopics} />
);

export default HelpCenterPage;
