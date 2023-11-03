import * as Yup from 'yup';

const Emailverify = Yup.object({
  header: Yup.string().required("Das Event..."),
})

export default Emailverify;