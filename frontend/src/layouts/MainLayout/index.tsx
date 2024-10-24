import { ReactNode, FC, Suspense } from 'react';
import Footer from './footer/Footer';
import ClientContent from './ClientContent';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }): JSX.Element => {
  return (
    <div className="flex min-h-screen min-w-[100px] max-w-full flex-1 flex-col">
      <ClientContent>{children}</ClientContent>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
};

export default MainLayout;
