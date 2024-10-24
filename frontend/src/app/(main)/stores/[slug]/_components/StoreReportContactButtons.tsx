'use client';
import { useSocketStore } from '@/hooks/stores/useSocketStore';
import { Store } from '@/types/stores';
import { useState } from 'react';
import { EnvelopeSimple, ClipboardText } from '@phosphor-icons/react';
import ReportSellerModal from '@/components/modals/ReportSellerModal';
import { Button } from '@mui/material';
import useProfile from '@/hooks/queries/useProfile';

const StoreReportContactButtons = ({ store }: { store: Store }) => {
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();
  const handleContact = () => {
    createChat({ storeId: store.id });
    setLoading(true);
  };
  const createChat = useSocketStore((state) => state.createChat);
  const [isReportSellerModal, setIsReportSellerModal] = useState(false);
  const isOwnStore = profile?.store?.name === store.name;

  return (
    <>
      <ReportSellerModal
        storeId={store.id}
        open={isReportSellerModal}
        onClose={() => setIsReportSellerModal(false)}
      />
      <div className="flex gap-x-4 sm:mt-2.5">
        <Button
          sx={{
            fontWeight: { xs: 500, sm: 400 },
            fontSize: { xs: '12px', md: '14px' },
            lineHeight: '16px',
          }}
          startIcon={
            <>
              <EnvelopeSimple size={16} className="sm:hidden" />
              <EnvelopeSimple size={24} className="hidden sm:block" />
            </>
          }
          variant="text"
          onClick={handleContact}
          disabled={loading || !profile || isOwnStore}
        >
          Contact Seller
        </Button>
        <Button
          sx={{
            fontWeight: { xs: 500, sm: 400 },
            fontSize: { xs: '12px', md: '14px' },
            lineHeight: '16px',
          }}
          startIcon={
            <>
              <ClipboardText size={16} className="sm:hidden" />
              <ClipboardText size={24} className="hidden sm:block" />
            </>
          }
          variant="text"
          disabled={loading || !profile || isOwnStore}
          onClick={() => setIsReportSellerModal(true)}
        >
          Report seller
        </Button>
      </div>
    </>
  );
};

export default StoreReportContactButtons;
