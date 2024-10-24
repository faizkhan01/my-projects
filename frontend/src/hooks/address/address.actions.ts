import { useState } from 'react';
import {
  createAddress as createAddressAPI,
  updateAddress as updateAddressAPI,
  deleteAddress as deleteAddressAPI,
} from '@/services/API/addresses';
import { AddressFormData, AddressTypes } from '@/types/address';

export const useAddressActions = () => {
  const [loading, setLoading] = useState(false);

  const createAddress = async (data: AddressFormData, type: AddressTypes) => {
    setLoading(true);

    try {
      return await createAddressAPI(data, type);
    } catch (error) {
      console.error('Error in createAddress', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (
    id: number,
    data: Partial<AddressFormData>,
    type: AddressTypes,
  ) => {
    setLoading(true);
    try {
      return await updateAddressAPI(id, data, type);
    } catch (error) {
      console.error('Error in updateAddress', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: number, type: AddressTypes) => {
    setLoading(true);

    try {
      return await deleteAddressAPI(id, type);
    } catch (error) {
      console.error('Error in deleteAddress', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAddress,
    updateAddress,
    deleteAddress,
    loading,
  };
};
