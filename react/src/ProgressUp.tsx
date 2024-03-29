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
    size: string;
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
    size: string;
    thumb: string;
    meta: string;
    msg: string;
};


// Then you need to pass in the type of what you will have in the useState
function ProgressUp() {

    let [uploadFileInfos, setFileInfos] = useState < Array < fileInfo >> ([]);
    let [errInfos, setErrInfos] = useState < Array < errInfo > > ([]);
    let [progressBars, setProgress] = useState < [] > ([]);
    let [statsTable, setStats] = useState < [] > ([]);
    let [isUploadDisabled, setBut] = useState(true);

    const [openTab, setOpenTab] = useState(1);
    const [inputs, setInputs] = useState({
        uploadURL: "",
        filesName: "",
        progressType: "Fan",
        authEnabled: false,
        authType: "",
        user: "",
        pass: "",
        fileSizeLimit: 10,
        sizeLimitType: "Single file limit",
        fileTypeFilter: "All",
        fileTypeAction: "Allow file type"
    });
    const [authEnabled, enableAuth] = useState(false);
    const [authType, setAuthType] = useState("Basic");
    const [details, setDetails] = useState('');
    const [totalfiles, setNumberFiles] = useState(0);
    const [totalsize, setSize] = useState(0);
    const [sizeLabel, setSLabel] = useState("Single file limit");
    const [filterLabel, setFLabel] = useState("Allow file type");
    const [errMsg, setErr] = useState('');
    let uploadFileList: File[] = [];
    let startUploadts = 0;
    let errAlert = false;
    const inputRef: any = useRef();

    var filtFiles = {
        "type": "all",
        "action": "allow"
    };

    const onDrop = (files: any) => {
	uploadFileList = files;
        console.log(files);
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

    const handleChange = (event: any) => {

        const name = event.target.name;
        const value = event.target.value;
        console.log(name, value);
        setInputs(values => ({
            ...values,
            [name]: value
        }));

        applyFilter();
        return (value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(inputs);
    };
    const uploadOneFile = async (file: any, idx: number) => {
        let formData = new FormData();
        formData.append(inputs.filesName, file.file);
        let fname = file.name;
        console.log("Uploading to " + inputs.uploadURL);
        console.log("Uploading file name" + inputs.filesName);
        let options = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: ""
            },
            onUploadProgress: (progE: any) => {
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
            if (!errAlert) {
                alert("Upload failed. Please check endpoint in Setup");
                alert(error);
                errAlert = true;
            }
        });

    };

    const uploadAll = () => {
        startUploadts = Date.now();
        errAlert = false;
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
        uploadFileList = files;
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
        if (uploadFileInfos && idx == uploadFileInfos.length - 1) {
            let endUploadts = Date.now();
            let totaltime = endUploadts - startUploadts;
            let tsize = humanFileSize(totalsize);

            var ts = new Date().toLocaleString();
            var tot = uploadFileInfos.length;
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

            setBut(true);
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
        console.log(inputs.progressType);
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

    const testEP = () => {
        saveConfig();
        testUpload();
    };


    const clearAll = (event:any) => {
	console.log("ClearAll()::");
 	if(event !== undefined) {	
		console.log("Clear file list()::");
		uploadFileList = [];
	}	
        setDetails("");
        setFileInfos([]);
        setErrInfos([]);
        setProgress([]);
        setBut(true);
        setNumberFiles(0);
        setSize(0);
	setErr('');
        console.log("Cleared");
    };

    const applyFilter = () => {
        let filt = inputs.fileTypeFilter;
            let action;
            if (filterLabel === "Allow file type") {
                action = "allow";
            } else {
                action = "deny";
            }
            console.log("Setting:: mime " + filt + " action " + action);
         
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

    const toggleSizeQ = (e: any) => {
        let val = e.target.checked;
        if (val) {
            setSLabel("Total limit");
            inputs.sizeLimitType = "Total limit";
        } else {
            setSLabel("Single file limit");
            inputs.sizeLimitType = "Single file limit";
        }
        handleChange(e);
    };

    const toggleFilterQ = (e: any) => {
        let val = e.target.checked;
        if (val) {
            setFLabel("Deny file type");
            inputs.fileTypeAction = "Deny file type";
        } else {
            setFLabel("Allow file type");
            inputs.fileTypeAction = "Allow file type";
        }
        handleChange(e);
    };

    const wordCount = (inp: any) => {
        const str = String(inp);
        var wom = str.match(/\S+/g);
        return {
            chars: str.length,
            words: wom ? wom.length : 0,
            lines: str.split(/\r*\n/).length
        };
    };

    const checkFilter = (mime: string) => {
        /* No filter XXX */
        if (filtFiles.type == 'all') {
            console.log("No file type filters active");
            return true;
        }
        if (filtFiles.action == "allow" && mime.match(filtFiles.type)) {
            return true;
        }
        if (filtFiles.action == "deny" && !mime.match(filtFiles.type)) {
            return true;
        }
        return false;
    };
    const checkSize = (size:number) => {
            console.log("Size check:: size is " +
		humanFileSize(size));
            if (sizeLabel == "Single file limit") {
            	console.log("Single file limit");
                if (size <= (inputs.fileSizeLimit * 1024 * 1024)) {
                    return true;
                }
            	console.log("Single file limit exceeded");
                return false;
            }
            console.log("Total limit");
            return true;
        };

        const checkTotalSize = (tot: number) => {
            console.log("Total size check:: total size is " +
              humanFileSize(tot));
            console.log("Allowed size is :: " +
              humanFileSize(inputs.fileSizeLimit * 1024 * 1024));
            if (sizeLabel == "Total limit") {
                if (tot <= (inputs.fileSizeLimit * 1024 * 1024)) {
		    setErr('');
                    setBut(false);
                    return true;
                }
                setBut(true);
                setErr(`Total size exceeds policy, delete some files`);
            	console.log("Total file limit exceeded");
                return false;
            }
            return true;
        };

    const pFileReader = (file: File) => {
        return new Promise((resolve, reject) => {
            var reader = new FileReader()
            reader.onload = function found() {
                resolve(reader.result)
            }
            reader.readAsDataURL(file);
        })
    };

    useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((config) => {
	 inputs.uploadURL = config.uploadURL;
	 inputs.filesName = config.filesName;
	 inputs.progressType = config.progressType;
      });

	if(uploadFileInfos) {
        	createBars();
	}
      if((inputs.uploadURL.length > 3) && (inputs.filesName.length > 3)) {
            console.log('Enable upload button if Files in Q');
            if (uploadFileInfos && uploadFileInfos.length > 0) {
                console.log('Enabled upload button');
                setBut(false);
            } else {
                setBut(true);
	    }
        } else {
            console.log('Disable upload without configuration');
            setBut(true);
        }
    }, [uploadFileInfos]);

    const figuretype = (type: string) => {
        if (type.includes('image')) {
            return 'image';
        } else if (type.includes('pdf')) {
            return 'pdf';
        } else if (type.includes('video')) {
            return 'video';
        } else if (type.includes('audio')) {
            return 'audio';
        } else if (type.includes('image')) {
            return 'image';
        } else if (type.includes('text')) {
            return 'text';
        }
    };

    const showThumbnail = (f: any, cb: Function) => {
            let reader = new FileReader();
            let type = f.type.split('/')[0];
            let ftype = figuretype(f.type);
	    let thumb;
	    let meta;
            switch (ftype) {
                case 'image':
                    console.log("Image detected");
                    var promise = pFileReader(f);
                    promise.then(function(result) {
                        meta = "Image";
                        let src = String(result);
         		thumb = [ '<img width = "125"',
                        'height = "125" src ="', 
			src,
                        '" title = "', f.name,
                        '" alt = "', f.name,
                        ' className = "w-12 h-12" / >'
                    ].join("");
		    cb(thumb, meta);
            
                    });
                   break;
                case 'pdf':
                    console.log("PDF detected");
                    var pdfURL = window.URL.createObjectURL(f);
                    meta = "PDF";
                    thumb = ['<object data="',pdfURL ,
			'" width="125px" height="125px"',
    	       		'type="application/pdf"></object>'
                        ].join("");
		    cb(thumb, meta);
                        break;
                 case 'audio':
                        console.log("Audio detected");
                        var audioUrl = window.URL.createObjectURL(f);
                        thumb = ['<audio className = "h-9 w-9" ',
			'controls><source src = "',
                                audioUrl,
                             '/>  </audio>'].join("");
			meta = "Audio file";
		    cb(thumb, meta);
                        break;
                 case 'video':
                        console.log("Video detected");
                        var videoUrl = window.URL.createObjectURL(f); 
                        thumb = ['<audio className = "h-9 w-9" ',
			'controls><source src = "',
                                videoUrl,
                             '/>  </audio>'].join("");
			meta = "Video file";
                        break;
                 case 'text':
                        console.log("Text detected"); reader.onload = function(e) {
                            let res = e.target && e.target.result;
                            if (res) {
                                let wc = wordCount(res);
                                meta = ` Chars : ${wc.chars} Words: ${wc.words} Lines: ${wc.lines} `;
                                let dataArray: any = res && String(res).split("\n");
                                dataArray = dataArray && dataArray.slice(0, 20);
                                if (dataArray) {
                                    let txt = dataArray.join("\n") as string;
                        let icon = fileTypes[type];

         		thumb = [ '<img width = "125"',
                        'height = "125" src ="', 
			icon,
                        '" title = "', txt,
                        '" alt = "', f.name,
                        ' className = "w-12 h-12" / >'
                    ].join("");
			cb(thumb, meta);
                                }
                            }
                        }; reader.readAsText(f);
                        break;
                  default:
                        console.log("Default [no detection]");
                        let fileIcon = fileTypes[type];
                        if (fileIcon == undefined) {
                            fileIcon = file;
                        }
                        meta = "Unknown file type";

         		thumb = [ '<img width = "125"',
                        'height = "125" src ="', 
			fileIcon,
                        '" title = "', txt,
                        '" alt = "', f.name,
                        ' className = "w-12 h-12" / >'
                    ].join("");
			cb(thumb, meta);
                    }
    };

const createBars = () => {
    console.log("createBars():: creating progress bars");
    const allBars: any = [];
    console.log("progress bars :: " +
        progressBars.length);
    console.log("infos:: " +
        uploadFileInfos.length);
    if (progressBars.length == uploadFileInfos.length) {
        console.log("Progress bars are drawn:: so returning");
        return;
    }
    if (uploadFileInfos) {
	console.log("Yes DOM updated, so drawing bars");
        for (let j = 0; j < uploadFileInfos.length; j++) {
            let id = 'a' + j;
            let bar = new ldBar('#' + id, {
                preset: inputs.progressType.toLowerCase()
            });
            bar.set(0);
            allBars.push(bar);
        }
        setProgress(allBars);
    }
};

const printBannedBanner = (file: File, id: string, size: string, ts: string,
    msg: string) => {

    showThumbnail(file, function(thumb: any, meta: string) {
        let errInfo = {
            file: file,
            meta: meta,
            thumb: thumb,
            size: size,
            id: id,
            txt: '',
            ts: ts,
            msg: msg
        };

        setErrInfos(prev => {
            const newState = [...prev];
            newState.push(errInfo);
            return newState;
        });
    });
};

const setupUpload = () => {
    let totalSize = 0;
    clearAll(undefined);
    console.log("SetupUpload():...");
    if (!uploadFileList) {
        return;
    }
    var delQ: number[] = [];
    for (var i = 0; i < uploadFileList.length; i++) {
        let f = uploadFileList && uploadFileList[i];
        let mime = f.type;
        let name = f.name;
        console.log("Checking " + name);
        let ts = new Date(f.lastModified).toLocaleDateString();
        let size = humanFileSize(f.size);
        let id = 'a' + i;
	totalSize += f.size;
        if (!checkFilter(mime)) {
            console.log("Hit banned file type:: filter issue");
            let msg = "{name} cannot be uploaded due to policy.";
            printBannedBanner(f, id, size, ts, msg);
            delQ.push(i);
            continue;
        }
        if (!checkSize(f.size)) {
             console.log("Size check:: size is " + f.size);
             let msg = "{name} too big for upload";
             console.log(msg);
             printBannedBanner(f, id, size, ts, msg);
             delQ.push(i);
            continue;
        }
	if (uploadFileInfos && i == uploadFileList.length - 1) {
		console.log("Total size check:: total size is " +
		  totalSize) ;
		if (!checkTotalSize(totalSize)) {
			let msg = `Total size exceeds policy, delete some`;
			setBut(true);
		}
	}
        setSize(prev => prev + f.size);
        setNumberFiles(prev => prev + 1);
    } // XXX for loop 

  var tmpFileList = Array.from(uploadFileList).filter(function(value, index) {
                return delQ.indexOf(index) == -1;
            });
	    console.log(tmpFileList);
            for (var i = 0; i < tmpFileList.length; i++) {
                let f = tmpFileList[i];
                let mime = f.type;
                let name = f.name;
                let ts = new Date(f.lastModified).toLocaleDateString();
                let size = humanFileSize(f.size);
                let id = 'a' + i;
          
        showThumbnail(f,
            function(thumb: any, meta: string) {
                let fInfo = {
                    file: f,
                    id: id,
                    size: size,
                    thumb: thumb,
                    meta: meta,
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
           });
    } // XXX for loop 

    setBut(false);
    console.log("SetupUpload():... done");
};

const delItem = (index: number) => {
    let s: number;
    console.log(uploadFileInfos);
    s = uploadFileInfos[index].file.size;
    s = totalsize - s;
    setSize(s);
    uploadFileInfos && uploadFileInfos.splice(index, 1);
    setFileInfos(uploadFileInfos);
    checkTotalSize(totalsize);
};

return ( <Fragment>

<section className="dark:bg-gray-800 dark:text-white">


<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/images/progress-up-logo.svg" width="100" height="100" alt="Progress.Up HTML5 logo" />

<h1 className="flex justify-center text-5xl">  Progress-up HTTPS Uploader </h1>

<h3 className="flex justify-center text-xl mb-4 pb-4">
	React edition 
</h3>



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
    {(inputs.uploadURL.length < 3) && (inputs.filesName.length < 3) ? (
		<h2 className="leading-tight pb-2">
	Please configure first
		</h2>
      ) : (
		<h2 className="leading-tight pb-2">
	&#128202; Progress type <span
className='text-sm'>{inputs.progressType}</span>  
		<br/>
			 &#128228; Upload URL <span
className='text-sm'>{inputs.uploadURL}</span> 
		<br/>
		&#128218; FilesName <span
className='text-sm'>{inputs.filesName}</span>
		</h2>
      )}

	</div>

	<div className="flex justify-end">
	<button disabled={isUploadDisabled} onClick={uploadAll} className={"inline-block px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium leading-tight rounded shadow-md text-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out mr-4  " +  (isUploadDisabled ? " opacity-50" : "")}>Begin Upload
	</button>
	
	<button type="button" onClick={clearAll} className={"inline-block px-6 py-2.5 bg-orange-500 text-md text-dark dark:text-white font-medium  leading-tight rounded shadow-md hover:bg-orange-600 hover:shadow-lg focus:bg-orange-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-orange-700 active:shadow-lg transition duration-150 ease-in-out"}>
	 Reset form
	</button>
	</div>

	  	 
  	 <h3 className="text-red-500 text-3xl">
		{errMsg}
	</h3>



  </div>


<div className={openTab === 2 ? "block" : "hidden"} id="link2">


	<h2>File upload config</h2>
	   <form className="w-full max-w-lg">
	     <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
	         <label className="block tracking-wide text-dark-700 text-xs
	   font-bold mb-2" htmlFor="uploadURL">
	          POST endpoint  
	         </label>
	         <input name="uploadURL" defaultValue={inputs.uploadURL} 
        onChange={handleChange}
className="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	   focus:outline-none focus:bg-light" type="text"
	   placeholder="URL to post [cross origin or absolute URL needs
CORS]" />
	         <p className="text-red-500 text-xs italic">Please fill out field.</p>
	       </div>
	   
	       <div className="w-full md:w-1/2 px-3">
	         <label className="block tracking-wide text-dark-700 text-xs
	   font-bold mb-2" htmlFor="filesName">
	   	Name of files input field
	         </label>
	         <input name="filesName" defaultValue={inputs.filesName} onChange={handleChange} id='filesName' className="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	    type="text" placeholder="Name of files input field" />
	       </div>
	      </div>
	   
	     <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full px-3">
	         <label className="block tracking-wide text-dark-700 text-xs
	   font-bold mb-2" htmlFor="progType">
	           Progress indicator type
	         </label>
	         <div className="relative">
	           <select name="progressType" onChange={handleChange}
defaultValue={inputs.progressType} className="block appearance-none w-full bg-gray-200 border
	   border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	   >
	   			<option>Fan</option>
	   			<option>Bubble</option>
	   			<option>Energy</option>
	   			<option>Rainbow</option>
	   			<option>Stripe</option>
	   			<option>Text</option>
	   			<option>Circle</option>
	   			<option>Line</option>
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
  <input name="sizeLimitType" value={inputs.sizeLimitType}
onChange={toggleSizeQ}

 type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
  <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1
bg-blue-600 rounded-full duration-300 ease-in-out peer-checked:bg-yellow-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
</label>
	</div>
	</div>
	      <div className="flex flex-wrap -mx-3 mb-6">
	       <div className="w-full px-3">
	         <label className="block tracking-wide text-dark-700 text-xs
	   font-bold mb-2" htmlFor="fileTypeFilter">
	          File type Filters 
	         </label>
	         <div className="relative">
	           <select name="fileTypeFilter"
onChange={handleChange} defaultValue={inputs.fileTypeFilter}
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
  <input name='fileTypeAction' onChange={toggleFilterQ}

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
	         <input name='authEnabled' onChange={needsAuth}
checked={inputs.authEnabled || false} className="mr-2 leading-tight" type="checkbox" />
	       </label>
	      </div>
	     </div>
	   
      {authEnabled &&
             <div id='progress-up-authsection' >
	        <div className="flex flex-wrap -mx-3 mb-6">
	          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label className="block tracking-wide
text-dark-700 text-xs font-bold mb-2" htmlFor="authType">
	              Auth type
	            </label>
	            <div className="relative">
	              <select name='authType' onChange={setAuth} value={inputs.authType || ""} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-light focus:border-gray-500" >
	                <option>HTTP basic auth</option>
	                <option>HTTP digest auth</option>
	              </select>
	       
	              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	              </div>
	            </div>
	          </div>
	      
	          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label className="block tracking-wide text-dark-700 text-xs
	      font-bold mb-2" htmlFor="user">
	             Username  
	            </label>
	            <input name='user' value={inputs.user || ""} onChange={handleChange} className="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	      focus:outline-none focus:bg-light"  type="text"
	      placeholder="username" />
	            <p className="text-red-500 text-xs italic">Please fill out field.</p>
	          </div>
	      
	          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label className="block tracking-wide text-dark-700 text-xs
	      font-bold mb-2" htmlFor="pass">
	      	Password
	            </label>
	            <input name='pass' value={inputs.pass || ""} onChange={handleChange} className="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	      focus:outline-none focus:bg-light focus:border-gray-500"
	       type="password" placeholder="Password" />
	          </div>
	         </div>
 	   </div>
      }
	   <button type="button" onClick={saveConfig} className="inline-block px-6
	py-2.5 bg-red-600 text-dark dark:text-white font-medium text-xs leading-tight 
	rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700
	focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800
	active:shadow-lg transition duration-150 ease-in-out">Save</button>
	   
	   <button type="button" onClick={testEP} className="inline-block
px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs
leading-tight rounded shadow-md hover:bg-blue-500
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
	          <tbody>

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
font-medium text-dark-900">Progress type</td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select option </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The progress indicator one of 
	   			Fan
	   			Bubble
	   			Energy
	   			Rainbow
	   			Stripe
	   			Text
	   			Circle
	   			Line

</td>
		   </tr>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">File size limit </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Input range (integer) </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The max file size in MB</td>
		   </tr>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">File size limit type</td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Slide toggle </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The limit is either per file or total</td>
		   </tr>


	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">File MIME type filter</td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select dropdown </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The file types allowed/denied
One of 
- PDF only
- Image only
- Video only
- Audio only
- Zip only
- Text only

</td>
</tr>

	            <tr className="bg-light-100 border-b">
	              <td className="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Filter action </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Slide toggle </td>
	              <td className="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The filter is either allow/deny</td>
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


     </div>
   </div>
</div>


<div id="progress-up-progressArea"> 
  {uploadFileInfos.length > 0
  ? (
  uploadFileInfos.map(({file, id, size, thumb, meta, ts, bytesSent, rate, eta}, index) => (

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
      		<div
      dangerouslySetInnerHTML={{__html: thumb}}></div>
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
      	    Size: {size} 
      	    </li>
       	    <li className="font-light leading-relaxed text-gray-800
dark:text-white">
	    Metadata: {meta}
      	    </li>
      	    <li className="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
		<span>{bytesSent} of {size} uploaded  {rate} MB/s ETA {eta} s</span>
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
  errInfos.map(({file, ts, thumb, meta, msg}, index) => (
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
      		<div
      dangerouslySetInnerHTML={{__html: thumb}}></div>
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
