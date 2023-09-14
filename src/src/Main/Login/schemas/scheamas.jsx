import * as Yup from 'yup';


export const loginSchema = Yup.object({
    email: Yup.string().email().required('E-Mail...'),
    password : Yup.string().min(6).required('Passwort...')
})