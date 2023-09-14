import { SlideshowLightbox } from "lightbox.js-react";
import { useEffect, useState } from "react";
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function ChatImgPart({ val }) {
  const original_file_names = val.files_original_name?.split(",");
  // console.log(val.files);
  // const [open, setOpen] = React.useState(false);
  const [lightboxData, setLightboxData] = useState({
    open: null,
    name: null,
  });

  function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  }


  return (
    <>
      {val.files.split(",").map((innerVal, i) => {
        const imgPath = `${process.env.REACT_APP_IMG_URL}/assets/chat_image/${innerVal}`
        // console.log(original_file_names[i]);
        let icon = null;
        const fileExtension = getFileExtension(imgPath);
        if (fileExtension === 'zip') {
          icon = <a href={imgPath} download={original_file_names && original_file_names[i]}> <img src={`${process.env.REACT_APP_IMG_URL}/assets/file_icon/zip.png`} alt="Zip Icon" style={{ height: "100px", width: "100px", marginLeft: "5px" }} /></a>
            ;
        } else if (fileExtension === 'pdf') {
          icon = <a href={imgPath} download={original_file_names && original_file_names[i]} ><img src={`${process.env.REACT_APP_IMG_URL}/assets/file_icon/pdf.png`} alt="PDF Icon" style={{ height: "100px", width: "100px", marginLeft: "5px" }} /></a>;
        } else if (['mp4', 'avi', 'mkv','mp3'].includes(fileExtension)) {
          icon = <div><img src={`${process.env.REACT_APP_IMG_URL}/assets/file_icon/video-file.png`} onClick={() => {
            setLightboxData({ open: innerVal, name: innerVal });}}  alt="Video Icon" style={{ height: "100px", width: "100px", marginLeft: "5px" }} />
            <Lightbox
           open={lightboxData.open==innerVal}
          plugins={[Thumbnails,Video]}
          close={() => {
            setLightboxData({ open: null, name: null }); // Close the lightbox
          }}
              slides={[{type: "video",
              width: 1280,
              height: 720,
              sources: [
                  {
                      src: imgPath,
                      type: "video/mp4",
                  },
              ],}]}
          /></div> ;
    ;
        }
        else {
          // console.log(lightboxData.open);
          icon = <div><img src={imgPath} onClick={() => {
            setLightboxData({ open: innerVal, name: innerVal });
          }} style={{ height: "100px", width: "100px", marginLeft: "5px" }} /><Lightbox
          open={lightboxData.open==innerVal}
          plugins={[Thumbnails,Zoom]}
              close={() => {
                setLightboxData({ open: null, name: null }); // Close the lightbox
              }}
              slides={[{ src: imgPath }]}
          /></div>
        }
      
        return <div className="position-relative">
          <a href={imgPath} download={original_file_names && original_file_names[i]} className="position-absolute top-0" style={{ zIndex: 1, left: "2px", cursor: "pointer" }}> <i class="bi bi-download fs-6" style={{background:'#C0DE60'}}></i> </a>
          {/* <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto my-2 "> */}
            {icon}
          {/* </SlideshowLightbox> */}
           {/* <App/> */}
        </div>
      })}
    </>
  )
}
