import { Attachment } from './attachment';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  showcased: boolean;
  author: BlogAuthor;
  banner: Attachment | null;
  meta: BlogPostMeta;
  categories: BlogCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostMeta {
  id: number;
  title: string;
  description: string;
  keywords: string[];
}

export interface BlogAuthor {
  id: number;
  name: string;
  avatar: Attachment | null;
}
