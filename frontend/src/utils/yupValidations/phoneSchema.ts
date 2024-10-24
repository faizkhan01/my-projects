import { isPossiblePhoneNumber } from 'react-phone-number-input';
// INFO:  import { isPossiblePhoneNumber } from 'react-phone-number-input/input'; // This might help reduce
// bundle size
import { string } from 'yup';

export const phoneSchema = string()
  .test('isPossiblePhoneNumber', 'Invalid Phone Number', (value) =>
    value ? isPossiblePhoneNumber(value) : true,
  )
  .nullable();
