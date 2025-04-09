// schemas/memberSchema.ts
import * as Yup from 'yup';

export const memberSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  division: Yup.string()
    .required('Division is required'),
  group: Yup.string()
    .required('Group is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
});