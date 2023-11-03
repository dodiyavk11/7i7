import * as Yup from 'yup';

const AddeventRegistrationschema = Yup.object({
  date: Yup.date().required("Datum..."),
  eventname: Yup.string().required("Das Event..."),
  cost: Yup.number().required('Kosten...'),
  eventdetail: Yup.string().required('Event beschreiben...'),

})

export default AddeventRegistrationschema;