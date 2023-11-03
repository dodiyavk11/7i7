
import * as Yup from 'yup';

const NewCustomerRegistrationSchma = Yup.object({
  fname: Yup.string().required('Vorname...'),
  lname: Yup.string().required('Nachname...'),
   password: Yup.string().min(6,'Das Passwort darf maximal 6 Zeichen lang sein').max(20,'Das Passwort darf maximal 20 Zeichen lang sein').required('Passwort...'),
  company: Yup.string().required("Unternehmen..."),
  country: Yup.string().required("Land..."),
  email: Yup.string().trim().email('Ungültig E-Mail...').required('E-Mail...'),
  street: Yup.string().required('Straße...'),
  postalNum: Yup.string().required('Postleitzahl...'),
  // this data not send in backend
  // file: Yup.mixed().required("enter your profile"),
  repeatpassword: Yup.string()
    .required('Passwort...')
    .oneOf([Yup.ref("password"), null], "Passwort müss übereinstimmen"),
  // code: Yup.number().required('Code...'),
  number: Yup.string().required('Nummer...'),
  city: Yup.string().required('Stadt...'),
})

export default NewCustomerRegistrationSchma;