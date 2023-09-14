import React, { useState } from 'react'

export default function Preview({file}) {

    const [preview, setPreview] = useState(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setPreview(reader.result)
    }

  return (
    <div>
      <img src={preview}  style={{height: "50px", width: "50px", borderRadius: "50%"}} alt="image"/>
    </div>
  )
}