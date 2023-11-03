import axios from 'axios';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
// import loginlogo from '../../Assets/images/logo.png'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { VerificationemailSchema } from './VerificationemailSchema';


const Emailverification = () => {
    const navigate = useNavigate()
    const ForgotPassword = () => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_BASE_URL}/ForgotPasswordLink`,
        })
            .then((res) => {
                toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
            })

            .catch(function (res) {
                console.log(res.message)
                toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" })
            });
    }
    const initialValues = {
        email: "",
    };

    const [isLoading, setIsLoading] = useState(false);
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        validationSchema: VerificationemailSchema,
        initialValues: initialValues,
        onSubmit: data => {
            setIsLoading(true); // Start loading
            axios({
                method: 'POST',
                url: `${process.env.REACT_APP_BASE_URL}/ForgotPasswordLink`,
                data: data
            })

                .then((res) => {
                    ForgotPassword()
                    toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
                })

                .catch(function (res) {
                    console.log(res.message)
                    toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" })
                })
                .finally(() => {
                    setIsLoading(false); // Stop loading, whether success or error
                });

        }
    }
    )
    return (
        <>
            <div className="login " id="root1">
                <div className="login-img">
                    <img
                        src='https://app.7i7.de/static/media/logo.e4d8a2f52f85ba3558fc.png'
                        alt="logo"
                    />
                </div>
                <form name="frm" onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="login-label">
                        E-Mail: <small>*</small>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Deine E-Mail..."
                            className="login-input"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}

                        />
                        <div className="error">
                            {errors.email && touched.email ? <small className='form-error'>{errors.email}</small> : null}
                        </div>
                    </div>

                    <div className="field">

                        <button
                            type="submit"
                            className="mt-3 login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                            ) : (
                                <>
                                <b className="btn-text">
                                    <i className="bi bi-box-arrow-in-right pe-2"></i>
                                    
                                    E-Mail verifizieren</b>
                                </>
                            )}
                        </button>


                    </div>
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
                theme="red"
            />
        </>
    );
}

export default Emailverification

