import React, {
    useState
} from "react";
import ReactDOM from 'react-dom';
import {
    Box,
    Container
} from "@chakra-ui/react";
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

// types
type UploadFile = {
    fileName: string;
    size: number;
    progressPercent: number;
};

const Form: React.FunctionComponent = () => {

        const [progFiles, setProg] = useState < Array < UploadFile >> ([]);
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
                    let v: number;
                    if (progEvent.total) {
                        v = (progEvent.loaded / progEvent.total) * 100;
                        console.log(v);
                    }
                    setProg((upl) => {
                        return upl.map((p) => {
                            if (p.fileName === fname) {
                                p.progressPercent = v;
                            }
                            return p;
                        });
                    });

                },
            }).then(function() {
                console.log("All files uploaded");
            });
        };

        const onFileUpload = (e: React.ChangeEvent < HTMLInputElement > ) => {
            const files = e.target.files;
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const formData = new FormData();
                    const fileName = files[i].name;
                    const size = files[i].size;
                    formData.append("myFiles", files[i]);
                    progFiles.push({
                        fileName,
                        size,
                        progressPercent: 0
                    });
                    uploadForm(fileName, formData);
                }
                setProg(progFiles);
            }
        };

  return (
  <Container>
  <Box>
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
  </div>
  </Box>

  <Box id="prog" padding="4" className="progress-area">
  <section className="progress-area">
  {progFiles.length > 0
  ? (
  progFiles.map(({fileName, progressPercent, size}) => (
  <li className="row" key={fileName} >
	  <FontAwesomeIcon icon={solid('file-alt')} />
	  <div className="content">
		  <div className="details">
			  <span className="name">{fileName} </span>
			  <span className="percent">{progressPercent} %</span>
		  </div>
		  <div className="progress-bar">
			  <div  className="progress" style={{width:
				progressPercent + '%'}}></div>
		  </div>
		  <span className="size">{size} Bytes</span>
	  </div>
  </li>
  ))
  )
  : <p>HTML5 Multiple upload progress indicator </p>}
  </section>
  </Box>
  </Container>
  );
};

export default Form;
