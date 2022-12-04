<script>
  let isDragActive = false;

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

</script>

	<div id='progress-up-statsArea'>
		<h2 class="text-5xl leading-tight border-b">{details} </h2>
	</div>

	<div  class=" p-4 rounded mx-auto bg-light"> 
    	  <div class="{isDragActive ? 'bg-blue-400':'bg-light'} text-gold-400 border border-red-800 border-dashed
rounded cursor-pointer" >
	   <form class='flex p-8  justify-center'>
		<img class="stroke-white dark:bg-white" width="100" height="100"
src={uploadIcon} alt="progress-up file submit icon" />
	       <input  onChange={fileSelectFinish} {...getInputProps()} name="uploadFiles" type="file" multiple hidden />
	   </form>
	   <h2 class="flex justify-center text-dark-500 text-xl font-medium mb-2"> 
	     Drop files or click to select</h2>
	  </div>
	</div>


	<div id="config">

    {#if inputs.uploadURL || inputs.filesName}
		<h2 class="leading-tight pb-2">
	&#128202; Progress type <span
class='text-sm'>{progType}</span>  
			 &#128228; Upload URL <span
class='text-sm'>{inputs.uploadURL}</span> 
		&#128218; FilesName <span
class='text-sm'>{inputs.filesName}</span>
		</h2>
   {:else}
		<h2 class="leading-tight pb-2">
	Please configure first
		</h2>
  {/if}

	</div>

	<button disabled={isUploadDisabled} onClick={uploadAll} class={"inline-block px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out " +  (isUploadDisabled ? " opacity-20" : "")}
>Begin Uploading files </button>
	
	
	<button type="button" onClick={clearAll} class="inline-block
px-6 py-2.5 bg-yellow-500 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out">
	 Reset form
	</button>
 	



