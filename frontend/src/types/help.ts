export interface HelpTopic {
  id: number;
  title: string;
  slug: string;
  questions: HelpQuestion[];
}

export interface HelpQuestion {
  id: number;
  title: string;
  slug: string;
  answer: string;
}
