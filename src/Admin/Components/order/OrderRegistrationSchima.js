
import * as Yup from 'yup';


const NeworderRegistrationSchema = Yup.object({
    // status:Yup.number().required('enter product'),
    //  employee:Yup.mixed().required('enter employee'),
    // uId:Yup.number().required('enter customer'),
  ordername: Yup.string().required("Titel..."),
  orderpriority: Yup.number().required('PrioritŠt...'),
  // orderfile:Yup.mixed().required('enter file'),
  orderdetail: Yup.string().required('Briefing...'),
})

export default NeworderRegistrationSchema;