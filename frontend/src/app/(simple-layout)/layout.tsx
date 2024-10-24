import { headers } from 'next/headers';
import { DeviceType } from '@/types/device-type';
import parser from 'ua-parser-js';
import { Providers } from '@/components/Providers';
import SimpleLayout from './SimpleLayout';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const userAgent = headers().get('user-agent');
  const deviceType: DeviceType =
    (parser(userAgent ?? undefined).device.type as DeviceType | undefined) ||
    'desktop';

  return (
    <Providers deviceType={deviceType}>
      <SimpleLayout>{children}</SimpleLayout>
    </Providers>
  );
};

export default Layout;
