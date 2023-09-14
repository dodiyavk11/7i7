import * as Yup from 'yup';

export const VerificationemailSchema = Yup.object({
    email: Yup.string().trim().email('Ungültig E-Mail...').required('E-Mail...'),
})
