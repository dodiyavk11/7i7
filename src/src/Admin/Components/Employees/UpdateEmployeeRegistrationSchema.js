
import * as Yup from 'yup';


const UpdateEmployeeRegistrationSchema = Yup.object({

    fname: Yup.string().required('Vorname...'),
    lname: Yup.string().required('Nachname...'),
     email: Yup.string().trim().email('Ungültig E-Mail...').required('E-Mail...'),
     password: Yup.string().min(6,'Das Passwort darf maximal 6 Zeichen lang sein').max(20,'Das Passwort darf maximal 20 Zeichen lang sein'),
     repeatpassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwort müss übereinstimmen"),
})

export default UpdateEmployeeRegistrationSchema;