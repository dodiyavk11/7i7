
import * as Yup from 'yup';


export const ViewworderSchema = Yup.object({
    ordername: Yup.string().required("Titel..."),
    orderpriority: Yup.number().required('PrioritŠt...'),
    orderdetail: Yup.string().required('Briefing...'),
})
