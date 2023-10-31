import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./neworder.css";
import { useFormik } from "formik";
import jQuery from "jquery";
import $ from "jquery";
import NeworderRegistrationSchema from "./OrderRegistrationSchima";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment/moment";
import UpdateOrderschema from "./UpdateorderSchema";
import { confirmAlert } from "react-confirm-alert";
import { SlideshowLightbox } from "lightbox.js-react";
import ChatImgPart from "../../../CommonComponents/chat-components/ChatImgPart";
import EmojiPicker from 'emoji-picker-react';
import { BsPlus } from "react-icons/bs";

// import PhotoAlbum from "react-photo-album";



const date = new Date().toLocaleDateString("no-NO");

export default function () {
  const ref1 = useRef();
  const ref2 = useRef();
  const textareaRef = useRef();


  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [editmessage1, seteditMessage1] = useState("");
  const [editheadmessage1, setheadeditMessage1] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [error, setError] = useState('');
  const [editdisabled, setEditDisabled] = useState(false);
  const [editid, seteditID] = useState('');
  const [buttontext, setbuttontext] = useState('Senden');
  const [sendBtn, setsendBtn] = useState(false);
  



  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
 
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
      setMessage1('');
      setEditDisabled(false);
      seteditMessage1('');
      setheadeditMessage1('');
      seteditID('');

    }
  };
  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const [message1, setMessage1] = useState('');

  const handleTextareaChange = (e) => {
    setMessage1(e.target.value);
  };
  const handleEditTextareaChange = (e) => {
    seteditMessage1(e.target.value);
  };
  const handleEditheadChange = (e) => {
    setheadeditMessage1(e.target.value);
  };

  const handleButtonClick = () => {
    // Send an HTTP POST request to your server to save the message in the database
    setIsLoading(true);
    // console.log(message1);
    if (message1.trim() === '') {
      setError('chat cannot be empty!!');
    } else {
      setError(''); // Clear the error message if the textarea is not empty
      axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_BASE_URL}/add/chat`,
        headers: {
          'authorization': `Bearer ${token}`
        },
        data: { text: message1, }
      })
        .then((res) => {
          // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
          // console.log(res);
          fetchChatData();
          // history.push('/email_templete');
          setMessage1('');
          setheadeditMessage1('');
        }).catch((res) => {
          toast.error(res.response.message)
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
        });

    }

  };
  const handleEditClick = (id) => {
    setIsLoading(true);
    axios({
      method: 'PATCH',
      url: `${process.env.REACT_APP_BASE_URL}/send/chat/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
      data: { text: editmessage1,title:editheadmessage1 }
    })
      .then((res) => {
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
        // console.log(res);
        fetchChatData();
        setEditDisabled(false);

      }).catch((res) => {
        toast.error(res.response.message)
      })
      .finally(() => {
        setIsLoading(false); // Stop loading, whether success or error
      });
  };
  const handleChatdeleteClick = (id) => {
    setIsLoading(true);
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BASE_URL}/delete/chat/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
        console.log(res);
        fetchChatData();
        setEditDisabled(false);

      }).catch((res) => {
        toast.error(res.response.message)
      })
      .finally(() => {
        setIsLoading(false); // Stop loading, whether success or error
      });
  };
  const [chatdata, setchatData] = useState([]);
  // console.log(chatdata);
  const fetchChatData = () => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/chat/template`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setIsLoaded(true);
        setchatData(res.data.data);
      })
      .catch((error) => {
        setIsLoaded(true);
        toast.error(error.response.message);
      });
  };
  useEffect(() => {
    fetchChatData(); // Fetch chat data when the component mounts
  }, []);

  const handleDropdownItemClick = (item) => {
    setMessage(item.msg_content);
    setEditDisabled(false);
    seteditMessage1('');
    seteditID('');
    toggleDropdown(); // Close the dropdown after selecting an item
  };
  const handleDropdownEdit = (item) => {
    seteditMessage1(item.msg_content);
    setheadeditMessage1(item.msg_title);
    setEditDisabled(true);
    seteditID(item.id);
  };
  const handleEditcancelClick = (item) => {
    setEditDisabled(false);
  };

  // dropdown
  (function ($) {
    var CheckboxDropdown = function (el) {
      var _this = this;
      this.isOpen = false;
      this.areAllChecked = false;
      this.$el = $(el);
      this.$label = this.$el.find(".dropdown-label");
      this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
      this.$inputs = this.$el.find('[type="checkbox"]');

      this.onCheckBox();

      this.$label.on("click", function (e) {
        e.preventDefault();
        _this.toggleOpen();
      });

      this.$checkAll.on("click", function (e) {
        e.preventDefault();
        _this.onCheckAll();
      });

      this.$inputs.on("change", function (e) {
        _this.onCheckBox();
      });
    };

    CheckboxDropdown.prototype.onCheckBox = function () {
      this.updateStatus();
    };

    CheckboxDropdown.prototype.updateStatus = function () {
      var checked = this.$el.find(":checked");

      this.areAllChecked = false;
      this.$checkAll.html("Alle überprüfen");

      if (checked.length <= 0) {
        this.$label.html("Mitarbeiter zuordnen");
      } else if (checked.length === 1) {
        this.$label.html(checked.parent("label").text());
      } else if (checked.length === this.$inputs.length) {
        this.$label.html("Alle ausgewählt");
        this.areAllChecked = true;
        this.$checkAll.html("Alle deaktivieren");
      } else {
        this.$label.html(checked.length + " Selected");
      }
    };

    CheckboxDropdown.prototype.onCheckAll = function (checkAll) {
      if (!this.areAllChecked || checkAll) {
        this.areAllChecked = true;
        this.$checkAll.html("Alle deaktivieren");
        this.$inputs.prop("checked", true);
      } else {
        this.areAllChecked = false;
        this.$checkAll.html("Alle überprüfen");
        this.$inputs.prop("checked", false);
      }

      this.updateStatus();
    };

    CheckboxDropdown.prototype.toggleOpen = function (forceOpen) {
      var _this = this;

      if (!this.isOpen || forceOpen) {
        this.isOpen = true;
        this.$el.addClass("on");
        $(document).on("click", function (e) {
          if (!$(e.target).closest("[data-control]").length) {
            _this.toggleOpen();
          }
        });
      } else {
        this.isOpen = false;
        this.$el.removeClass("on");
        $(document).off("click");
      }
    };

    var checkboxesDropdowns = document.querySelectorAll(
      '[data-control="checkbox-dropdown"]'
    );
    for (var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
      new CheckboxDropdown(checkboxesDropdowns[i]);
    }
  })(jQuery);
  // dropdown end

  // get  final file

  const [file, setFile] = useState([])
  const GetFile = () => {

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/orderfile/get/${id}`,
      headers: {
        "authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        // setIsLoaded(true);
        setFile(res.data.data)

      })
      .catch((err) => {
        // toast.error(res.message)
        console.log(err);
      });
  }

  useEffect(() => {
    GetFile();
  }, [])

  //  delivery file add
  const AddFile = () => {
    // progress bar
    const formData = new FormData();
    fileValue.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/order/file_add/${id}`,
      headers: {
        "authorization": `Bearer ${token}`,
        "content-type": "multipart/form-data; charset=utf-8", // Add the charset parameter  
      },
      data: { "files[]": filesValues, name: filename },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setImageUploadProgress(progress);
      }
    })
      .then((res) => {
        // setIsLoaded(true);
        toast.success(res.data.message);
        GetFile();
        setFilesValues([]);
      })
      .catch((res) => {
        toast.error(res.data.message);

      }).finally(() => {
        setImageUploadProgress(0); // Reset the progress bar
      });
  }
  const [open, setOpen] = useState(false);

  // delete final file
  const clickToDelete = (id) => {

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deletFinalFile(id)
        },
        {
          label: 'Nein  ',
          //onClick: () => alert('Click No')
        }
      ]
    });
  }
  const deletFinalFile = (val) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/orderfile/finalfile_delete/${val.id}`,
      headers: {
        // "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
        responseType: "blob",
      },
      data: { name: val.file }
    })
      .then((res) => {
        toast.success(res.data.message);
        GetFile()
      })
      .catch((res) => {
        toast.error(res.data.message);
      });
  }


  const nevigate = useNavigate();
  const token = localStorage.getItem("token");
  const [employeedata, setemployeeData] = useState([]);
  const [product, setProduct] = useState([]);

  //  update oreder
  const { id } = useParams();
  const [orderupdate, setUpdateOrder] = useState([]);
  const [pdts, setPdts] = useState([])
  const [empid, setEmpid] = useState([])
  // const [getfiles, setGetFiles] = useState([])
  const [ordrname, setOrdername] = useState()

  const getorder = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/order/get/${id}`,
      data: orderupdate,
      headers: {
        "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
        responseType: "blob",
      },
    })
      .then((res) => {
        setIsLoaded(true);
        setOrdername(res.data.data.ordername)
        setUpdateOrder(res.data.data);
        setPdts(res.data.data.selected_products)
        setEmpid(res.data.data.assign_emp_id)
        setResponseState(res.data.data.orderstatus)
        setGetFiles(res.data.data.files)
      })
      .catch((res) => {
        setIsLoaded(true);
        toast.error(res.message)
      });
  }

  useEffect(() => {
    getorder()
  }, [id]);

  //   delete
  const deletFile = (val) => {

    axios({
      method: "POST",

      url: `${process.env.REACT_APP_BASE_URL}/order/file_delete`,
      data: { name: val },
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        toast.success(res.data.message);
        getorder()
      })
      .catch((res) => {

        toast.error(res.data.message);
      });
  };

  useEffect(() => {

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/employee/get/all`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setemployeeData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  // get message
  const [Usermsg, setUsermsg] = useState([]);
  // console.log(Usermsg);
  const getmsg = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/message/get/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUsermsg(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(res.message)
      });
  };

  useEffect(() => {
    getmsg();
  }, [id]);

  // send message
  const [chatImg, setChatImg] = useState([]);

  const [chatonchange, setchatonchange] = useState([]);
  // const [foundFile, setfoundFile] = useState('');
  // console.log(chatonchange);

  const handleRemoveImg = (file) => {
    // console.log(chatonchange);
    const updatedFiles = chatImg && chatImg.filter((f) => f !== file);
    setChatImg(updatedFiles);
    let chatonchange1 = [];
    // setchatonchange([]);
    // console.log(file);
    // console.log(chatonchange);
    const fileName = file.name;
    const foundFiles = [];
    // const foundFile = '';
    // console.log(fileName);
    chatonchange.forEach((file) => {
      if (file.originalname === fileName) {
        // Perform an action for the file with a matching originalname
        // console.log("Found File:", file.fileName);
        foundFiles.push(file.fileName);
        // Add your custom logic here for the found file
      }
    });
  

    axios({
      method: 'post', 
      url: `${process.env.REACT_APP_BASE_URL}/message/filechangedelete/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
      data: { text: foundFiles }
    })
      .then((res) => {
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
        // console.log(res);
        // fetchChatData();
        // setEditDisabled(false);
        // console.log(chatonchange);
          // Remove the found files from chatonchange
        setchatonchange(chatonchange.filter((file) => file.originalname !== fileName));

    
        // chatonchange1 = [];
      }).catch((res) => {
        // toast.error(res.response.message)
      })
      .finally(() => {
        // setIsLoading(false); // Stop loading, whether success or error
      });
    // setfoundFile('');
    // console.log(file);
  };
  const handleImage = (event, file) => {
    const reader = new FileReader();
    // console.log(chatImg);
   
    reader.onloadend = () => {
      file.preview = reader.result;
      setGetFiles([...getFiles]);
    };
    reader.readAsDataURL(file);

  };
  const onchangeinput = (files) => {
    // You can perform any operations you want with the selected files here.
    // For example, you can update the state to store the selected files.
    // console.log(files);
    // setSelectedFiles(files);
    setchatonchange([]);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/message/filechange/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
      data: {
        
        // file_detail: imgNames,
        "files": files,

      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setImageUploadProgress(progress);
      }
   
    }).then((res) => {
      // console.log(res.data.uploadedFileNames);
      setchatonchange(res.data.uploadedFileNames);

    }).catch((err) => {
      
    }).finally(() => {


     
    })
    // You can also perform additional actions, such as uploading the files to a server.
    // Example: uploadFilesToServer(files);
  };

  const sendText = () => {
    // progress bar
    scrollToBottom();
    setbuttontext('Senden warten...');
    setsendBtn(true);
    const formData = new FormData();
    fileValue.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const imgNames = chatImg.map((val) => val.name)
    // console.log(chatonchange);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/message/send/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
      data: {
        message: message,
        file_detail: imgNames,
        "files": chatImg,
        "image": chatonchange,

      },
      // onUploadProgress: (progressEvent) => {
      //   const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //   setImageUploadProgress(progress);
      // }

    }).then((res) => {
      toast.success(res.data.message)
      setTimeout(() => {
        scrollToBottom();
      }, 1000);
      getmsg()
      // console.log(res);
      setMessage("")
      setChatImg([])
      fileInputRef.current.value = '';
      setchatonchange([]);
      setsendBtn(false);
      setbuttontext('Senden');
    }).catch((err) => {
      toast.error(err.response.data.message)
    }).finally(() => {


      setImageUploadProgress(0); // Reset the progress bar
    })
  }

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
     chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
     
    }

  }


  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
    // scrollToBottom();
  }, [])

  useEffect(() => {
    scrollToBottom();
    return () => scrollToBottom();
  }, [chatBoxRef.current]);

  // change order status
  const click = (e) => {

    confirmAlert({
      title: 'Confirm to to change status',
      message: 'Möchtest Du den Status ändern?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => ChangeOrderStatus(e)
        },
        {
          label: 'Nein',
          //onClick: () => alert('Click No')
        }
      ]
    });
  }
  const ChangeOrderStatus = (e) => {

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/order/updateorder/orderstatus/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: { orderstatus: e.target.value, ordername: ordrname }
    }).then((res) => {
      toast.success(res.data.message);
    }).catch((res) => {

      toast.error(res.response.data.message);
    })

  }


  const initialValues = {
    orderid: orderupdate.id,
    ordername: orderupdate.ordername,
    orderpriority: orderupdate.orderpriority,
    files: orderupdate.files,
    orderdetail: orderupdate.orderdetail,
    uId: orderupdate.uId,
    user_name: orderupdate.user_name,
    orderstatus: orderupdate.orderstatus
  };

  const selectOption = (e) => {
    handleChange(e)
    click(e)
  }

  const [responseState, setResponseState] = useState("");
  const [editdata, setEditdata] = useState([]);
  const getRole = localStorage.getItem("role")
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: UpdateOrderschema,
    enableReinitialize: true,
    onSubmit: (value) => {
      setIsLoading(true); // Start loading

      // progress bar
      const formData = new FormData();
      fileValue.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      axios({
        method: "PATCH",
        url: `${process.env.REACT_APP_BASE_URL}/order/update/${id}`,
        data: { ...value, products: pdts, employee: empid, "files[]": fileValue, name: filename },
        headers: {
          "content-type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setImageUploadProgress(progress);
        },


      })
        .then((res) => {
          setEditdata(res.data);
          setTimeout(() => {
            toast.success(res.data.message);
          }, 1000);
          if (getRole == 1) {
            navigate("/admin/order");
          } else {
            navigate("/employee/order");
          }
        })
        .catch((res) => {
          toast.error(res.response.data.message);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
          setImageUploadProgress(0); // Reset the progress bar
        });
    },
  });




  // const downloadFile = () => {
  //   if (orderupdate.orderfile) {
  //     toast.success("image download");
  //   }
  // };

  // function refreshPage() {
  //   window.location.reload(true);
  // }

  // final file

  const [filesValues, setFilesValues] = useState([]);
  const [filename, SetFilename] = useState([])
  // const [getFiles, setGetFiles] = useState([]);

  const handleRemoveFiles = (file) => {
    const updatedFiles = filesValues && filesValues.filter((f) => f !== file);
    setFilesValues(updatedFiles);
  };



  // file add
  const [fileValue, setFileValue] = useState([]);
  const [getFiles, setGetFiles] = useState([]);
  // console.log(fileValue);
  const handleRemoveFile = (file) => {
    const updatedFiles = fileValue.filter((f) => f !== file);
    setFileValue(updatedFiles);
  };

  const handleImageChange = (event, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      file.preview = reader.result;
      setGetFiles([...getFiles]);
    };
    
    console.log(file);
    reader.readAsDataURL(file);
  };


  //!  code of cloud links in final files section
  const [cloudLink, setCloudLink] = useState({ length: 1, links: [] });

  function AddLink() {
    setCloudLink(oldVal => {
      return { ...oldVal, length: oldVal.length + 1 }
    })
  }

  const CreateNewObj = Object.create({ link_name: null, link: null })


  function CloudLinkHandleChange(e, i, link) {
    const OldLinks = [...cloudLink.links];

    setCloudLink(oldVal => {
      OldLinks[i] ? OldLinks[i][link] = e.target.value : OldLinks[i] = CreateNewObj
      return { ...oldVal, links: OldLinks }
    })
  }
  const [editlinkvalue, seteditlinkvalue] = useState('');
  function CloudLinkChange(e) {
    // console.log(e.target.value);
    seteditlinkvalue(e.target.value);
  }


  function AddCloudLink() {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/orderfile/cloudLinks_add/${id}`,
      headers: {
        "authorization": `Bearer ${token}`// Add the charset parameter  
      },
      data: { cloud_links: cloudLink.links }
    })
      .then((res) => {

        GetFile();
        toast.success(res.data.message);


        setCloudLink({ length: 1, links: [] })
      })
      .catch((err) => {
        // console.log(err, "reddddddddddddddddddddddddddddddddddd")
        toast.error(err.response.data.message);
      })
  }
  const [inputshow, setinputShow] = useState(false);
  const [linkvalue, setlinkValue] = useState([]);
  function EditCloudLink(val) {
    setlinkValue([]);
    // console.log(val);
    setinputShow(true);
    setlinkValue(val);

  }
  // console.log(linkvalue);
  // console.log(inputshow);
  function canceleditLink(val) {
    // console.log(val);
    setinputShow(false);
    setlinkValue([]);

  }
  function UpdateCloudLink(val) {
    // console.log(val);
    // console.log(editlinkvalue);
    setinputShow(false);
    setlinkValue([]);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/orderfile/cloudLinks_edit/${val.id}`,
      headers: {
        "authorization": `Bearer ${token}`// Add the charset parameter  
      },
      data: { cloud_links: editlinkvalue }
    })
      .then((res) => {

        GetFile();
        toast.success(res.data.message);


        setCloudLink({ length: 1, links: [] })
      })
      .catch((err) => {
        // console.log(err, "reddddddddddddddddddddddddddddddddddd")
        toast.error(err.response.data.message);
      })

  }
  function DeleteCloudLink(val) {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deleteCLinks(val.id)
        },
        {
          label: 'Nein',
          //onClick: () => alert('Click No')
        }
      ]
    });
  }

  function deleteCLinks(id) {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/orderfile/finalfile_delete/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
      }
    })
      .then((res) => {
        toast.success(res.data.message);
        GetFile()
      })
      .catch((res) => {
        toast.error(res.data.message);
      });
  }

  // remove chat message
  function confirmDeleteMessage(val) {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deleteMessage(val),
        },
        {
          label: 'Nein',
        }
      ]
    });
  }

  const deleteMessage = (val) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/message/delete/${val.id}`,
      data: { ...val },
      headers: {
        'authorization': `Bearer ${token}`
      },
    }).then((res) => {
      getmsg()
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
    }).catch((res) => {
      toast.error(res.response.data.message)
    })
  }

  // emoji part
  const [showEmoji, setShowEmoji] = useState(false);
  // const emojiWrapperRef = useRef(null);
  // useEffect(() => {
  //   // Add a click event listener to the document
  //   document.addEventListener('click', handleClickOutside1, { passive: true });

  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside1, { passive: true });
  //   };
  // }, []);
  // const handleClickOutside1 = (event) => {
  //   // Check if the click event occurred outside the emoji wrapper
  //   if (emojiWrapperRef.current && !emojiWrapperRef.current.contains(event.target)) {
  //     setShowEmoji(false);
  //   }
  // };



  const handleInsertEmoji = (emoji) => {
    const textarea = document.getElementById('messageInput');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    // console.log(start);
    // console.log(end);

    const updatedMessage = message.substring(0, start) + emoji + message.substring(end);

    setMessage(updatedMessage);
    // Place the cursor after the inserted text
    // textarea.selectionStart = start + emoji.length;
    // textarea.selectionEnd = start + emoji.length;
    // textarea.focus();
  };



  const [isLoaded, setIsLoaded] = useState(false);
  if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
  } else {


    return (
      <>
        <div className="main-body" id="root1">
          <div className="order-header d-flex div ">
            <i className="bi bi-vector-pen user-i header-i fs-2"></i>
            {/* <h3>{values.ordername}</h3> */}
            <h3 className=" me-4 ">{values.orderid}</h3>
            <h3 className="me-2 overflow-auto">{values.ordername}</h3>
           
          </div>

          <form onSubmit={handleSubmit}>
            <div className="navigation-links d-flex  row">
              <div className="overview-page  col-12 col-md-3 col-xxl-2">
                <i className="bi bi-chevron-left pe-2"></i>

                {/* <button
                  className="nav-link-first"
                  onClick={() => refreshPage()}
                  style={{ background: "none" }}
                >
                  zürŸck zür †bersicht
                </button> */}
                {/* {if(getRole == 1){
                  navigate("/admin/order");
                  }else{
                    navigate("/employee/order");
                  }} */}

                {getRole == 1 ? <Link to="/admin/order" className="nav-link-first">zurück zur Übersicht</Link> : <Link to="/employee/order" className="nav-link-first">zurück zur Übersicht</Link>}

              </div>
              <div className="btn-customer ms-3 col-12 col-md-4 col-xxl-2">
                <div className="users-input">{values.user_name}</div>
              </div>
              <div className="btn-employee col-12 col-md-4 col-xxl-2">
                <div
                  className="dropdown"
                  data-control="checkbox-dropdown"
                >
                  <label className="dropdown-label text-dark form-select user-input user-select">
                    wahlen
                  </label>

                  <div className="dropdown-list">
                    {employeedata.length > 0 &&
                      employeedata.map((val, index) => {
                        return (
                          <label
                            className="product-option"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          >
                            <input
                              type="checkbox"
                              checked={
                                empid &&
                                empid.includes(val.id)
                              }
                              onChange={() => {
                                const selectedProducts =
                                  empid.slice();
                                const index = selectedProducts.indexOf(val.id);
                                if (index > -1) {
                                  selectedProducts.splice(index, 1);
                                } else {
                                  selectedProducts.push(val.id);
                                }
                                setEmpid(selectedProducts)
                              }}
                              className="dropdown-group"
                              name="products"
                              value={val.id}
                              key={index.toString()}
                              onBlur={handleBlur}
                            />
                            {val.fname + " " + val.lname}
                          </label>
                        );
                      })}
                  </div>
                </div>
              </div>

              <select
                type="text"
                name="orderstatus"
                value={values.orderstatus}
                placeholder="ZUStand auswählen"
                className="nav-select col-12 col-md-2"
                onChange={(e) => selectOption(e)}
                onBlur={handleBlur}
              >

                <option className="user-option" value="" disabled>
                  Status ändern
                </option>
                <option
                  className="user-option"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value='1'
                >
                  Neuer Auftrag
                </option>
                <option
                  className="user-option"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value='2'
                >
                  Wird bearbeitet
                </option>
                <option
                  className="user-option"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value='3'
                >
                  Abgeschlossen
                </option>
              </select>
            </div>

            <div className="div">
              <div className="description pb-3" >
                {/* <div className="order-field" > */}
                <i className="bi bi-person-lines-fill user-i user-i"></i>

                <label className="user-label">
                  Titel: <small>*</small>
                </label>
                <input
                  type="text"
                  id="ordername"
                  name="ordername"
                  value={values.ordername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Beispiel-Aufträg, der hoch priorisiert wurde."
                  className="user-input"
                />
                <div className="error">
                  {errors.ordername && touched.ordername ? (
                    <small className="form-error">{errors.ordername}</small>
                  ) : null}
                </div>

                <div className="row">

                  <div className="col-md-12">
                    <div className="order-field">
                      <i className="bi bi-exclamation-triangle user-i"></i>

                      <label className="user-label">
                        Priorität: <small>*</small>
                      </label>
                      <select
                        className="Priority user-input form-select user-select"
                        name="orderpriority"
                        id="orderpriority"
                        value={values.orderpriority}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >

                        <option className="user-option" value="" disabled>
                          Priorität auswählen
                        </option>
                        <option
                          className="user-option"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value="1"
                        >
                          Hoch
                        </option>
                        <option
                          className="user-option"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value="0"
                        >
                          Standard
                        </option>
                      </select>
                      <div className="error">
                        {errors.orderpriority && touched.orderpriority ? (
                          <small className="form-error">
                            {errors.orderpriority}
                          </small>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                {errors.products && touched.products ? (
                  <small className="form-error">{errors.products}</small>
                ) : null}


                <div className="order-field">
                  <i className="bi bi-file-earmark-arrow-up user-i"></i>
                  <label className="user-label">
                    Dateien: <small>*</small>
                  </label>
                  <div className="file-area file-area-border">
                    <input
                      type="file"
                      id="files"
                      name="files[]"
                      multiple="multiple"
                      className="user-input"
                      onChange={(event) => {
                        const files = Array.from(event.target.files);
                        files.forEach((file) => {
                          handleImageChange(event, file);
                        });
                        setFileValue(files);
                        const fileNames = Array.from(event.target.files).map(file => { return file.name });
                        SetFilename(fileNames); // Set the original file names separated by commas
                      }}
                    />
                    <div className="user-input profile-input">
                      <div className="success">
                        <i className="bi bi-image"></i>    Dateien hochladen
                      </div>
                    </div>
                  </div>
                  <div className="error"></div>
                </div>
                <div className="img-previews">

                  {fileValue.map((file, index) => (
                    <div className="file-item" key={index}>
                      {file.type.startsWith('image/') ?

                        <img src={file.preview} alt="Preview" style={{ height: "100px", width: "100px" }} title={file.name} />
                        :
                        <>
                          <div className="d-flex flex-column" >
                            <i class="bi bi-file-earmark-pdf-fill" title={file.name} ></i>

                          </div>
                        </>
                      }
                      <div className="cancle_icon" onClick={() => handleRemoveFile(file)}>
                        <i class="bi bi-x-circle-fill red_icon"></i>
                      </div>
                    </div>
                  ))}
                </div>

                {
                  fileValue.length > 0 ? <div className="ps-2 "> <progress className="custom_progress" style={{ backgroundColor: '#C0DE60' }} value={imageUploadProgress} max="100" />
                    <span className="ps-2">{`${imageUploadProgress}%`}</span></div> : ""
                }

                {/* <div className="progressBar">
              <div
                className="progressBarFill"
                style={{ width: `${imageUploadProgress}%` }}
              ></div>
            </div> */}

                {getFiles &&
                  getFiles.map((val) => (

                    <div className="file-btn">
                      <button className="downloadbtn" type="button">
                        <i className="bi bi-download icon user-i"></i>
                        <a
                          download={val.orignal_name}
                          href={`${process.env.REACT_APP_IMG_URL}/assets/neworder/${val.files}`}
                          className="btn-text"
                        >
                          Download
                        </a>
                      </button>

                      <button
                        className="ms-2 deletebtn p-2"
                        id={id}
                        onClick={() => deletFile(val.files)}
                        type="button"
                      >
                        <i className="bi bi-trash icon user-i"></i>
                        <span className="btn-text"> löschen </span>
                      </button>
                      <div className="d-flex align-items-center"><b className="ms-5">{val === null ? '' : `${val.orignal_name}` && `${val.orignal_name}`} </b></div>

                    </div>

                  ))}


                <div className="order-field order-field1">
                  <i className="bi bi-person-vcard user-i"></i>

                  <label className="user-label">
                    Briefing: <small>*</small>
                  </label>

                  <textarea
                    className="user-input user-textarea"
                    placeholder="Briefing zu dem Auftrag..."
                    name="orderdetail"
                    id="orderdetail"
                    value={values.orderdetail}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  ></textarea>
                  <div className="error">
                    {errors.orderdetail && touched.orderdetail ? (
                      <small className="form-error">{errors.orderdetail}</small>
                    ) : null}
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="login-btn send-btn w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                  ) : (
                    <span>
                      <i class="bi bi-save2-fill ps-2 pe-2 icon"></i>
                      Speichern
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* chat */}
          <div className="div">
            <div className="description">
              <h1 className="">Chat</h1>
              {/* main chat part */}
              <div className="main-chat custom-scrollbar" ref={chatBoxRef}  >
                {Usermsg.length > 0
                  ? Usermsg.map((val, index) => {

                    return (
                      <div className={val.role === 0 ? ' row chat-box user' : ' row chat-box admin'} key={val.id} >
                        {val.role === 0 ? (
                          <React.Fragment>
                            {/* profile img part */}
                            <div className="col-lg-1 view-order-img">
                              {val.userImg ? <img className="msg-profile" src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/` + `${val.userImg}`} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}
                            </div>
                            {/* message part */}
                            <div className=" chat-msg col-7 col-sm-7 col-md-7 col-lg-7">
                              <div className="chat-box-one u1 pt-0">
                                <p className="chat-date d-flex justify-content-between">
                                  <div> <span style={{ color: '#ffd279' }}>{val.name} </span><span className="ps-2">{moment(val.createdAt).format("DD.MM.YYYY")}</span> </div>
                                  {
                                    getRole==1 ? ( <i className="bi bi-trash icon user-i fs-6" onClick={() => confirmDeleteMessage(val)} style={{ cursor: "pointer" }}></i>) :""
                                   
                                  }
                                  
                                </p>
                                <p style={{ whiteSpace: "break-spaces", wordBreak: 'break-word' }}>
                                  {(val.message && val.files == '') && (val.message && val.message != null && val.message.toString()) ||

                                    (val.files && val.message == null) && <ChatImgPart val={val} /> ||

                                    (val.message && val.files) && ((val.message && val.message != null &&

                                      <span>
                                        <ChatImgPart val={val} />
                                        {/* <App val={val} /> */}
                                        {val.message.toString()}
                                      </span>

                                    ))
                                  }
                                </p>
                                <p className="chat_time"><span className="ps-2">{moment(val.createdAt).format("HH:mm")}</span></p>
                              </div>
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <div className="chat-msg col-7 col-sm-7 col-md-7 col-lg-7">

                              <div className="chat-box-two u2 pt-0">
                                <p className="chat-date d-flex justify-content-between">
                                  <div>  {val.role === 2 ? (
                                    <span style={{ color: '#53bdeb' }}>{val.name}</span>
                                  ) : (
                                    <span style={{ color: '#C0DE60' }}>{val.name}</span>
                                  )}<span className="ps-2">{moment(val.createdAt).format("DD.MM.YYYY")}</span> </div>
                                  <i className="bi bi-trash icon user-i fs-6" onClick={() => confirmDeleteMessage(val)} style={{ cursor: "pointer" }}></i>
                                </p>
                                <p style={{ whiteSpace: "break-spaces", wordBreak: 'break-word' }}>
                                   {/* {val.message.toString()} */}
                                  {
                                    (val.message && val.files == '') && (val.message && val.message != null && val.message.toString()) ||

                                    (val.files && val.message == null) && <ChatImgPart val={val} /> ||

                                    (val.message && val.files) && ((val.message && val.message != null &&

                                        <span>
                                          <ChatImgPart val={val} />
                                        {val.message.toString()}
                                      </span>
                                    ))
                                  }
                                </p>
                                <p className="chat_time"><span className="ps-2">{moment(val.createdAt).format("HH:mm")}</span></p>
                              </div>
                            </div>
                            <div className="col-lg-1 view-order-img">
                              {val.userImg ? <img className="msg-profile" src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/` + `${val.userImg}`} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}

                            </div>
                          </React.Fragment>
                        )}
                        {/* Scroll to Bottom button */}



                      </div>
                    );
                  })
                  : null}
              </div>

              {/* image preview part */}
              <div className="img-previews pt-3">
                {chatImg.map((file, index) => (
                  <div className="file-item" key={index}>
                    {file.type.startsWith('image/') ? (<img src={file.preview} alt="Preview" style={{ height: "100px", width: "100px" }} title={file.name} />) : file.type.startsWith('video/') ? (
                      <>
                      <div className="d-flex flex-column" >
                        <i class="bi bi-file-earmark-play-fill"  title={file.name} ></i>

                      </div>
                    </>
                    ) : file.type.endsWith('/zip') ? ( <>
                      <div className="d-flex flex-column" >
                        <i class="bi bi-file-earmark-zip-fill" title={file.name} ></i>

                      </div>
                    </>): (
                      <>
                      <div className="d-flex flex-column" >
                        <i class="bi bi-file-earmark-pdf-fill" title={file.name} ></i>

                      </div>
                    </>
                    )
                      
                    }
                    <div className="cancle_icon" onClick={() => handleRemoveImg(file)}>
                      <i class="bi bi-x-circle-fill red_icon"></i>
                    </div>
                  </div>
                ))}
                {/* progress bar part */}
             

              </div>
              {
                chatImg.length > 0 && <div className="ps-2" style={{ width: `${100 * chatImg.length}px` }}>
                  <progress value={imageUploadProgress} max="100" />
                  <span className="ps-2">{`${imageUploadProgress}%`}</span>
                </div>
              }
              
              {/* chat input fields part */}
              <div className="row pt-2 pb-2 position-relative">

                {/* upload file */}
                <div className="col-lg-1 emoji_file" >

                  <div className="order-field1 d-flex ">
                    {/* emoji */}
                    {
                      showEmoji &&
                      <button className="col-lg-1 me-2" style={{ all: "unset", cursor: "pointer" }} onClick={() => setShowEmoji(oldVal => !oldVal)}>
                        <i className="bi bi-x-lg fs-5"></i>
                      </button>
                    }
                    <button className="col-lg-1" style={{ all: "unset", cursor: "pointer" }} onClick={() => setShowEmoji(oldVal => !oldVal)}>
                      <i className="bi bi-emoji-smile fs-5"></i>
                    </button>
                    {
                      showEmoji && <div class="emoji-wrapper">

                        <EmojiPicker onEmojiClick={(emojiData, event) => {
                          handleInsertEmoji(emojiData.emoji)
                        }}

                          theme="dark"
                          emojiStyle="google"
                        />
                      </div>
                    }
                    <div className="file-area fileupload">
                      <input
                        type="file"
                        id="orderfile"
                        name="files"
                        className="user-input"
                        style={{ background: 'transparent', cursor: 'pointer' }}
                        ref={fileInputRef}
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          onchangeinput(files);
                          files.forEach((file) => {
                            handleImage(event, file);
                          });
                          setChatImg(files);
                        }}
                        multiple
                      />


                      <div className="user-input profile-input  " style={{ background: 'transparent', cursor: 'pointer' }}>
                        <div className="success ">
                          <i className="bi bi-paperclip h4 mb-0" style={{ verticalAlign: '-webkit-baseline-middle', cursor: 'pointer' }}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* text part */}
                <div className="col-lg-9  ">


                  <div class="input-group">
                    <textarea
                      type="text"
                      placeholder="Deine Nachricht an den Designer..."
                      className="form-control user-input"
                      value={message}
                      style={{ minHeight: '42px' }}
                      name="message"
                      onChange={(e) => { setMessage(e.target.value) }}
                      required

                      id="messageInput"
                      ref={textareaRef}
                    ></textarea>
                    <div className="input-group-append " ref={dropdownRef}>
                      <button type="button" className="btn chat-btn border-0 btn-outline-secondary dropdown-toggle dropdown-toggle-split rounded-right" onClick={toggleDropdown} style={{ height: '42px' }} aria-haspopup="true" aria-expanded={isDropdownOpen}>
                        <span className="sr-only">Toggle Dropdown</span>
                      </button>
                      {isDropdownOpen && (

                        <div className="dropdown-menu  chat-drop d-block  p-0" >
                          <div className="input-group mb-3">
                            <textarea
                              type="text"
                              placeholder="Type something...."
                              className="form-control user-input"
                              name="message"
                              required
                              id="messageInput"
                              value={message1}
                              style={{ minHeight: '42px' }}
                              onChange={handleTextareaChange}

                            ></textarea>
                            <div className="input-group-append">
                              <button className="btn  chat-add-button" style={{ height: '42px' }} onClick={handleButtonClick}><BsPlus style={{ fontSize: '15px' }} /></button>

                            </div>

                          </div>
                          {error && <p className="error-message" style={{ color: 'red', fontSize: '12px', margin: '-1rem,0px' }}>{error}</p>}

                          {isLoaded ? (
                            <div className="chat-drop custom-scrollbar">
                              {chatdata.map((item) => (

                                <span className="dropdown-item chat-drop" key={item.id} >
                                  <div className="input-group justify-content-between ">
                                    {editdisabled && editid == item.id ? (
                                      <div>
                                      <input type="text" className="form-control user-input mb-2"  name="editheadmessage" onChange={handleEditheadChange} defaultValue={editheadmessage1} placeholder="Message Heading" />
                                      <textarea
                                        type="text"
                                        placeholder="Type something...."
                                        className="form-control user-input edit_textarea"
                                        name="editmessage"
                                        required
                                        id="messageInput"
                                        defaultValue={editmessage1}

                                        onChange={handleEditTextareaChange}

                                      ></textarea>
                                      </div>


                                    ) : (
                                        <span style={{ cursor: 'pointer' }} onClick={() => handleDropdownItemClick(item)} > { item.msg_title != null ? item.msg_title.length > 10
                                          ? item.msg_title.slice(0, 10) + '...'
                                          : item.msg_title: "No heading"}</span>
                                    )}

                                    <div className="input-group-append"  style={getRole == 1 ? { display: "block" } : {display: "none" }}>
                                      {editdisabled && editid == item.id ? (
                                        <div className="edit_icons">
                                          <i class="bi bi-check-lg mx-1" onClick={() => handleEditClick(item.id)} style={{ cursor: 'pointer', color: '#C0DE60' }}></i>
                                          <i class="bi bi-x-lg user-i fs-6" onClick={() => handleEditcancelClick(item.id)} style={{ cursor: 'pointer', color: '#DE6060' }}></i>
                                        </div>
                                      ) : (

                                        <div className="old_icon">
                                          <i className="fa-regular fa-pen-to-square mx-1" onClick={() => handleDropdownEdit(item)} style={{ cursor: 'pointer' }}></i>

                                          <i class="fa-solid fa-trash mx-1" onClick={() => handleChatdeleteClick(item.id)} style={{ cursor: 'pointer' }}></i>
                                        </div>
                                      )}
                                    </div>

                                  </div>


                                  {/* <textarea value={item.msg_content}></textarea> */}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p>Loading...</p>
                          )}
                          {/* <a className="dropdown-item" href="#">
                            Action
                          </a>
                          <a className="dropdown-item" href="#">
                            Another action
                          </a>
                          <a className="dropdown-item" href="#">
                            Something else here
                          </a> */}
                        </div>
                      )}
                    </div>

                  </div>

                </div>






                {/* send message */}
                <div className="col-lg-2 ">
                  <button
                    type="button"
                    className="chat-btn justify-content-center d-flex align-items-center px-2"
                    onClick={sendText}
                    disabled={sendBtn==true?true:false}
                    style={{ width: '100%' }}
                  >
                    <i class="bi bi-send-fill"></i>
                    <b className="btn-text">{buttontext}</b>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* cloud files */}
          <div className="div">
            <div className="description">
              <div className="row">
                <div className="col">
                  <h3 className="">Link zu den finalen Dateien</h3>

                  {/* show cloud links */}
                  {file && file.map((val) => {
                    if (val.isLink) {
                      return (
                        <div className="file-btn row " key={val.id}>
                          <div className={inputshow && linkvalue.id == val.id ? 'd-none' : 'd-block d-lg-flex'} style={{ width: '100%' }}>
                            <div className="col-12 col-md-12 col-lg-9">
                              <button className="downloadbtn cloud-link-download-btn" type="button" style={{ height: '100%', maxWidth: '' }}>
                                <i className="bi bi-download icon user-i"></i>
                                <a
                                  target="_blank"
                                  href={val.link}
                                  className="btn-text"
                                >
                                  {val.link}
                                </a>
                              </button>
                            </div>
                            <div className="col-12 col-md-12 col-lg-3">

                              {getRole == 2 | getRole == 1 && (
                                <div className="d-flex" style={{ height: '100%' }}>
                                  <button
                                    className="ms-lg-2 p-1 p-lg-2 editbtn me-2 me-sm-2"
                                    id={id}
                                    onClick={() => EditCloudLink(val)}
                                    type="button" style={{ width: '100%' }}
                                  >
                                    <i className="fa-regular fa-pen-to-square mx-1"></i>
                                    <span className="btn-text"> bearbeiten </span>
                                  </button>
                                  <button
                                    className="ms-lg-2 p-1 p-lg-2 deletebtn"
                                    id={id}
                                    onClick={() => DeleteCloudLink(val)}
                                    type="button" style={{ width: '100%' }}
                                  >
                                    <i className="bi bi-trash icon user-i"></i>
                                    <span className="btn-text"> löschen </span>
                                  </button>
                                </div>
                              )}
                            </div>

                          </div>
                          <div className={inputshow && linkvalue.id == val.id ? 'd-block d-lg-flex ' : 'd-none'}>
                            <div className="col-12 col-md-8 col-lg-9">
                              <input type="text" placeholder="Link"
                                className=" border-2 border-gray px-2 my-1 user-input"
                                defaultValue={linkvalue.link}
                                style={{ width: "100%" }}
                                onChange={(e) => CloudLinkChange(e)}
                                ref={ref1}
                              />
                            </div>
                            <div className="col-12 col-lg-3">

                              <div className="d-flex" style={{ height: '100%' }}>
                                <button
                                  className="ms-2 p-2 editbtn"
                                  id={linkvalue.id}
                                  onClick={() => UpdateCloudLink(linkvalue)}
                                  type="button" style={{ width: '100%' }}
                                >
                                  <i className="fa-regular fa-pen-to-square mx-1"></i>
                                  <span className="btn-text"> speichern </span>
                                </button>
                                <button
                                  className="ms-2 p-2 deletebtn"
                                  id={linkvalue.id}
                                  onClick={() => canceleditLink(linkvalue)}
                                  type="button" style={{ width: '100%' }}
                                >
                                  <i className="bi bi-trash icon user-i"></i>
                                  <span className="btn-text"> Stornieren </span>
                                </button>
                              </div>

                            </div>


                          </div>


                        </div>
                      );
                    }
                  })}


                  {/* add cloud links */}
                  <div className="mt-1">
                    {[...Array(cloudLink.length)].map((val, i) => {
                      return (<div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-9 pe-1">
                          <input key={i + 1} type="text" placeholder="Link"
                            className="  border-2 border-gray px-2 form-control my-1 user-input"
                            value={cloudLink.links[i]?.link || ''}
                            onChange={(e) => CloudLinkHandleChange(e, i, "link")}

                            ref={ref1}
                          />
                        </div>
                        {/* <input key={-i - 1} type="text" placeholder="Link Name"
                          className=" border-2 border-gray px-2 my-1 user-input"
                          value={cloudLink.links[i]?.link_name || ''}
                          onChange={(e) => CloudLinkHandleChange(e, i, "link_name")}
                          style={{ width: "28%" }}
                          ref={ref2}
                        /> */}
                        <div className=" col-12 col-lg-3 ps-0">
                          <button type="submit" className=" justify-content-center d-flex login-btn mt-1 ms-1" onClick={() => AddCloudLink()} style={{ width: '-webkit-fill-available' }}>
                            <i className="bi bi-box-arrow-in-right icon" style={{ margin: 'auto 0px' }}></i>
                            <b className="btn-text" style={{ margin: 'auto 0px' }}> Dateien hochladen</b>
                          </button>
                        </div>

                      </div>)
                    })}

                  </div>

                  {/* <button className="mt-2" style={{ all: "unset", cursor: "pointer" }} onClick={() => AddLink()} >
                    <i class="bi bi-plus-circle fs-6 mx-2"></i>
                    <span> Add Link</span>
                  </button> */}

                </div>
              </div>
            </div>
          </div>

          {/* final files */}
          <div className="div">
            <div className="description">
              <div className="row">
                {/* local files */}
                <div class="col-12">
                  <h3 className="">Dateien zum Download</h3>
                  {file && file.map((val) => {

                    return !val.isLink && <div className="file-btn h-auto">
                      <button className="downloadbtn p-2" style={{ height: '100%' }} type="button">
                        <i className="bi bi-download icon user-i"></i>
                        <a
                          download={val.orignal_name}
                          href={
                            `${process.env.REACT_APP_IMG_URL}/assets/neworder/` +
                            `${val.file}`
                          }
                          className="btn-text"
                        >
                          Download
                        </a>
                      </button>

                      <button className="ms-2 deletebtn p-2" id={id}
                        onClick={() => clickToDelete(val)}
                        type="button">
                        <i className="bi bi-trash icon user-i"></i>
                        <span className="btn-text"> löschen </span>
                      </button>
                      <div className="align-items-center d-flex"><b className="ms-5">{val === null ? "" : `${val}` && `${val.orignal_name}`}</b></div>


                    </div>
                  })}

                  <div className="img-previews">
                    {filesValues.map((file, index) => (
                      <div className="file-item" key={index}>
                        {file.type.startsWith('image/') ?
                          <img src={URL.createObjectURL(file)} alt="preview" style={{ height: "100px", width: "100px" }} title={file.name} />
                          :
                          <div className="d-flex flex-column" >
                            <i class="bi bi-file-earmark-pdf-fill" title={file.name} ></i>
                          </div>
                        }
                        <div className="cancle_icon" onClick={() => handleRemoveFiles(file)}>
                          <i class="bi bi-x-circle-fill red_icon"></i>
                        </div>
                      </div>
                    ))}

                  </div>
                  {
                    filesValues.length > 0 ? <div className="ps-2" > <progress value={imageUploadProgress} max="100" />
                      <span className="ps-2">{`${imageUploadProgress}%`}</span></div> : ""
                  }
                  <div className="order-field">
                    <div className="file-area d-lg-flex ">
                      <div className=" col-12 col-lg-9">
                        <input
                          type="file"
                          id="orderfile"
                          name="files[]"
                          multiple="multiple"
                          className="user-input"
                          onChange={(event) => {
                            setFilesValues(Array.from(event.target.files));
                            const fileNames = Array.from(event.target.files).map(file => { return file.name });
                            SetFilename(fileNames); // Set the original file names separated by commas

                          }}
                        />
                        <div className="user-input profile-input">
                          <div className="success">
                            <i className="bi bi-image"></i>   Dateien hochladen
                          </div>
                        </div>
                      </div>


                      <div className="col-12 mt-2 mt-lg-0 col-lg-3">
                        <button type="submit" className="justify-content-center d-flex login-btn ms-lg-2" style={{ width: "-webkit-fill-available" }} onClick={() => { AddFile() }}>
                          <i className="bi bi-box-arrow-in-right icon" style={{ margin: 'auto 0px' }}></i>
                          <b className="btn-text" style={{ margin: 'auto 0px' }}> Dateien hochladen</b>
                        </button>
                        <div className="error"></div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>


        </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
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
  }


}

