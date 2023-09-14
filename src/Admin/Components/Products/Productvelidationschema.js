
import * as Yup from 'yup';


const Productvelidationschema = Yup.object({

    product: Yup.string().required("please enter Product"),
    price: Yup.number().required('please enter price'),
    description: Yup.string().required('please enter Product description'),

})

export default Productvelidationschema;