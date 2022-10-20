import React, {
    useState
} from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    solid,
    regular,
    brands,
    icon
} from '@fortawesome/fontawesome-svg-core/import.macro';

interface PostData {
    file: File | null;
}

const Form: React.FunctionComponent = () => {
        let progressArea:any = [];
        let displayAll:any;
	const [progress, SetProgress] = useState(0);
	const url = "http://localhost:2324/uploadmultiple";

        const refreshPage = async () => {
            return await window.location.reload();
        };



  const uploadForm = async (fname: string, formData: FormData) => {
    await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progEvent) => {
         let v = (progEvent.loaded / progEvent.total) * 100;
	 SetProgress(v);
	 console.log(v);
      },
    }).then(function() {
	 let p = document.getElementById('prog');
	 ReactDOM.render(displayAll, p);
    });
  };
        const onFileUpload = (e: React.ChangeEvent < HTMLInputElement > ) => {
            const files = e.target.files;
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file) {
                        const fileName = file.name;
			SetProgress(100);
                        const size = file.size;
                        const progressHTML =
               <li className="row" key={fileName} >
		<FontAwesomeIcon icon={solid('file-alt')} />
                       <div className="content">
                            <div className="details">
                              <span className="name">{fileName} </span>
                              <span className="percent">{progress} %</span>
                            </div>
                         <div className="progress-bar">
                              <div  className="progress" style={{width:
progress + '%'}}></div>
                         </div>
                         <span className="size">{size} Bytes</span>
                        </div>
		 </li>;
                        progressArea.push(progressHTML);
			if(i == files.length - 1) {
				displayAll = <ul> {progressArea} </ul>;
			}
                        const formData = new FormData();
                        formData.append("myFiles", file);
			console.log(file.name);
                        uploadForm(fileName, formData);
                    }
                }
            }
        };

  return (
   
<div className="wrapper">
 <header>Progress.up file upload </header>
 <div className='text-center'>
   <button onClick={refreshPage} className="clearButton" role="button">Clear all</button>
 </div>
 <form>
	<label htmlFor="inputFile" className="button">Upload</label>
      <input id="inputFile" onChange={onFileUpload} className="file-input" type="file" name="myFiles" multiple hidden></input>
	<FontAwesomeIcon icon={solid('cloud-upload-alt')} size='10x' />
      <p>Browse Files to Upload</p>
 </form>
  <>
 <section id="prog" className="progress-area">{displayAll}</section>
  </>
</div>


  );
};
export default Form;
