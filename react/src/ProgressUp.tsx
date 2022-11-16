import React, {
    Fragment,
    useState,
    useEffect,
    setState,
    Component
} from "react";
import {useDropzone} from 'react-dropzone';
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

function ProgressUp() {

    let [uploadFileInfos, setFileInfos] = useState<[]>([]);
    let [uploadFileList, setUpload] = useState<File[]>([]);
    let [progressBars, setProgress] = useState<[]>([]);
    let [statsTable, setStats] = useState<Array[]>([]);
    const [openTab, setOpenTab] = useState(1);
    const [isUploadDisabled, setIsUploadDisabled] = useState(true);
    const [inputs, setInputs] = useState({});
    const [progType, setProgType] = useState("line");
    const [authEnabled, enableAuth] = useState(false);
    const [authType, setAuthType] = useState("Basic");
    const [details, setDetails] = useState('');

    // From drag and drop
    const onDrop = (files: FileList) => {
	console.log("Dnd" + files);
	setUpload(files);
        setupUpload(files);
    };

  const {getRootProps, getInputProps} = useDropzone({onDrop})

    const fileTypes = {
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


    let totalfiles = 0;
    let totalsize = 0;
    let totaltime = 0;
    let startUploadts = 0;
    let endUploadts = 0;


    let progress: any = {};
    let showProgress: boolean = true;




    /* XXX these are backend variables */
    ///uploadURL = 'https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34';
    let uploadURL = 'https://localhost:2324/uploadmultiple';
    let filesName = "uploadFiles";
    let user = '';
    let pass = '';

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({
            ...values,
            [name]: value
        }));
    };

 const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
  };

   useEffect(() => {
	console.log("Updated");
	console.log(uploadFileInfos);
	createProgressBars();


   }, [uploadFileInfos]);

   const darkMode = () => {
	document.body.classList.toggle('dark');
  };

    const uploadOneFile = async (file: File, idx: Number) => {
        let formData = new FormData();
        formData.append(filesName, file);
        let fname = file.name;
        await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progEvent) => {
                let perc: number;
                if (progEvent.total) {
                    perc = (progEvent.loaded / progEvent.total) * 100;
                    //progressBars[idx].set(perc);
		    //setProgress(idx => [...progressBars[idx]]);
                    console.log(perc);
                }

                setProg((upl: any) => {
                    return upl.map((p: any) => {
                        if (p.fileName === fname) {
                            p.progressPercent = perc;
                        }
                        return p;
                    });
                });

            },
        }).then(function() {
            console.log("All files uploaded");
        });
    };

    const uploadAll = () => {
        if (uploadFileList) {
            for (let i = 0; i < uploadFileList.length; i++) {
                let file = uploadFileList[i];
                uploadOneFile(file, i);
            }
        }
    };

    const fileSelectFinish = (e: any) => {
        let files = e.target.files;
	console.log(files);
	setUpload(files);
        setupUpload(files);
    };

    const humanFileSize = (size: number) => {
        const i: any = Math.floor(Math.log(size) / Math.log(1024));
        let t: any = size / Number(Math.pow(1024, i).toFixed(2)) * 1;
        const ret: string = t + " " + ["B", "kB", "MB", "GB", "TB"][i];
        return (ret);
    };

    const buildThumb = (f: File, type: string, cb) => {
        type = type.split('/')[0];

        if (type != 'image') {
            let fileIcon = fileTypes[type];
            if (fileIcon == undefined) {
                fileIcon = file;
            }
            cb(fileIcon);
        } else {
            let reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    cb(e.target.result); 
                };
            })(f);
            reader.readAsDataURL(f);
        }
    };

    const createProgressBars = () => {
	const allBars = [];
	for(let j = 0; j < uploadFileList.length;j++) {
            let id = 'a' + j;
            let bar = new ldBar('#' + id, {
                preset: progType
            });
            bar.set(0);
	    allBars.push(bar);
          }
	    setProgress(allBars);
   };

    const setupUpload = (files) => {
	const allInfos = [];
	for(let i = 0; i < files.length;i++) {
	    let f = files[i];
            let ts = f.lastModifiedDate.toLocaleDateString();
            let name = f.name;
            let size = humanFileSize(f.size);
            let mime = f.type;
            let id = 'a' + i;
            buildThumb(f, mime, function(src) { 
		let imagesrc = src; 
	    let fInfo = {
                ts:ts,
                name:name,
                size:size,
                mime: mime,
                id: id,
                imagesrc:imagesrc
            };
	    allInfos.push(fInfo);

            totalsize += f.size;
            totalfiles += 1;
	    if(i == files.length - 1) {
	    console.log("Setting uploadinfo");
  	    	setFileInfos(allInfos);
	     }
	    });
	}
        setIsUploadDisabled(false);
    };

    const delItem = (index: number) => {
        let list = [...uploadFileInfos];
        list.splice(index, 1);
        setFileInfos(list);
    };

    const spitStatistics = (idx: number) => {
        if (idx == uploadFileList.length - 1) {
            let endUploadts = Date.now();
            let totaltime = endUploadts - startUploadts;
            totalsize = humanFileSize(totalsize);

            var ts = new Date().toLocaleString();
            var tot = uploadFileList.length;
            var status = totalfiles == tot ?
                "<img src={successIcon} >" :
                "<img src={failureIcon} >";

	   var details = totalfiles / tot + "files size " + totalsize +
                "sent in " + totaltime + " ms";
            setDetails(details);

            var id = statsTable.length + 1;
	    let stat = {
		id: id,
		ts: ts,
		status: status,
		details: details
	    };

	    let st = [...statsTable];
	    st.push(stat);
	    setStats(st);

            setIsUploadDisabled(true);
	    setProgress([]);
            totalfiles = 0;
            totalsize = 0;
            totaltime = 0;
            startUploadts = 0;
            endUploadts = 0;
        }
    };

   const needsAuth = (event) => {
    enableAuth(event.target.checked);
};
    const saveConfig = () => {
    	       console.log(inputs);
		console.log(inputs.uploadURL);
		console.log(inputs.filesName);
		console.log(progType);
		console.log(authEnabled);
		console.log(authType);
		console.log(inputs.user);
		console.log(inputs.pass);
	};

    const testUpload = async () => {
        console.log("Uploading using HTML5 File API...");
        let testForm = new FormData();

        const blob = new Blob(['Test upload DELETE'], {
            type: 'plain/text'
        });
        testForm.append(filesName, blob, 'progress-up-test.txt');
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

        /*
        await axios.post(uploadURL, testForm, options).then((resp) => {
            alert("Test succeeded");
        }).catch((error) => {
            alert("Upload failed. Please check endpoint in Setup");
            alert(error);
        });
	*/
    };


    const setAuth = (event) => {
	let auth = event.target.value;
        setAuthType(auth);
        console.log(auth);
    };


    const setIndicator = (event) => {

	let ind = event.target.value;
	ind = ind.toLowerCase()
        setProgType(ind);
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
        setUpload([]);
	setStats([]);
	setFileInfos([]);
	setProgress([]);
        
        totalfiles = 0;
        totalsize = 0;
        totaltime = 0;
        startUploadts = 0;
        endUploadts = 0;

        setIsUploadDisabled(true);
        console.log("Cleared");

    };

  return (

  <Fragment>

<div className="flex justify-end items-center space-x-2 mx-auto relative">
  <div className="w-14 h-8">

  <label htmlFor="dark-mode" className="w-full h-full rounded-full p-1 flex justify-between cursor-pointer">
    <span className="hidden dark:inline">&#127774;</span>
    <span className="inline dark:hidden">&#127769; </span>
  </label>

  <input type="checkbox" id="dark-mode" className='hidden'
onChange={darkMode} />
  </div>
</div>


<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/images/progress-up-logo.svg" width="100" height="100" alt="Progress.Up HTML5 logo" />

<h2 className="text-5xl leading-tight mb-4 pb-4 border-b">  HTML5 Multiple File Upload with Progress Bar 
</h2>


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

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
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

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
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


    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
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

	<div {...getRootProps()} className="bg-light p-4 rounded mx-auto">
    	  <div className="text-gold-400 border border-red-800 border-dashed rounded cursor-pointer">
	   <form className='flex p-8  justify-center'>
		<img className="stroke-white dark:bg-white" width="100" height="100"
src={uploadIcon} alt="progress-up file submit icon" />
	       <input {...getInputProps()} id="progress-up-fileInput" name="uploadFiles"
type="file" multiple hidden />
	   </form>
	   <h2 className="flex justify-center text-dark-500 text-xl font-medium mb-2"> 
	     Drop files or click to select</h2>
	  </div>
	</div>

	<div id='progress-up-configSummary'></div>

	<button id="upButton" onClick={uploadAll} className="inline-block px-6
	py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs leading-tight
	uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg
	focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0
	active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out
	opacity-20" disabled>Begin Uploading files
	</button>
	
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
	   font-bold mb-2" htmlFor="progress-up-uploadURL">
	          POST endpoint  
	         </label>
	         <input value={inputs.uploadURL || ""} 
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
	         <input value={inputs.filesName || ""} onChange={handleChange} id='filesName' className="appearance-none block w-full bg-gray-200
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
	           <select id='progType' onChange={setIndicator} value={inputs.progType || ""} className="block appearance-none w-full bg-gray-200 border
	   border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	   >
	   			<option defaultValue>Line</option>
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
	       <label className="md:w-2/3 block text-dark-500 font-bold">
	         <span className="text-sm">
	           HTTP Auth required?
	         </span>
	         <input id='authEnabled' onChange={needsAuth} value={inputs.authEnabled || false}
className="mr-2 leading-tight"
type="checkbox" />
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
	            <input id='user' value={inputs.user || ""} onChange={handleChange} className="appearance-none block w-full bg-gray-200
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
	            <input id='pass' value={inputs.pass || ""} onChange={handleChange} className="appearance-none block w-full bg-gray-200
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

     <div key={id}>
	            <tr className="bg-gray-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-gray-900">{id}</td>
	              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {ts}
	              </td>
	              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {status}
	              </td>
	              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {details}
	              </td>
	            </tr>
	</div>
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
  uploadFileInfos.map(({name, ts, mime, size,id, imagesrc}) => (
 

<section key={name} className="m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white mx-auto">
 <div className="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
border-gray-300 text-gray-600 dark:text-white relative">

  <div  onClick={() => delItem(id)} title="Delete" className="absolute
cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
	<img width="25" height="25" src="assets/icons/misc/trash-icon.svg" />
  </div>

  <div className="flex flex-wrap -mx-2 mb-8">
      <div className="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div className="h-12 text-sm text-grey-dark flex items-left
justify-left">
             <img width="125" height="125" src={imagesrc} title={name} alt={name} className="w-12 h-12" />
         </div>
      </div>

      <div className="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div className="h-12 text-sm text-grey-dark flex items-left justify-left">
          <ul>
      	    <li  className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {name}
      	    </li>
      	    <li className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {ts}
      	    </li>
      	    <li className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {mime}
      	    </li>
      	    <li className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {size} 
      	    </li>
          </ul>
        </div>
       </div>
  </div>
      <div className='ldBar bottom-0 right-0 pb-8' id={id} ></div>

  </div>
</section>
 ))
):<br/> }


  </div>

 </Fragment>
  );
}

export default ProgressUp;
