import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./email.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Editor } from '@tinymce/tinymce-react';
import { useFormik } from "formik";
import Emailverify from "./Emailverify";

const Edit_email_template = () => {
  const token = localStorage.getItem('token')
  const { id } = useParams();
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState('');

  function handleEditorChange(content, editor) {
    setEditorContent(content);
  }
  const [subject, setSubject] = useState([])
  const [headers, setHeader] = useState()

  function saveContentToDB() {
    console.log(headers)
    axios({
      method: 'PATCH',
      url: `${process.env.REACT_APP_BASE_URL}/send/text/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
      data: { text: editorContent, header: headers }
    })
      .then((res) => {
        toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      }).catch((res) => {
        toast.error(res.response.message)
      })

  }

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // email api
  const [templatedata, setTemplatedata] = useState([])
  const [emailtitle, setEmailTitle] = useState()
  const [emailtype, setEmailType] = useState()
  const [eventaccept, seteventaccept] = useState([])
  const [createevent, setcreateevent] = useState([])
  const [createorder, setcreateorder] = useState([])
  const [orderstatus, setorderstatus] = useState([])
  const [registarion, setregistarion] = useState([])
  const[newoder,setNewOrder] = useState([])

  useEffect(() => {

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/fatch/template/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setIsLoaded(true)
        setSubject(res.data.data.header)
        setEmailTitle(res.data.data.email_title)
        setEmailType(res.data.data.email_type)
        setTemplatedata(res.data.data.email_content)
        seteventaccept(res.data.data.static_var.event_accept)
        setcreateevent(res.data.data.static_var.create_new_event)
        setcreateorder(res.data.data.static_var.chat_message)
        setorderstatus(res.data.data.static_var.order_status)
        setregistarion(res.data.data.static_var.registration)
        setNewOrder(res.data.data.static_var.create_new_order)
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      }).catch((res) => {
        setIsLoaded(true)
        toast.error(res.response.message)

      })
  }, [])


  // on submit
  const initialValues = {

     header:subject

  };

  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema:Emailverify,
    enableReinitialize: true,
    onSubmit: (data) => {
      setIsLoading(true); // Start loading
      axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_BASE_URL}/send/text/${id}`,
        headers: {
          'authorization': `Bearer ${token}`
        },
        data: {text: editorContent, ...data }
      })
        .then((res) => {
          toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
        }).catch((res) => {
          toast.error(res.response.message)
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
        });
    },

  })


  if (error) {
    return <div>Error:  {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
  } else {

    return (
      <>

        <div className="main-body"  id="root1">
          <div className="order-header d-flex div">
            <IconContext.Provider value={{ className: "shared-class", size: 40 }}>
              <BsFillEnvelopeFill />
            </IconContext.Provider>

            <h3>{emailtitle}</h3>
          </div>

          <div className="order-header div">
            <h2>Platzhalter</h2>
            {emailtype === "event_accept" ? (
              eventaccept.map((val) => {
                return <h6>{val}</h6>
              })
            ) : emailtype === "chat_message" ? (
              createorder.map((val) => {
                return <h6>{val}</h6>
              })
            ) : emailtype === "create_new_event" ? (
              createevent.map((val) => {
                return <h6>{val}</h6>
              })
            ) : emailtype === "order_status" ? (
              orderstatus.map((val) => {
                return <h6>{val}</h6>
              })
            ) : emailtype === "registration" ? (
              registarion.map((val) => {
                return <h6>{val}</h6>
              })
            ) : emailtype === "create_new_order" ? (
              newoder.map((val) => {
                return <h6>{val}</h6>
              })
            )
              : (
                <h6>Kein E-Mail-Inhalt verfugbar.</h6>
              )}
          </div>

          <form action="" onSubmit={handleSubmit}>


            <div className="order-content1 div">
              <div className="allinputs div1 pt-2">
                <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Betreff der E-Mail :<small>*</small></label><br />
                <input
                  type="text"
                  name="header"
                  value={values.header}
                  placeholder="Write E-Mail subject."
                  className="user-input "
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              <div className="error">
                {errors.header && touched.header ? <small className='form-error'>{errors.header}</small> : null}</div>
        
              </div>

              <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={templatedata}
                init={{
                  height: 500,
                  plugins: 'image fontsize', // include image and fontsize plugins
                  images_upload_url: 'your-image-upload-url', // specify the URL where images will be uploaded
                  images_upload_credentials: true,
                  menubar: false,
                  toolbar: 'undo redo | formatselect |' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | removeformat | help | fontsize ', // add fontsize and image to the toolbar
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
                onEditorChange={handleEditorChange}
              />
            </div>
            {/* <button type="submit" className="order-btn m-auto template-btn">Safe</button> */}
            <button
                type="submit"
                onClick={handleSubmit}
                className="order-btn m-auto template-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                ) : (
                  <span>
                  <i class="bi bi-save2-fill pe-1"></i>
                  speichern
                  </span>
                )}
              </button>
          </form>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

      </>

    );
  };
}
export default Edit_email_template;
