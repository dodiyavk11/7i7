

import * as Yup from 'yup';


export const RegistrationSchema = Yup.object({
  fname: Yup.string().required('Vorname...'),
  lname: Yup.string().required(' Nachname...'),
  email: Yup.string().trim().email('Ungültig E-Mail...').required('E-Mail...'),
  password: Yup.string().min(6,'Das Passwort darf maximal 6 Zeichen lang sein').max(20,'Das Passwort darf maximal 20 Zeichen lang sein').required('Passwort...'),
  company: Yup.string().required("Unternehmen..."),
  street: Yup.string().required('Straße...'),
  postalNum: Yup.string().required('Postleitzahl...'),
  country: Yup.string().required("Land..."),
  // this data not send in backend
  // file: Yup.mixed().required("enter your profile"),
  repeatpassword: Yup.string()
    .required('Passwort...')
    .oneOf([Yup.ref("password"), null], "Passwort müss übereinstimmen"),
    number: Yup.string().required('Nummer...'),
    city: Yup.string().required('Stadt...'),
    // code:Yup.string().required('Code...'),
    // code: Yup.string().required('Code...'),

})

  // data pass on server
