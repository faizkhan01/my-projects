import { Stack, Typography } from '@mui/material';
import { BackLinkButton, ContainedButton } from '@/ui-kit/buttons';
import MyOrderItem from './MyOrderItem';
import Link from 'next/link';
import routes from '@/constants/routes';
import { Order } from '@/types/orders';
import { MobileHeading } from '@/ui-kit/typography';

interface MyOrdersProps {
  orders: Order[];
}

const MyOrders: React.FC<MyOrdersProps> = ({ orders }) => (
  <div>
    <BackLinkButton />
    <MobileHeading title="My Orders" />
    <Stack
      spacing={3}
      sx={{
        marginBottom: {
          sm: '60px',
          md: '96px',
        },
      }}
    >
      {orders.length === 0 && (
        <div>
          <Typography component="h3" fontSize="24px" fontWeight="600">
            You don&apos;t have any orders yet
          </Typography>
          <Typography fontSize="16px" mt="8px">
            You can start shopping by visiting the next link.
          </Typography>
          <div className="mt-6 h-[200px] w-full">
            <Link href={routes.INDEX} passHref legacyBehavior>
              <ContainedButton fullWidth size="large">
                Go to shop
              </ContainedButton>
            </Link>
          </div>
        </div>
      )}
      {orders.map((order) =>
        order.items.map((item) => (
          <MyOrderItem key={item.id} order={order} item={item} />
        )),
      )}
    </Stack>
  </div>
);
export default MyOrders;
