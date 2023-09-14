import { SlideshowLightbox } from "lightbox.js-react";
import { useEffect, useState } from "react";

export default function ChatImgPart({ val }) {
  const original_file_names = val.files_original_name?.split(",");


  function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  }
  

  return (
    <>
      {val.files.split(",").map((innerVal, i) => {

        const imgPath = `${process.env.REACT_APP_IMG_URL}/assets/chat_image/${innerVal}`
        let icon = null;
        const fileExtension = getFileExtension(imgPath);
        if (fileExtension === 'zip') {
          icon = <img src={`${process.env.REACT_APP_IMG_URL}/assets/file_icon/zip.png`} alt="Zip Icon" style={{ height: "100px", width: "100px", marginLeft: "5px" }} />;
        } else if (fileExtension === 'pdf') {
          icon = <img src={`${process.env.REACT_APP_IMG_URL}/assets/file_icon/pdf.png`} alt="PDF Icon" style={{ height: "100px", width: "100px", marginLeft: "5px" }} />;
        } else if (['mp4', 'avi', 'mkv'].includes(fileExtension)) {
          icon = <img src={`${process.env.REACT_APP_IMG_URL}/assets/file_icon/video-file.png`} alt="Video Icon" style={{ height: "100px", width: "100px", marginLeft: "5px" }} />;
        }
        else {
          icon= <img src={imgPath} style={{ height: "100px", width: "100px", marginLeft: "5px" }} />
        }
      
        return <div className="position-relative">
          <a href={imgPath} download={original_file_names && original_file_names[i]} className="position-absolute top-0" style={{ zIndex: 1, left: "10px", cursor: "pointer" }}> <i class="bi bi-download fs-6"></i> </a>
          <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto my-2 ">
            {icon}
          </SlideshowLightbox>
        </div>
      })}
    </>
  )
}