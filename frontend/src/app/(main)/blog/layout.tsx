import { ReactNode } from 'react';

export const metadata = {
  title: {
    template: '%s | Only Latest Blog',
    default: 'Only Latest Blog',
    absolute: 'Only Latest Blog',
  },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
