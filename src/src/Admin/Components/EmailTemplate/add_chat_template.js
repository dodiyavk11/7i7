import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate} from "react-router-dom";
import "./email.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Editor } from '@tinymce/tinymce-react';
import { useFormik } from "formik";

// import Emailverify from "./Emailverify";

const Add_chat_template = () => {
    const token = localStorage.getItem('token')
    const getRole = localStorage.getItem("role")
    const nevigate = useNavigate();
    const editorRef = useRef(null);
    const [editorContent, setEditorContent] = useState('');

    function handleEditorChange(content, editor) {
        setEditorContent(content);
    }
    const [subject, setSubject] = useState([])
    const [headers, setHeader] = useState()


    function saveContentToDB() {
        // console.log(headers)
        axios({
            method: 'PATCH',
            url: `${process.env.REACT_APP_BASE_URL}/add/text/`,
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

    const [isLoaded, setIsLoaded] = useState(true);
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
    const [newoder, setNewOrder] = useState([])

  


    // on submit
    const initialValues = {
        title: emailtitle
    };

    const [isLoading, setIsLoading] = useState(false);
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: (data) => {
            setIsLoading(true); // Start loading
            // console.log(editorContent);
            axios({
                method: 'PATCH',
                url: `${process.env.REACT_APP_BASE_URL}/add/chat`,
                headers: {
                    'authorization': `Bearer ${token}`
                },
                data: { text: editorContent, ...data }
            })
                .then((res) => {
                    toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
                    if (getRole == 1) {
                        nevigate("/admin/email_templete");
                      } else {
                        nevigate("/employee/email_templete");
                      }
                     
                    // history.push('/email_templete');
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

                <div className="main-body" id="root1">
                    <div className="order-header d-flex div">
                            <IconContext.Provider value={{ className: "shared-class", size: 40 }}>
                                <BsFillEnvelopeFill />
                            </IconContext.Provider>
                            <h3>Add New Prewritten message</h3>
                    </div>

                    <form action="" onSubmit={handleSubmit}>


                        <div className="order-content1 div">
                            <div className="allinputs div1 pt-2">
                                <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Title for chat message :<small>*</small></label><br />
                                <input
                                    type="text"
                                    name="title"
                                    value={values.title}
                                    placeholder="Write title for message ."
                                    className="user-input "
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <div className="error">
                                    {errors.title && touched.title ? <small className='form-error'>{errors.title}</small> : null}</div>

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
export default Add_chat_template;

