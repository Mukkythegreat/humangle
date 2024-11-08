import * as Yup from 'yup';

export const foiRequestSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    phoneNumber: Yup.string()
        .matches(/^\d+$/, 'Phone number must contain only digits') // Example for digits only
        .min(11, 'Phone number must be at least 11 digits') // Adjust for your country's format
        .required('Phone number is required'),
    stateOfOrigin: Yup.string().required('State of origin is required'),
    lga: Yup.string().required('LGA is required'),
    subject: Yup.string().required('Subject is required'),
    file: Yup.mixed()
        .test('fileSize', 'File size must be less than 2MB', (value) => {
            return value ? value.size <= 2000000 : true;
        })
        .test(
            'fileType',
            'Supported formats: .pdf',
            (value) => {
                return value ? ['application/pdf'].includes(value.type) : true;
            }
        )
});

export const contactUsSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    phoneNumber: Yup.string()
        .matches(/^\d+$/, 'Phone number must contain only digits')
        .min(11, 'Phone number must be at least 11 digits')
        .required('Phone number is required'),
    message: Yup.string().required('Message is required')
});

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
});

export const resetLinkSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
});

export const signUpSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
});

export const resetPassSchema = Yup.object().shape({
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
});

export const resetPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required')
});