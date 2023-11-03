import * as Yup from 'yup';

export const ForgottenRegistrationSchema = Yup.object({

     password: Yup.string().min(6,'Das Passwort darf maximal 6 Zeichen lang sein').max(20,'Das Passwort darf maximal 20 Zeichen lang sein').required('Passwort...'),
    repetpassword: Yup.string()
    .required('Passwort...')
    .oneOf([Yup.ref("password"), null], "Passwort müss übereinstimmen"),
})