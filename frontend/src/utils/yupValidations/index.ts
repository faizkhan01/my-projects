import { string, object, boolean, array, number, ref, ObjectSchema } from 'yup';

export const REGEX = {
  // Only: a text must contain just this or will complain
  only: {
    alpha: /^[A-Za-z]*$/,
    alphaNumeric: /^[A-Za-z0-9]*$/,
  },
  // Any: a text must contain this but it can contain any other kind of text
  any: {
    alpha: /[a-z]/i,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    alphaNumeric: /[a-zA-Z0-9]/,
    number: /\d/,
  },
  special: {
    postalCode: /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/i,
  },
};

export const storeNameSchema = string().matches(
  /^[a-zA-Z0-9\\s]+$/,
  'Only alphanumeric characters are allowed',
);

export const passwordSchema = string()
  .required('Password is required')
  .min(8, 'Must be at least 8 characters')
  .matches(REGEX.any.uppercase, 'Must contain at least one upper case letter')
  .matches(REGEX.any.lowercase, 'Must contain at least one lower case letter')
  .matches(REGEX.any.number, 'Must contain at least one number');

export const emailSchema = string()
  .required('Email is required')
  .email('Invalid Email');

export const postalCodeSchema = string()
  .matches(REGEX.special.postalCode, {
    message: 'Invalid postal code',
    excludeEmptyString: true,
  })
  .ensure();

// Schema for create and edit shipping profiles
/* eslint-disable @typescript-eslint/no-explicit-any */
export const shippingProfileFormSchema = (schema?: ObjectSchema<any>) =>
  (schema ? schema : object()).shape({
    name: string().required('Name is required'),
    description: string(),
    countryId: number()
      .positive('Country is required')
      .required('Country is required'),
    minProcessingDays: number()
      .positive('Please select a processing time')
      .required('Please select a processing time'),
    maxProcessingDays: number()
      .positive('Please select a processing time')
      .required('Please select a processing time'),
    areas: array()
      .min(1)
      .of(
        object({
          carrier: string().required('Carrier is required'),
          price: number().moreThan(-1).required('Price is required'),
          everyWhere: boolean(),
          countryIds: array().of(number()),
          minDays: number()
            .when('maxDays', {
              is: (maxDays: number) => maxDays > 0,
              then: (s) =>
                s.max(
                  ref('maxDays'),
                  'Min days cannot be greater than max days',
                ),
            })
            .required('Min days is required')
            .min(1, 'Please provide a number greater than 0')
            .max(365, 'Max days cannot be greater than 365'),

          maxDays: number()
            .required('Max days is required')
            .min(1, 'Please provide a number greater than 0'),
        }),
      )
      .required('At least one country is required'),
  });
