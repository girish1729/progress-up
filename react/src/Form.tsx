import React, { useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import { useUploadForm } from "./hooks";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {solid, regular, brands, icon} from
'@fortawesome/fontawesome-svg-core/import.macro';

interface PostData {
  file: File | null;
}

const Form: React.FunctionComponent = () => {
  const fileInput = useRef<HTMLInputElement>(null);

    let uploadedClasses = "uploaded-area ";
    let progressArea = '';
    let uploadedArea = '';
  const [formValues, setFormValues] = useState<PostData>({
    file: null,
  });

  const { isLoading, isSuccess, uploadForm, progress } = useUploadForm(
    "http://localhost:2324/uploadmultiple"
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      file: event.target.files ? event.target.files[0] : null,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formValues.file && formData.append("myFiles", formValues.file);
    return await uploadForm(formData);
  };

  const refreshPage = async() => {
	return await window.location.reload();
  }

 const onFileUpload = async (e : React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
            const fileName = file.name;
            const fileLoaded = 0;
            const size = file.size;
            const progressHTML =
               <li className="row">
		<FontAwesomeIcon icon={solid('file-alt')} />
                       <div className="content">
                            <div className="details">
                              <span className="name">${fileName} </span>
                              <span id="{fileName}-1" className="percent">{fileLoaded} %</span>
                            </div>
                         <div id="{fileName}-2" className="progress-bar">
                              <div  className="progress" style={{width:
fileLoaded}}></div>
                         </div>
                         <span className="size">{size} Bytes</span>
                        </div>
		 </li>;
            progressArea += progressHTML;
            uploadedClasses += "onprogress";

    const formData = new FormData();
    formValues.file && formData.append("myFiles", formValues.file);
    return await uploadForm(formData);
        }
    }
    }
    }


  return (
   
<div className="wrapper">
 <header>Progress.up file upload </header>
 <div className='text-center'>
   <button onClick={refreshPage} className="clearButton" role="button">Clear all</button>
 </div>
 <form action="#">
      <input onChange={onFileUpload} className="file-input" type="file" name="myFiles" multiple hidden></input>
            <button onClick={e => fileInput.current &&
fileInput.current.click()} className="btn btn-primary"></button>
	<FontAwesomeIcon icon={solid('file-upload')} />
      <p>Browse Files to Upload</p>
 </form>
  <>
 <section className="progress-area">{progressArea}</section>
 <section className={uploadedClasses}>{uploadedArea}</section>
  </>
</div>


  );
};

   //<Button onClick={location.reload()}>Clear all</Button>
export default Form;
