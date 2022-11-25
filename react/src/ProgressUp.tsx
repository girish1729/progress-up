import React, {
    Fragment,
    useState,
    useRef,
    useEffect,
    Component
} from "react";
import {
    useDropzone
} from 'react-dropzone';
import {
    PDFObject
} from 'react-pdfobject'

import './assets/style.css';
import axios from "axios";

import ldBar from './assets/progressBar/loading-bar.js';
import uploadIcon from './assets/icons/upload/file-submit.svg';
import progressTypes from './assets/progress-types.png';
import successIcon from './assets/icons/misc/success-icon.svg';
import trashIcon from './assets/icons/misc/trash-icon.svg';
import failureIcon from './assets/icons/misc/failure-icon.svg';

import avi from './assets/icons/filetypes/avi.svg';
import css from './assets/icons/filetypes/css.svg';
import csv from './assets/icons/filetypes/csv.svg';
import eps from './assets/icons/filetypes/eps.svg';
import excel from './assets/icons/filetypes/excel.svg';
import file from './assets/icons/filetypes/file.svg';
import html from './assets/icons/filetypes/html.svg';
import jpg from './assets/icons/filetypes/jpg.svg';
import mov from './assets/icons/filetypes/mov.svg';
import mp3 from './assets/icons/filetypes/mp3.svg';
import other from './assets/icons/filetypes/other.svg';
import pdf from './assets/icons/filetypes/pdf.svg';
import png from './assets/icons/filetypes/png.svg';
import ppt from './assets/icons/filetypes/ppt.svg';
import rar from './assets/icons/filetypes/rar.svg';
import txt from './assets/icons/filetypes/txt.svg';
import wav from './assets/icons/filetypes/wav.svg';
import word from './assets/icons/filetypes/word.svg';
import zip from './assets/icons/filetypes/zip.svg';
  

interface fileInfo {
    file: File;
    id: string;
    ts: string;
    thumb: string;
    meta: string;
    bytesSent: string;
    rate: string;
    eta: string;
};

interface errInfo {
    file: File;
    id: string;
    ts: string;
    thumb: string;
    meta: string;
    msg: string;
};


// Then you need to pass in the type of what you will have in the useState
function ProgressUp() {

    let [uploadFileInfos, setFileInfos] = useState <Array<fileInfo>> ([]);
    let [errInfos, setErrInfos] = useState <Array<errInfo>  > ([]);
    let [uploadFileList, setUpload] = useState <Array<File>> ();
    let [progressBars, setProgress] = useState < [] > ([]);
    let [statsTable, setStats] = useState < [] > ([]);
    const [openTab, setOpenTab] = useState(1);
    const [isUploadDisabled, setIsUploadDisabled] = useState(true);
    const [inputs, setInputs] = useState({
        uploadURL: "",
        filesName: "",
        progType: "",
        authEnabled: false,
        authType: "",
        user: "",
        pass: "",
        fileSizeLimit: 10,
        sizeLimitType: "Single file limit",
        fileTypeFilter: "All",
        fileTypeAction: "Allow file type"
    });
    const [progType, setProgType] = useState("line");
    const [authEnabled, enableAuth] = useState(false);
    const [authType, setAuthType] = useState("Basic");
    const [details, setDetails] = useState('');
    const [totalfiles, setNumberFiles] = useState(0);
    const [totalsize, setSize] = useState(0);
    let startUploadts = 0;
    const inputRef: any = useRef();

    var filtFiles = {
        "type": "all",
        "action": "allow"
    };

    // From drag and drop
    const onDrop = (files: any) => {
        console.log("Dnd" + files);
        setUpload(files);
        setupUpload();
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        onDrop
    })

    const fileTypes: any = {
        "video": avi,
        "css": css,
        "csv": csv,
        "eps": eps,
        "excel": excel,
        "html": html,
        "movie": mov,
        "mp3": mp3,
        "other": other,
        "pdf": pdf,
        "ppt": ppt,
        "rar": rar,
        "text": txt,
        "audio": wav,
        "word": word,
        "zip": zip
    };


    let progress: any = {};
    let showProgress: boolean = true;
    let sizeLabel:string =  "Single file limit";
    let filterLabel:string =  "Allow file type";

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({
            ...values,
            [name]: value
        }));
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(inputs);
    };

    useEffect(() => {
        console.log("DOM Updated");
        console.log(uploadFileInfos);
        createBars();
        if (inputs.uploadURL == undefined || inputs.filesName == undefined) {
            console.log('Disable upload without configuration');
            setIsUploadDisabled(true);
        }
    }, [uploadFileInfos]);

    const darkMode = () => {
        console.log("dark mode change");
        document.documentElement.classList.toggle('dark');
    };

    const uploadOneFile = async (file: any, idx: number) => {
        let formData = new FormData();
        formData.append(inputs.filesName, file);
        let fname = file.name;
        console.log("Uploading to " + inputs.uploadURL);
        console.log("Uploading file name" + inputs.filesName);
       let options = {
            headers: {
                "Content-Type": "multipart/form-data",
		Authorization: ""
            },
            onUploadProgress: (progE:any) => {
                let perc: number;
                if (progE.total) {
                    perc = (progE.loaded / progE.total) * 100;
                    let obj: any = progressBars[idx];
                    obj.set(perc);
                    file.bytesSent = humanFileSize(progE.progress *
file.file.size);
                    file.eta = progE.estimated;
                    file.rate = (progE.rate / 1024 / 1024).toFixed(2);

                    console.log(perc);
                }
            },
	};

            if (authEnabled) {
                var username = "user";
                var password = "password";
                var basicAuth = "Basic " + btoa(username + ":" + password);
                options["headers"] = {
                    "Content-Type": "multipart/form-data",
                    "Authorization": basicAuth
                };
            }

        await axios.post(inputs.uploadURL, formData, options).then(function() {
            spitStatistics(idx);
            console.log("All files uploaded");
            }).catch((error) => {
                alert("Upload failed. Please check endpoint in Setup");
                alert(error);
            });
 
    };

    const uploadAll = () => {
        startUploadts = Date.now();
        if (uploadFileInfos) {
            for (let i = 0; i < uploadFileInfos.length; i++) {
                let file = uploadFileInfos[i];
                uploadOneFile(file, i);
            }
        }
    };

    const fileSelectFinish = (e: any) => {
        let files = e.target.files;
        console.log(files);
        setUpload(files);
        setupUpload();
    };


    const humanFileSize = (size: number) => {
        const i: any = Math.floor(Math.log(size) / Math.log(1024));
        let t2: any = size / Math.pow(1024, i);
        let t: any = t2.toFixed(2) * 1;
        const ret: string = t + " " + ["B", "kB", "MB", "GB", "TB"][i];
        return (ret);
    };


    const spitStatistics = (idx: number) => {
        if (uploadFileList && idx == uploadFileList.length - 1) {
            let endUploadts = Date.now();
            let totaltime = endUploadts - startUploadts;
            let tsize = humanFileSize(totalsize);

            var ts = new Date().toLocaleString();
            var tot = uploadFileList.length;
            var status = totalfiles == tot ? true : false;

            var details = totalfiles + '/' + tot +
                " files size " + tsize +
                " sent in " + totaltime + " ms";
            setDetails(details);

            var id = statsTable.length + 1;
            let stat = {
                id: id,
                ts: ts,
                status: status,
                details: details
            };

            let st: any = [...statsTable];
            st.push(stat);
            setStats(st);

            setIsUploadDisabled(true);
            setProgress([]);
            setSize(0);
            setNumberFiles(0);
        }
    };

    const needsAuth = (event: any) => {
        enableAuth(event.target.checked);
    };
    const saveConfig = () => {
        console.log(inputs);
        console.log(inputs.uploadURL);
        console.log(inputs.filesName);
        console.log(inputs.progType);
        if (inputs.authEnabled) {
            console.log(inputs.authType);
            console.log(inputs.user, inputs.pass);
        }
        console.log(inputs.fileSizeLimit);
        console.log(inputs.sizeLimitType);
        console.log(inputs.fileTypeFilter);
        console.log(inputs.fileTypeAction);
    };

    const testUpload = async () => {
        console.log("Uploading using HTML5 File API...");
        let testForm = new FormData();

        const blob = new Blob(['Test upload DELETE'], {
            type: 'plain/text'
        });
        testForm.append(inputs.filesName, blob, 'progress-up-test.txt');
        let options = {};
        if (authEnabled) {
            var username = 'user';
            var password = 'password';
            var basicAuth = 'Basic ' + btoa(username + ':' + password);
            options = {
                headers: {
                    'Authorization': +basicAuth
                }
            };
        }

        await axios.post(inputs.uploadURL, testForm, options).then((resp) => {
            alert("Test succeeded");
        }).catch((error) => {
            alert("Upload failed. Please check endpoint in Setup");
            alert(error);
        });
    };


    const setAuth = (event: any) => {
        let auth = event.target.value;
        setAuthType(auth);
        console.log(auth);
    };


    const setIndicator = (event: any) => {

        let ind = event.target.value;
        ind = ind.toLowerCase()
        setProgType(ind);
        let extra;
        console.log(ind);
        switch (ind) {
            case "bubble":
                extra = 'data-img-size="100,100"';
                break;
            case "rainbow":
                extra = 'data-stroke="data:ldbar/res,gradient(0,1,#f99,#ff9)"';
                break;
            default:
                break;
        }
    };

    const testEP = () => {
        saveConfig();
        testUpload();
    };


    const clearAll = () => {
        setDetails("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setFileInfos([]);
        setErrInfos([]);
        setProgress([]);
        setIsUploadDisabled(true);
	setNumberFiles(0);
	setSize(0);
        console.log("Cleared");
    };


    const applyFilter = () => {
        let filt = inputs.fileTypeFilter;
        let action = inputs.fileTypeAction;
        console.log(filt, action);
        switch (filt) {
            case "All":
                break;
            case "PDF only":
                filtFiles = {
                    "type": "application/pdf",
                    "action": action
                };
                break;
            case "Image only":
                filtFiles = {
                    "type": "image",
                    "action": action
                };
                break;
            case "Video only":
                filtFiles = {
                    "type": "video",
                    "action": action
                };
                break;
            case "Audio only":
                filtFiles = {
                    "type": "audio",
                    "action": action
                };
                break;
            case "Zip only":
                filtFiles = {
                    "type": "application/zip",
                    "action": action
                };
                break;
            case "Text only":
                filtFiles = {
                    "type": "text",
                    "action": action
                };
                break;
            default:
                console.log("Filter not understood");
                break;
        }

    };

    const toggleSizeQ = () => {
        let val = inputs.sizeLimitType;
        if (val) {
            sizeLabel = "Total limit";
        } else {
            sizeLabel = "Single file limit";
        }
    };

    const toggleFilterQ = () => {
        let val = inputs.fileTypeAction;
        if (val) {
            filterLabel = "Deny file type";
        } else {
            filterLabel = "Allow file type";
        }
    };


    const wordCount = (val:string) => {
        var wom = val.match(/\S+/g);
        return {
            chars: val.length,
            words: wom ? wom.length : 0,
            lines: val.split(/\r*\n/).length
        };
    };


    const checkFilter = (mime:string) => {
        /* No filter XXX */
        if (filtFiles.type == 'all') {
            console.log("No file type filters active");
            return true;
        }
        if (mime.match(filtFiles.type) && filtFiles.action == "allow") {
            return true;
        }
        if (mime.match(filtFiles.type) && filtFiles.action == "deny") {
            return true;
        }
        return false;
    };

    const checkSize = (size:number) => {
        if (size <= (inputs.fileSizeLimit * 1024 * 1024)) {
            return true;
        }
        return false;
    };

    const checkTotalSize =() => {
        if (inputs.sizeLimitType == "Total limit") {
            if (totalsize <= (inputs.fileSizeLimit * 1024 * 1024)) {
                return true;
            }
            return false;
        }
        return false;
    };

    const showThumbnail = (f:any, i:number) => {
        let reader = new FileReader();
	let type = f.file.type.split('/')[0];
        switch(true) {

            case /image/.test(f.file.type):
                reader.onload = (function(theFile) {
                    return function(e) {
                        if (e.target) {
                            let imagesrc = String(e.target.result);
			    if(imagesrc) {
                            return ( 
			<img width="125" height="125" src={imagesrc}
                         title={f.name} alt={f.name}
                                className= "w-12 h-12" / >
                            );
			   }
                        }
                    };
                })(f);
                reader.readAsDataURL(f);
                break;

            case /pdf/.test(f.file.type):
                var pdfUrl = window.URL.createObjectURL(f);
                return ( <PDFObject url={pdfUrl} />);
                break;

            case /audio/.test(f.file.type):
                var audioUrl = window.URL.createObjectURL(f); 
                return ( 
		<audio className="h-9 w-9" controls >
                    <source src={audioUrl} > 
			</source> </audio>
                );
                break;
            case /video/.test(f.file.type):
                var videoUrl = window.URL.createObjectURL(f);
                return ( 
		  <video controls className="h-9 w-9" >
                    <source src={videoUrl}> </source> </video>
                );
                break;

            case /text/.test(f.file.type):
                reader.onload = (function(f) {
                    return function(e) {
                        let res = e.target && e.target.result;
                        let wc = wordCount(String(res));
                        let meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
  			`;
                        let dataArray:any = res && String(res).split("\n");
                        dataArray = dataArray && dataArray.slice(0, 20);
                        let txt = dataArray && dataArray.join("\n");
                        let fileIcon = fileTypes[type];
                        return ( 
			<img width="125" height="125" src={fileIcon}
                         title={txt} alt={f.name}
                            className="w-12 h-12" />
                        );
                    };
                })(f);

                break;
            default:
                let fileIcon = fileTypes[type];
                if (fileIcon == undefined) {
                    fileIcon = file;
                }
                return ( 
		<img width = "125" height = "125" src = {fileIcon}
                 title = {f.name} alt = {f.name}
                    className = "w-12 h-12" / >
                );
        }
    };

    const createBars = () => {
        const allBars: any = [];
        if (uploadFileInfos) {
            for (let j = 0; j < uploadFileInfos.length; j++) {
                let id = 'a' + j;
                let bar = new ldBar('#' + id, {
                    preset: progType
                });
                bar.set(0);
                allBars.push(bar);
            }
            setProgress(allBars);
        }
    };

    const printBannedBanner = (file: File, id:string, ts:string,
msg:string) => {
        let errInfo = {
            file: file,
            meta: '',
            id: id,
            thumb: '',
            ts: ts,
            msg: msg
     };

	setErrInfos(prev => {
		const newState = [...prev];
                newState.push(errInfo);
		return newState;
        });
    };

    const setupUpload = () => {
        var delQ:number[] = [];
	if(!uploadFileList) {
		return;
	}
        for (var i = 0; i < uploadFileList.length; i++) {
            let f = uploadFileList && uploadFileList[i];
            let mime = f.type;
            let name = f.name;
            let ts = f.lastModified.toLocaleString();
            let size = humanFileSize(f.size);
            let id = 'a' + i;
            if (!checkSize(f.size)) {
                console.log("Size check:: size is " + f.size);
                let msg = "{name} too big for upload";
                console.log(msg);
            	printBannedBanner(f, id, ts, msg);
                delQ.push(i);
                continue;
            }
            if (!checkFilter(mime)) {
                console.log("Hit banned file type:: filter issue");
                let msg = "{name} cannot be uploaded due to policy.";
            	printBannedBanner(f, id, ts, msg);
                delQ.push(i);
                continue;
            }
		
            if (uploadFileList && i == uploadFileList.length - 1) {
                console.log("Total size check:: total size is " +
                    totalsize);
                if (!checkTotalSize()) {
                    let msg = `Total size exceeds policy, delete some`;
                    setIsUploadDisabled(true);
                }
            }
            let fInfo = {
                file: f,
                id: id,
                thumb: '',
                meta: '',
                bytesSent: '',
                eta: '',
                ts: ts,
                rate: '',
            };
	    setFileInfos(prev => {
		const newState = [...prev];
                newState.push(fInfo);
		return newState;
            });
            setSize(prev => prev + f.size);
            setNumberFiles(totalfiles + 1);
        }
    if(uploadFileList) {
    uploadFileList = [...uploadFileList].filter(function(value:any,
index:number) {
        return delQ.indexOf(index) == -1;
    });
    }
        setIsUploadDisabled(false);
    };

    const delItem = (index:number) => {
	let s:number;
	if(uploadFileList) {
	 s = uploadFileList[index].size;
        s = totalsize - s;
       setSize(s );
	}
        uploadFileList && uploadFileList.splice(index, 1);
	let list = uploadFileList as File[];
        setUpload(list);

        uploadFileInfos && uploadFileInfos.splice(index, 1);
        setFileInfos(uploadFileInfos);
        checkTotalSize();
    };

  return (
  <Fragment>

<section className="dark:bg-gray-800 dark:text-white">

<div className="flex justify-end items-center space-x-2 mx-auto relative">
  <div className="w-14 h-8">

  <label onClick={darkMode} htmlFor="dark-mode" className="w-full h-full rounded-full p-1 flex justify-between cursor-pointer">
    <span className="hidden dark:inline">&#127774;</span>
    <span className="inline dark:hidden">&#127769; </span>
  </label>

  <input  type="checkbox" name="darkMode" className='hidden' />
  </div>
</div>


<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/images/progress-up-logo.svg" width="100" height="100" alt="Progress.Up HTML5 logo" />

<h2 className="text-5xl leading-tight">  HTML5 Multiple File Upload with Progress Bar 
</h2>
	<h3 className="flex justify-center text-3xl text-gray-100 mb-4
pb-4">React plugin </h3>



<div className="bg-light p7 rounded w-9/12 mx-auto">
  <ul id="tabs" className="inline-flex pt-2 px-1 w-full border-b">

    <li className= "bg-light text-dark-800 dark:text-light-800 font-semibold px-4 text-dark-800 font-semibold py-2 rounded-t">
             <a className={ (openTab === 1 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t") }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                File upload
              </a>
            </li>

    <li className="px-4 text-dark-800 font-semibold py-2 rounded-t">
              <a
                className={
                  (openTab === 2 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}

                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                 Setup
              </a>
            </li>

    <li className="px-4 text-dark-800 font-semibold py-2 rounded-t">
              <a

                className={ (openTab === 3 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                Statistics 
              </a>
            </li>


    <li className="px-4 text-dark-800 font-semibold py-2 rounded-t">
              <a className={ (openTab === 4 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                Help
              </a>
            </li>
          </ul>


<div id="tab-contents">

 <div className={openTab === 1 ? "block" : "hidden"} id="link1">
	<div id='progress-up-statsArea'>
		<h2 className="text-5xl leading-tight border-b">{details} </h2>
	</div>

	<div {...getRootProps()} className=" p-4 rounded mx-auto bg-light"> 
    	  <div className={"text-gold-400 border border-red-800 border-dashed rounded cursor-pointer" + (isDragActive ? " bg-blue-400" : "bg-light")} >
	   <form className='flex p-8  justify-center'>
		<img className="stroke-white dark:bg-white" width="100" height="100"
src={uploadIcon} alt="progress-up file submit icon" />
	       <input ref={inputRef} onChange={fileSelectFinish} {...getInputProps()} name="uploadFiles" type="file" multiple hidden />
	   </form>
	   <h2 className="flex justify-center text-dark-500 text-xl font-medium mb-2"> 
	     Drop files or click to select</h2>
	  </div>
	</div>


	<div id="config">

    {inputs.uploadURL || inputs.filesName ? (
		<h2 className="leading-tight pb-2">
	&#128202; Progress type <span
className='text-sm'>{progType}</span>  
			 &#128228; Upload URL <span
className='text-sm'>{inputs.uploadURL}</span> 
		&#128218; FilesName <span
className='text-sm'>{inputs.filesName}</span>
		</h2>
      ) : (
		<h2 className="leading-tight pb-2">
	Please configure first
		</h2>
      )}

	</div>

	<button disabled={isUploadDisabled} onClick={uploadAll} className={"inline-block px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out " +  (isUploadDisabled ? " opacity-20" : "")}
>Begin Uploading files </button>
	
	
	<button type="button" onClick={clearAll} className="inline-block
px-6 py-2.5 bg-yellow-500 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out">
	 Reset form
	</button>
 	

  </div>


<div className={openTab === 2 ? "block" : "hidden"} id="link2">


	<h2>File upload config</h2>
	   <form className="w-full max-w-lg">
	     <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
	         <label className="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" htmlFor="inputs.uploadURL">
	          POST endpoint  
	         </label>
	         <input name="inputs.uploadURL" value={inputs.uploadURL || ""} 
        onChange={handleChange}
className="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	   focus:outline-none focus:bg-light" type="text"
	   placeholder="URL to post [cross origin or absolute URL needs
CORS]" />
	         <p className="text-red-500 text-xs italic">Please fill out field.</p>
	       </div>
	   
	       <div className="w-full md:w-1/2 px-3">
	         <label className="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" htmlFor="progress-up-filesName">
	   	Name of files input field
	         </label>
	         <input name="inputs.filesName" value={inputs.filesName || ""} onChange={handleChange} id='filesName' className="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	    type="text" placeholder="Name of files input field" />
	       </div>
	      </div>
	   
	     <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full px-3">
	         <label className="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" htmlFor="progType">
	           Progress indicator type
	         </label>
	         <div className="relative">
	           <select name='progType' onChange={setIndicator} value={inputs.progType || ""} className="block appearance-none w-full bg-gray-200 border
	   border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	   >
	   			<option>Line</option>
	   			<option>Fan</option>
	   			<option>Bubble</option>
	   			<option>Energy</option>
	   			<option>Rainbow</option>
	   			<option>Stripe</option>
	   			<option>Text</option>
	   			<option>Circle</option>
	           </select>
	           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	           </div>
	         </div>
	       </div>
	      </div>
	


	
	      <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full px-3">
<label className="relative flex justify-between items-center p-2 text-xl"
htmlFor="fileSizeLimit" />
<span>File Size Limit (MB)</span>
  <input name="fileSizeLimit" value={inputs.fileSizeLimit || ""}
onChange={handleChange} className="m-6 p-6 form-range" type="range"
 min="10" max="1000" step="10" 
 />                      
<output id="sizeLimit" name="sizeLimit"
htmlFor="fileSizeLimit">{inputs.fileSizeLimit}</output>
	</div>
	</div>

	      <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full px-3">

<label className="relative flex justify-between items-center p-2 text-xl"
htmlFor="sizeToggle" >
<span>{sizeLabel}</span>
  <input name="inputs.sizeLimitType" value={inputs.sizeLimitType || ""}
onChange={toggleSizeQ}

 type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
  <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1
bg-blue-600 rounded-full duration-300 ease-in-out peer-checked:bg-yellow-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
</label>
	</div>
	</div>



	      <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full px-3">
	         <label className="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" htmlFor="progress-up-indicator">
	          File type Filters 
	         </label>
	         <div className="relative">
	           <select name="progress-up-filter"
onChange={handleChange} value={inputs.fileTypeFilter || ""}
 className="block appearance-none w-full bg-gray-200 border
	   border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	   >
	   			<option>All</option>
	   			<option>PDF only</option>
	   			<option>Image only</option>
	   			<option>Video only</option>
	   			<option>Audio only</option>
	   			<option>Zip only</option>
	   			<option>Text only</option>
	           </select>
	           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	           </div>
	         </div>
	       </div>
	      </div>

<label className="relative flex justify-between items-center p-2 text-xl"
htmlFor="filterAction" >
<span>{filterLabel}</span>
  <input name='inputs.fileTypeAction' onChange={toggleFilterQ}

type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
  <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1
bg-green-600 rounded-full duration-300 ease-in-out peer-checked:bg-red-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
</label>

	     <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full px-3">
	       <label className="md:w-2/3 block text-dark-500 font-bold">
	         <span className="text-sm">
	           HTTP Auth required?
	         </span>
	         <input name='inputs.authEnabled' onChange={needsAuth}
checked={inputs.authEnabled || false} className="mr-2 leading-tight" type="checkbox" />
	       </label>
	      </div>
	     </div>
	   
      {authEnabled &&
             <div id='progress-up-authsection' >
	        <div className="flex flex-wrap -mx-3 mb-6">
	          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label className="block uppercase tracking-wide
text-dark-700 text-xs font-bold mb-2" htmlFor="authType">
	              Auth type
	            </label>
	            <div className="relative">
	              <select id='authType' onChange={setAuth} value={inputs.authType || ""} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-light focus:border-gray-500" >
	                <option>HTTP basic auth</option>
	                <option>HTTP digest auth</option>
	              </select>
	       
	              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	              </div>
	            </div>
	          </div>
	      
	          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label className="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2" htmlFor="user">
	             Username  
	            </label>
	            <input name='inputs.user' value={inputs.user || ""} onChange={handleChange} className="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	      focus:outline-none focus:bg-light"  type="text"
	      placeholder="username" />
	            <p className="text-red-500 text-xs italic">Please fill out field.</p>
	          </div>
	      
	          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label className="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2" htmlFor="progress-up-pass">
	      	Password
	            </label>
	            <input name='inputs.pass' value={inputs.pass || ""} onChange={handleChange} className="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	      focus:outline-none focus:bg-light focus:border-gray-500"
	       type="password" placeholder="Password" />
	          </div>
	         </div>
 	   </div>
      }
	   
	   <button type="button" onClick={saveConfig} className="inline-block px-6
	py-2.5 bg-red-600 text-dark dark:text-white font-medium text-xs leading-tight uppercase
	rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700
	focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800
	active:shadow-lg transition duration-150 ease-in-out">Save</button>
	   
	   <button type="button" onClick={testEP} className="inline-block
px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs
leading-tight uppercase rounded shadow-md hover:bg-blue-500
hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none
focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150
ease-in-out" >
	    Test file upload
	   </button>
	   </form>
  </div>


<div className={openTab === 3 ? "block" : "hidden"} id="link3">
      <h2> Statistics </h2>
	<div className="flex flex-col">
	  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
	    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
	      <div className="overflow-hidden">
	        <table className="min-w-full">
	          <thead className="bg-light border-b">
	            <tr>
	              <th scope="col" className="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                #
	              </th>
	              <th scope="col" className="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Time
	              </th>
	              <th scope="col" className="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Status
	              </th>
	              <th scope="col" className="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Details
	              </th>
	            </tr>
	          </thead>
	          <tbody id="progress-up-statsTable">

  {statsTable.length > 0 ? 
   (statsTable.map(({id, ts, status, details}) => (

	            <tr key={id} className="bg-gray-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-gray-900">{id}</td>
	              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {ts}
	              </td>
	              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">

    {status ? (
                <img src={successIcon} /> 
      ) : (
                <img src={failureIcon} />
      )}
	              </td>
	              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {details}
	              </td>
	            </tr>
   	)
   )):<tr><td> No data </td></tr>}

		   </tbody>
	        </table>
	      </div>
	    </div>
	  </div>
	</div>

   </div>



 <div className={openTab === 4 ? "block" : "hidden"} id="link4">
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
	 <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
	    <div className="overflow-hidden">

	        <table className="min-w-full">
	          <thead className="bg-light border-b">
	            <tr>
	              <th scope="col" className="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	               Param
	              </th>
	              <th scope="col" className="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Type
	              </th>
	              <th scope="col" className="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Description
	              </th>
	            </tr>
	          </thead>
	          <tbody>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">uploadURL</td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> String </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The absolute/relative path of HTTP POST
endpoint </td>
		   </tr>


	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">filesName</td>
	              <td className="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The name of files configured in backend </td>
		   </tr>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">HTTP auth </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Checkbox </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Enable it if your backend requires auth</td>
		   </tr>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">HTTP auth type</td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select option </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Choose one of Digest/Basic HTTP auth </td>
		   </tr>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Auth username</td>
	              <td className="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Username configured in backend for auth </td>
		   </tr>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Password</td>
	              <td className="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Password configured in backend for auth </td>
		   </tr>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Progress Indicator</td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select option</td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> See below for possible options </td>
		   </tr>
		   </tbody>
	        </table>
	      </div>
	    </div>
	  </div>
	</div>

	<img src={progressTypes} alt="Progress-up types" />

       <ul className='marker:text-green list-outside'>
         <li className='pb-2'> There is also the ability to perform a test Upload to validate the endpoint.  </li>
         <li>
       	Remember that the configuration is active only for the session.
         </li>
       
         <li>
       	There is also statistics for upload and profiling available.
         </li>
         <li>
       	If using absolute URL please ensure <a href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing">CORS is enabled</a>.
         </li>
       </ul>
  </div>

 </div>
</div>


<div id="progress-up-progressArea"> 
  {uploadFileInfos.length > 0
  ? (
  uploadFileInfos.map(({file,id, meta, ts, bytesSent, rate, eta}, index) => (

  <section key={file.name} className="m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white mx-auto">
    <div className="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
border-gray-300 text-gray-600 dark:text-white relative">

  <div  onClick={() => delItem(index)} title="Delete" className="absolute
cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
	<img width="25" height="25" src={trashIcon} />
  </div>

  <div className="flex flex-wrap -mx-2 mb-8">
      <div className="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div className="h-12 text-sm text-grey-dark flex items-left
justify-left">

      		<div id="{id}-thumb">{ showThumbnail(file, index) }</div>
        </div>
      </div>

      <div className="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div className="h-12 text-sm text-grey-dark flex items-left justify-left">
          <ul>
      	    <li  className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {file.name}
      	    </li>
      	    <li className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {ts}
      	    </li>
      	    <li className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {file.type}
      	    </li>
      	    <li className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {file.size} 
      	    </li>
       	    <li className="font-light leading-relaxed text-gray-800
dark:text-white">
	    Metadata: {meta}
      	    </li>
      	    <li className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
		<span>{bytesSent} of {file.size} uploaded  {rate} MB/s ETA {eta} s</span>
      	    </li>
          </ul>
        </div>
       </div>
  </div>

      <div className='ldBar bottom-0 right-0 pb-8' id={id} ></div>

    </div>
  </section>
 ))
): <br/> }
</div>

<div id="progress-up-errArea"> 
  {errInfos.length > 0
  ? (
  errInfos.map(({file, thumb, ts, meta, msg}, index) => (
    <section key={file.name} className="bg-red-200 m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white">
 <div className="bg-red-600 dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">

    <div title="Removed from uploads" className="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
          <img width="25" height="25"
src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" />
    </div>

    <div className="flex flex-wrap -mx-2 mb-8">

      <div className="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div className="h-12 text-sm text-grey-dark flex items-left justify-left">
      <div id="{id}-thumb" >{ showThumbnail(file, index) }</div>
         </div>
      </div>

      <div className="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div className="h-12  text-grey-dark flex items-left justify-left">
         <ul>
      	    <li  className="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {file.name}
      	    </li>
      	    <li className=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {ts}
      	    </li>
      	    <li className=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {file.type}
      	    </li>
      	    <li className="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {file.size} 
      	    </li>
       	    <li className="font-light leading-relaxed text-gray-800 dark:text-white">
	    Metadata: {meta}
      	    </li>
         </ul>
        </div>
       </div>
		{msg}
         </div>

      </div>
    </section>
 ))
): <br/> }
  </div>

</section>

  </Fragment>
  );
}

export default ProgressUp;
