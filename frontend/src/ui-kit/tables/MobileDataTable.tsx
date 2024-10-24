import MobileDataGrid, { MobileDataGridProps } from './MobileDataGrid';
import { Theme, Typography, useMediaQuery } from '@mui/material';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MobileDataTableProps<T> extends MobileDataGridProps<T> {
  title?: string;
  showOnlyOnMobile?: boolean;
}

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow: 'none',
  borderRadius: '10px',
  padding: '24px 24px 0px 24px',
}));

export const MobileDataTable = <T,>({
  title,
  showOnlyOnMobile = true,
  ...props
}: MobileDataTableProps<T>) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  if (!isMobile && showOnlyOnMobile) {
    return null;
  }

  return (
    <StyledCard className={props.hideFooter ? 'pb-6' : ''}>
      {title && (
        <Typography className="mb-3 text-lg/6 font-semibold text-text-primary">
          {title}
        </Typography>
      )}
      <MobileDataGrid {...props} />
    </StyledCard>
  );
};
