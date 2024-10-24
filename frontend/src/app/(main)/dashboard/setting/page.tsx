import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getSellerSettings } from '@/services/API/seller/settings';
import { SellerSettingForm } from '@/types/sellerSetting';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import SellerSetting from '@/components/sellerDashboard/SellerSetting';

export const metadata = {
  title: 'Store Settings',
};

const Settings = async () => {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;

  const profile = await getProfile(token);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  const settings = await getSellerSettings(token);

  const banner = settings?.banner?.url ? settings.banner.url : null;
  const logo = settings?.logo?.url ? settings.logo.url : null;

  const formSettings: SellerSettingForm = {
    ...settings,
    newPassword: '',
    newPasswordConfirmation: '',
    oldPassword: '',
    banner: banner,
    logo: logo,
    country: settings?.country?.id || -1,
    state: settings?.state?.id || -1,
    addressOne: settings?.addressOne || '',
    addressTwo: settings?.addressTwo || '',
    city: settings?.city || '',
    phone: settings?.phone || '',
    firstName: settings?.firstName || '',
    lastName: settings?.lastName || '',
    zipCode: settings?.zipCode || '',
  };

  return (
    <SellerDashboardLayout title="Settings" hideTitleOnMobile>
      <SellerSetting
        defaultValues={formSettings || undefined}
        availableCurrencies={settings.allowedCurrencies ?? []}
      />
    </SellerDashboardLayout>
  );
};

export default Settings;
