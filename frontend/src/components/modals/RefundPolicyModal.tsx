import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import { XCircle } from '@phosphor-icons/react';

interface RefundPolicyModalProps {
  open: boolean;
  onClose: (selectedPolicy: string | null) => void;
}

const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({
  open,
  onClose,
}) => {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const handlePolicySelection = (policy: string) => {
    setSelectedPolicy(policy);
  };

  const handleClose = () => {
    onClose(selectedPolicy);
    setSelectedPolicy(null);
  };

  return (
    <ModalContainer open={open} onClose={handleClose} maxWidth="xl">
      <ModalCardContainer title="Edit Refund Policy">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography
            sx={{
              fontWeight: '600',
              fontSize: '16px',
              lineHeight: '20px',
              mt: '24px',
            }}
          >
            Select a policy
          </Typography>
          <RefundItem
            onApply={() => handlePolicySelection('noRefunds')}
            selected={selectedPolicy ?? ''}
            title="No refunds"
            body="Buyer can contact seller about any issues with an order"
            listings={800}
          />
          <RefundItem
            onApply={() => handlePolicySelection('7Days')}
            selected={selectedPolicy ?? ''}
            title="Refunds only 7 days"
            body="Buyer is responsible for return shipping costs and any loss in value if an item isn’t returned in original condition"
            listings={400}
          />
          <RefundItem
            onApply={() => handlePolicySelection('30Days')}
            selected={selectedPolicy ?? ''}
            title="Refunds only 30 days"
            body="Buyer is responsible for return shipping costs and any loss in value if an item isn’t returned in original condition"
            listings={100}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '12px' }}>
            <div className="w-[173px]">
              <OutlinedButton onClick={() => onClose(null)} className="w-full">
                Cancel
              </OutlinedButton>
            </div>
          </Box>
        </Box>
      </ModalCardContainer>
    </ModalContainer>
  );
};

const RefundItem = ({
  selected,
  onApply,
  listings,
  title,
  body,
}: {
  listings: number;
  title: string;
  body: string;
  selected: string;
  onApply: (str: string) => void;
}) => {
  return (
    <Box className="flex items-center px-[24px] py-[16px] shadow-md">
      <Box className="mr-[12px] h-[46px] w-[46px] rounded-[100px] bg-[#F6F9FF] p-[11px]">
        <Box className="text-primary-main">
          <XCircle size={24} weight="regular" />
        </Box>
      </Box>
      <Box className="flex-1">
        <Typography className="text-[18px] font-semibold leading-[24px]">
          {title}
        </Typography>
        <Typography className="text-[14px] leading-[22px]">{body}</Typography>
        <Typography className="text-[12px] font-semibold leading-[16px] text-text-secondary">
          {listings} active listing use this policy
        </Typography>
      </Box>
      <Box className="ml-[12px]">
        <ContainedButton
          variant={selected === 'noRefunds' ? 'contained' : 'outlined'}
          onClick={() => onApply('noRefunds')}
        >
          Apply
        </ContainedButton>
      </Box>
    </Box>
  );
};

export default RefundPolicyModal;
