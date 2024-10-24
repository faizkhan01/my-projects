'use client';
import ControlledCountrySelector from '@/components/hookForm/ControlledCountrySelector';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { ControlledFormSelect } from '@/components/hookForm/ControlledFormSelect';
import { StripeCountryCodes } from '@/constants/stripe';
import { CurrencyCode } from '@/constants/world-currencies';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { handleAxiosError } from '@/lib/axios';
import { createBankAccount } from '@/services/API/seller/bankInfo';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { ModalCardContainer, ModalContainer } from '@/ui-kit/containers';
import { MenuItem } from '@/ui-kit/menu';
import { yupResolver } from '@hookform/resolvers/yup';
import { useStripe } from '@stripe/react-stripe-js';
import { CreateTokenBankAccountData } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { forwardRef, useEffect, useMemo } from 'react';
import {
  Control,
  SubmitHandler,
  UseFormSetValue,
  useForm,
  useWatch,
} from 'react-hook-form';
import { IMaskInput, IMaskInputProps, ReactMaskProps } from 'react-imask';
import isIBAN from 'validator/lib/isIBAN';
import isCurrencyCode from 'validator/lib/isISO4217';
import * as Yup from 'yup';

interface AddBankAccountModalProps {
  open: boolean;
  onClose: () => void;
  currenciesAndCountryOptions: Record<StripeCountryCodes, CurrencyCode[]>;
}

type InputTypes =
  | 'account-number'
  | 'iban' // Generally it's used for Europe and it's equal to account-number
  | 'swift' // Only for cross border payments except Malaysia. It's generally used with account number
  | 'bank-code' // bank-code and branch-code needs to be combined to make to make routing-number for Singapore and Thailand
  | 'branch-code'
  | 'sort-code' // Only for UK and it's used with account-number
  | 'routing-number' // USA
  | 'institution-number' // institution-number and transit-number needs to be combined to make to make routing-number for Canada
  | 'transit-number'
  | 'bnb';

interface Fields {
  defaultCurrency: CurrencyCode;
  inputs: {
    type: InputTypes;
    maskProps?: IMaskInputProps<HTMLInputElement>;
  }[];
  getAccountNumber?: (data: FormData) => string;
  getRoutingNumber?: (data: FormData) => string;
}

const getEuroFields = (
  ibanMaskProps?: IMaskInputProps<HTMLInputElement>,
  extraFields?: Fields['inputs'],
): Fields => ({
  defaultCurrency: 'EUR',
  getAccountNumber: (data) => {
    return data.iban?.replace(/\s/g, '') ?? '';
  },
  inputs: [
    {
      type: 'iban',
      maskProps: {
        prepareChar: (char: string) => char.toUpperCase(),
        definitions: {
          '#': /[0-9A-Za-z]/,
        },
        ...ibanMaskProps,
      },
    },
    ...(extraFields ?? []),
  ],
});

const maskRegexWordsAndDigits = /^\w+$/;

const BANK_ACCOUNT_DATA_BY_COUNTRY: Record<StripeCountryCodes, Fields> = {
  US: {
    defaultCurrency: 'USD',
    inputs: [
      {
        type: 'account-number',
        maskProps: {
          mask: maskRegexWordsAndDigits,
        },
      },
      {
        type: 'routing-number',
        maskProps: {
          mask: '000000000', // 9 digits
        },
      },
    ],
  },
  CA: {
    defaultCurrency: 'CAD',
    getRoutingNumber: (data) => {
      return `${data['transit-number']}${data['institution-number']}`;
    },
    inputs: [
      {
        type: 'account-number',
        maskProps: {
          mask: maskRegexWordsAndDigits,
        },
      },
      {
        type: 'transit-number',
        maskProps: {
          mask: '00000', // 5 digits
        },
      },
      {
        type: 'institution-number',
        maskProps: {
          mask: '000', // 3 digits
        },
      },
    ],
  },
  NZ: {
    defaultCurrency: 'NZD',
    inputs: [
      {
        type: 'account-number',
        maskProps: {
          mask: '00 0000 0000000 000', // 16 digits
        },
      },
    ],
  },
  AU: {
    defaultCurrency: 'AUD',
    getRoutingNumber: (data) => {
      return data.bnb ?? '';
    },
    inputs: [
      {
        type: 'account-number',
        maskProps: {
          mask: maskRegexWordsAndDigits,
        },
      },
      {
        type: 'bnb',
        maskProps: {
          mask: '000000',
        },
      },
    ],
  },
  SG: {
    defaultCurrency: 'SGD',
    inputs: [
      {
        type: 'account-number',
        maskProps: {
          mask: maskRegexWordsAndDigits,
        },
      },
      {
        type: 'bank-code',
        maskProps: {
          mask: '0000',
        },
      },
      {
        type: 'branch-code',
        maskProps: {
          mask: '000',
        },
      },
    ],
    getRoutingNumber: (data) => {
      const bankCode = data['bank-code'];
      const branchCode = data['branch-code'];

      if (!bankCode || !branchCode) return '';
      return `${bankCode}-${branchCode}`;
    },
  },
  // https://bank.codes/iban/structure/
  FR: getEuroFields({
    mask: 'FR00 00000 00000 ########### 00',
  }),
  DE: getEuroFields({
    mask: 'DE00 00000000 0000000000',
  }),
  ES: getEuroFields({
    mask: 'ES00 0000 0000 00 0000000000',
  }),
  IT: getEuroFields({
    mask: 'IT00 a 00000 00000 ############',
  }),
  AT: getEuroFields({
    mask: 'AT00 00 00000 00000000000',
  }),
  BE: getEuroFields({
    mask: 'BE00 000 0000000 00',
  }),
  BG: getEuroFields({
    mask: 'BG00 aaaa 0000 00 ########',
  }),
  HR: getEuroFields({
    mask: 'HR00 0000000 0000000000',
  }),
  CY: getEuroFields({
    mask: 'CY00 000 00000 #### #### #### ####',
  }),
  CZ: getEuroFields({
    mask: 'CZ00 0000 000000 0000000000',
  }),
  DK: getEuroFields({
    mask: 'DK00 0000 0000000000',
  }),
  EE: getEuroFields({
    mask: 'EE00 00 00 00000000000 0',
  }),
  FI: getEuroFields({
    mask: 'FI00 000000 0000000 0',
  }),
  GI: getEuroFields({
    mask: 'GI00 aaaa #### #### #######',
  }),
  GR: getEuroFields({
    mask: 'GR00 000 0000 #### #### #### ####',
  }),
  HU: getEuroFields({
    mask: 'HU00 000 0000 0000 0000 0000 0000 0',
  }),
  CH: getEuroFields({
    mask: 'CH00 00000 #### #### ####',
  }),
  IE: getEuroFields({
    mask: 'IE00 aaaa 000000 00000000',
  }),
  PT: getEuroFields({
    mask: 'PT00 0000 0000 0000 0000 000 00',
  }),
  RO: getEuroFields({
    mask: 'RO00 aaaa #### #### #### ####',
  }),
  SK: getEuroFields({
    mask: 'SK00 0000 000000 0000000000',
  }),
  SI: getEuroFields({
    mask: 'SI00 00 000 00000000 00',
  }),
  SE: getEuroFields({
    mask: 'SE00 000 0000 0000 0000 00000',
  }),
  NL: getEuroFields({
    mask: 'NL00 aaaa 0000 0000 00',
  }),
  MT: getEuroFields({
    mask: 'MT00 aaaa 00000 #### #### #### ######',
  }),
  LU: getEuroFields({
    mask: 'LU00 000 #### #### #####',
  }),
  LV: getEuroFields({
    mask: 'LV00 aaaa #### #### #####',
  }),
  NO: getEuroFields({
    mask: 'NO00 0000 000000 0',
  }),
  PL: getEuroFields({
    mask: 'PL00 000 0000 0 0000 0000 0000 0000',
  }),
  LT: getEuroFields({
    mask: 'LT00 00000 0000 0000 000',
  }),
  LI: getEuroFields({
    mask: 'LI00 00000 #### #### ####',
  }),
  GB: getEuroFields(
    {
      mask: 'GB00 aaaa 000000 00000000',
    },
    [
      {
        type: 'routing-number',
        maskProps: {
          mask: maskRegexWordsAndDigits,
        },
      },
    ],
  ),
  // HK: undefined,
  // IN: undefined,
  // MY: undefined,
};

const accountHolderTypeOptions: {
  value: FormData['accountHolderType'];
  label: string;
  disabled?: boolean;
}[] = [
  {
    label: 'Please select an option',
    disabled: true,
    value: '',
  },
  {
    label: 'Individual',
    value: 'individual',
  },
  {
    label: 'Company',
    value: 'company',
  },
];

const validationSchema: Yup.ObjectSchema<
  Record<InputTypes, string | undefined> & {
    ownerName: string;
    accountHolderType: 'individual' | 'company' | '';
    countryIso2: string;
    currency: string;
    requiredFields: Record<InputTypes, boolean>;
  }
> = Yup.object().shape({
  ownerName: Yup.string().required('Account holder is required'),
  accountHolderType: Yup.string()
    .notOneOf(['initial'], 'Please select an option')
    .oneOf(['individual', 'company'], 'Please select an option')
    .required('Please select an option'),
  countryIso2: Yup.string().required('Please select a country'),
  currency: Yup.string()
    .required('Currency is required')
    .test('currency', 'Invalid currency', (value) => isCurrencyCode(value)),

  'account-number': Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) =>
      requiredFields['account-number'],
    then: (s) => s.required('Account number is required'),
  }),
  'routing-number': Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) =>
      requiredFields['routing-number'],
    then: (s) => s.required('Routing number is required'),
  }),
  'transit-number': Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) =>
      requiredFields['transit-number'],
    then: (s) => s.required('Transit number is required'),
  }),
  'institution-number': Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) =>
      requiredFields['institution-number'],
    then: (s) => s.required('Institution number is required'),
  }),
  'branch-code': Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) =>
      requiredFields['branch-code'],
    then: (s) => s.required('Branch code is required'),
  }),
  'bank-code': Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) =>
      requiredFields['bank-code'],
    then: (s) => s.required('Bank code is required'),
  }),
  iban: Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) => requiredFields['iban'],
    then: (s) =>
      s
        .required('IBAN is required')
        .test('iban', 'Invalid IBAN', (value) => isIBAN(value)),
  }),
  swift: Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) =>
      requiredFields['swift'],
    then: (s) => s.required('Swift is required'),
  }),
  'sort-code': Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) =>
      requiredFields['sort-code'],
    then: (s) => s.required('Sort code is required'),
  }),
  bnb: Yup.string().when('requiredFields', {
    is: (requiredFields: Record<InputTypes, boolean>) => requiredFields['bnb'],
    then: (s) => s.required('BNB is required'),
  }),
  requiredFields: Yup.object().shape({
    'account-number': Yup.boolean().required(),
    'routing-number': Yup.boolean().required(),
    'transit-number': Yup.boolean().required(),
    'institution-number': Yup.boolean().required(),
    'branch-code': Yup.boolean().required(),
    'bank-code': Yup.boolean().required(),
    iban: Yup.boolean().required(),
    swift: Yup.boolean().required(),
    'sort-code': Yup.boolean().required(),
    bnb: Yup.boolean().required(),
  }),
});

type FormData = Yup.InferType<typeof validationSchema>;

const defaultEmptyValues: FormData = {
  ownerName: '',
  currency: '',
  accountHolderType: '',
  countryIso2: '',
  'account-number': '',
  'routing-number': '',
  'transit-number': '',
  'institution-number': '',
  'branch-code': '',
  'bank-code': '',
  iban: '',
  swift: '',
  'sort-code': '',
  requiredFields: {
    'account-number': false,
    'routing-number': false,
    'bank-code': false,
    'transit-number': false,
    'institution-number': false,
    'branch-code': false,
    iban: false,
    swift: false,
    'sort-code': false,
    bnb: false,
  },
};

const TextMaskCustom = forwardRef<
  HTMLInputElement,
  ReactMaskProps<HTMLInputElement> & {
    onChange: (value: string) => void;
  }
>(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      overwrite
      {...other}
      inputRef={ref}
      onAccept={(value) => onChange(value)}
    />
  );
});

const getSettings = (countryIso2: string | null) => {
  if (!countryIso2) return null;

  return BANK_ACCOUNT_DATA_BY_COUNTRY[countryIso2 as StripeCountryCodes];
};

const CountryField = ({
  control,
  currenciesAndCountryOptions,
}: {
  control: Control<FormData>;
  currenciesAndCountryOptions: AddBankAccountModalProps['currenciesAndCountryOptions'];
}) => {
  const availableCountries = useMemo(
    () => Object.keys(currenciesAndCountryOptions),
    [currenciesAndCountryOptions],
  );

  return (
    <div>
      <ControlledCountrySelector
        control={control}
        name="countryIso2"
        label="Country"
        onChangeSend="iso2"
        placeholder="Select the bank account country"
        getFilteredCountries={(countries) => {
          return countries.filter((c) =>
            availableCountries.includes(c.iso2 as StripeCountryCodes),
          );
        }}
      />
    </div>
  );
};

const CurrencyField = ({
  control,
  currenciesAndCountryOptions,
  setValue,
}: {
  control: Control<FormData>;
  currenciesAndCountryOptions: AddBankAccountModalProps['currenciesAndCountryOptions'];
  setValue: UseFormSetValue<FormData>;
}) => {
  const countryIso2 = useWatch<FormData, 'countryIso2'>({
    control,
    name: 'countryIso2',
  });
  const availableCurrencies =
    currenciesAndCountryOptions?.[countryIso2 as StripeCountryCodes];

  useEffect(() => {
    if (countryIso2) {
      const settings = getSettings(countryIso2);

      setValue(
        'currency',
        settings?.defaultCurrency || availableCurrencies?.[0] || '',
      );
    }
  }, [setValue, countryIso2, availableCurrencies]);

  if (!availableCurrencies) return null;

  return (
    <div>
      <ControlledFormSelect
        id="currency"
        control={control}
        name="currency"
        label="Currency"
        SelectProps={{
          displayEmpty: true,
        }}
      >
        <MenuItem value={''} disabled={true}>
          Select the bank account currency
        </MenuItem>
        {availableCurrencies.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </ControlledFormSelect>
    </div>
  );
};

const BankAccountFields = ({
  control,
  setValue,
}: {
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
}) => {
  const countryIso2 = useWatch<FormData, 'countryIso2'>({
    control,
    name: 'countryIso2',
  });

  const settings = useMemo(() => {
    return getSettings(countryIso2);
  }, [countryIso2]);

  useEffect(() => {
    if (!settings?.inputs) return;

    setValue(
      'requiredFields',
      settings?.inputs.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.type]: true,
        }),
        defaultEmptyValues.requiredFields,
      ),
    );
  }, [setValue, settings?.inputs]);

  if (!settings) return null;

  return settings?.inputs?.map((i) => {
    const getLabel = (): string => {
      switch (i.type) {
        case 'account-number':
          return 'Account Number';
        case 'routing-number':
          return 'Routing Number';
        case 'transit-number':
          return 'Transit Number';
        case 'institution-number':
          return 'Institution Number';
        case 'iban':
          return 'IBAN';
        case 'swift':
          return 'SWIFT';
        case 'sort-code':
          return 'Sort Code';
        case 'bank-code':
          return 'Bank Code';
        case 'branch-code':
          return 'Branch Code';
        case 'bnb':
          return 'BNB';
      }
    };

    return (
      <div key={i.type}>
        <ControlledFormInput
          id={i.type}
          name={i.type}
          label={getLabel()}
          placeholder={`Enter ${getLabel().toLowerCase()}`}
          control={control}
          inputProps={{
            ...i.maskProps,
          }}
          InputProps={{
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            inputComponent: TextMaskCustom as any,
          }}
        />
      </div>
    );
  });
};

const AddBankAccountModal = ({
  open,
  onClose,
  currenciesAndCountryOptions,
}: AddBankAccountModalProps) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: defaultEmptyValues,
    resolver: yupResolver(validationSchema),
  });
  const stripe = useStripe();
  const { refresh } = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!stripe) return;
    const settings = getSettings(data.countryIso2);

    let routingNumber: string | undefined = undefined;
    let accountNumber: string | undefined = undefined;

    if (data.requiredFields['account-number']) {
      accountNumber = data['account-number'];
    } else if (settings?.getAccountNumber) {
      accountNumber = settings.getAccountNumber(data);
    }

    if (data.requiredFields['routing-number']) {
      routingNumber = data['routing-number'];
    } else if (settings?.getRoutingNumber) {
      routingNumber = settings.getRoutingNumber(data);
    }

    // We need to remove the spaces from the account number and routing number
    accountNumber = accountNumber?.replace(/\s/g, '');
    routingNumber = routingNumber?.replace(/\s/g, '');

    if (!accountNumber) return;
    if (routingNumber === '') routingNumber = undefined;

    try {
      const res = await stripe?.createToken('bank_account', {
        currency: data.currency,
        country: data.countryIso2,
        account_number: accountNumber,
        account_holder_name: data.ownerName,
        account_holder_type: data.accountHolderType,
        routing_number: routingNumber,
      } satisfies CreateTokenBankAccountData);

      if (res.error) throw res.error;

      const response = await createBankAccount(res.token.id);

      showSuccessSnackbar(
        response.message || 'Bank Account Added Successfully',
      );
      onClose();
      refresh();

      setTimeout(() => {
        reset();
      }, 500);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer title="Add a New Bank Account">
        <form className="pt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 md:gap-6">
            <div>
              <ControlledFormInput
                control={control}
                name="ownerName"
                label="Account Owner"
                placeholder="Enter Account Owner Name"
                InputProps={{
                  autoComplete: 'name',
                }}
              />
            </div>
            <div>
              <ControlledFormSelect
                id="accountHolderType"
                control={control}
                name="accountHolderType"
                label="Account Type"
                SelectProps={{
                  displayEmpty: true,
                }}
              >
                {accountHolderTypeOptions.map((o) => (
                  <MenuItem key={o.label} value={o.value} disabled={o.disabled}>
                    {o.label}
                  </MenuItem>
                ))}
              </ControlledFormSelect>
            </div>
            <CountryField
              control={control}
              currenciesAndCountryOptions={currenciesAndCountryOptions}
            />
            <CurrencyField
              control={control}
              setValue={setValue}
              currenciesAndCountryOptions={currenciesAndCountryOptions}
            />

            <BankAccountFields control={control} setValue={setValue} />
            <div className="flex flex-col gap-3 md:flex-row md:gap-6">
              <ContainedButton
                type="submit"
                size="large"
                fullWidth
                loading={isSubmitting}
              >
                Save
              </ContainedButton>
              <OutlinedButton
                type="button"
                size="large"
                onClick={onClose}
                fullWidth
              >
                Cancel
              </OutlinedButton>
            </div>
          </div>
        </form>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default AddBankAccountModal;
