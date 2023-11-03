
import * as Yup from 'yup';


const UpdateOrderschema = Yup.object({

  ordername: Yup.string().required("Titel..."),
  orderpriority: Yup.number().required('PrioritŠt...'),
  orderdetail: Yup.string().required('Briefing...'),
})

export default UpdateOrderschema;