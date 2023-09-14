
import * as Yup from 'yup';


const NewEmployeeRegistrationSchema = Yup.object({

    fname: Yup.string().required('Vorname...'),
    lname: Yup.string().required('Nachname...'),
    email: Yup.string().trim().email('Ungültig E-Mail...').required('E-Mail...'),
     password: Yup.string().min(6,'Das Passwort darf maximal 6 Zeichen lang sein').max(20,'Das Passwort darf maximal 20 Zeichen lang sein').required('Passwort...'),
    repeatpassword: Yup.string()
    .required('Passwort...')
    .oneOf([Yup.ref("password"), null], "Passwort müss übereinstimmen"),
    permission: Yup.mixed().required('Erläübnis...')
    // profile: Yup.string().required('enter your profile'),
})

export default NewEmployeeRegistrationSchema;