'use client';
import CustomersPage from '@/components/sellerDashboard/CustomersPage';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { AllCustomers } from '@/types/allCustomers';

interface CustomersOrdersProps {
  customersOrders: AllCustomers[];
}

const customers = ({ customersOrders }: CustomersOrdersProps) => {
  return (
    <SellerDashboardLayout title="Customers">
      <CustomersPage customersOrders={customersOrders} />
    </SellerDashboardLayout>
  );
};

export default customers;
