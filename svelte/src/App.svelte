<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js" ></script>
	<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" ></script>
	<script  src="https://cdn.jsdelivr.net/npm/pdfobject@2.2.8/pdfobject.min.js" ></script>
</svelte:head>
<!--
	<script context="module" src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/progressBar/loading-bar.js" ></script>
-->
<script lang='ts'>

let darkMode = false;
let openTab = 1;


   function toggle() {
        darkMode = !darkMode;
        window.document.body.classList.toggle('dark');
    }

type statsTableType = {
    id: number;
    ts: string;
    status: string;
    details: string;
};

type fileInfo = {
    file: File;
    id: string;
    ts: string;
    thumb: string;
    meta: string;
    bytesSent: string;
    rate: string;
    eta: string;
};

type errInfo = {
    file: File;
    id: string;
    ts: string;
    thumb: string;
    meta: string;
    msg: string;
};


    let uploadFileList: any = [];
    let uploadFileInfos: fileInfo[] = [];
    let errInfos: errInfo[] = [];
    let disableUpload = true;
    let thumbNailsDone = false;
    let isDragged = false;

    let progressBars: any[] = [];
    let details = '';
    let statsTable: statsTableType[] = [];

 
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


/*

const showThumbnail = (f:fileInfo, i: number) => {
        let id = 'a' + i;
        let target = id + '-thumb';
	let self = this;
	let type = f.file.type.split('/')[0];
        switch (true) {
            case /text/.test(f.file.type):
                console.log("Text type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let res:any;
			if(e.target) {
                        	res = e.target.result;
			}
                        let wc = self.wordCount(res);
                        f.meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
			`;
                        var dataArray = (<string>res).split("\n");
                        dataArray = dataArray.slice(0, 20);
                        let txt = dataArray.join("\n");

                        var fileIcon = self.fileTypeIcons[type];
                        let pic = "src/assets/icons/filetypes/" +
                            fileIcon;
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                txt,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join('');

                    };
                })(f.file);
                reader.readAsText(f.file);
                break;
            case /image/.test(f.file.type):
                console.log("Image type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let pic:any;
			if(e.target) {
                        	pic = e.target.result;
			}
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                locf.name,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join(''); 
                            f.meta = locf.name;
                    };
                })(f.file);
                reader.readAsDataURL(f.file);
                break;
            case /audio/.test(f.file.type):
                console.log("Audio type detected");
                var audioUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<audio controls class="h-9 w-9" width="125" height="125"> ',
		    '<source src="',
                    audioUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </audio> />'
                ].join('');
                f.meta = f.file.name;
                break;
            case /video/.test(f.file.type):
                console.log("Video type detected");
                var videoUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<video controls class="h-9 w-9" width="125" height="125">',
		    '<source src="',
                    videoUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </video> />'
                ].join('');
                f.meta = f.file.name;
                break;
            case /pdf/.test(f.file.type):
                console.log("PDF type detected");
                var pdfURL = window.URL.createObjectURL(f.file);
                f.meta = f.file.name;
                PDFObject.embed(pdfURL, target);
                break;
            default:
                console.log("default type detected");
                var fileIcon = this.fileTypeIcons[type];
                if (fileIcon == undefined) {
                    fileIcon = "file.svg";
                }
                f.meta = f.file.name;
                let pic = "src/assets/icons/filetypes/" + fileIcon;
                f.thumb = [
                    '<img width="125" height="125" src=',
                    pic,
                    '" title="',
                    f.file.name,
		    '" alt="',
                    f.file.name,
                    '" class="w-12 h-12" />'
                ].join('');
                break;
        }
    };

    const showErrThumbnail = (f:errInfo, i: number) => {
        let id = 'a' + i;
        let target = id + '-thumb';
	let self = this;
	let type = f.file.type.split('/')[0];
        switch (true) {
            case /text/.test(f.file.type):
                console.log("Text type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let res:any;
			if(e.target) {
                        	res = e.target.result;
			}
                        let wc = self.wordCount(res);
                        f.meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
			`;
                        var dataArray = (<string>res).split("\n");
                        dataArray = dataArray.slice(0, 20);
                        let txt = dataArray.join("\n");

                        var fileIcon = self.fileTypeIcons[type];
                        let pic = "src/assets/icons/filetypes/" +
                            fileIcon;
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                txt,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join('');

                    };
                })(f.file);
                reader.readAsText(f.file);
                break;
            case /image/.test(f.file.type):
                console.log("Image type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let pic:any;
			if(e.target) {
                        	pic = e.target.result;
			}
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                locf.name,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join(''); 
                            f.meta = locf.name;
                    };
                })(f.file);
                reader.readAsDataURL(f.file);
                break;
            case /audio/.test(f.file.type):
                console.log("Audio type detected");
                var audioUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<audio controls class="h-9 w-9" width="125" height="125"> ',
		    '<source src="',
                    audioUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </audio> />'
                ].join('');
                f.meta = f.file.name;
                break;
            case /video/.test(f.file.type):
                console.log("Video type detected");
                var videoUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<video controls class="h-9 w-9" width="125" height="125">',
		    '<source src="',
                    videoUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </video> />'
                ].join('');
                f.meta = f.file.name;
                break;
            case /pdf/.test(f.file.type):
                console.log("PDF type detected");
                var pdfURL = window.URL.createObjectURL(f.file);
                f.meta = f.file.name;
                PDFObject.embed(pdfURL, target);
                break;
            default:
                console.log("default type detected");
                var fileIcon = this.fileTypeIcons[type];
                if (fileIcon == undefined) {
                    fileIcon = "file.svg";
                }
                f.meta = f.file.name;
                let pic = "src/assets/icons/filetypes/" + fileIcon;
                f.thumb = [
                    '<img width="125" height="125" src=',
                    pic,
                    '" title="',
                    f.file.name,
		    '" alt="',
                    f.file.name,
                    '" class="w-12 h-12" />'
                ].join('');
                break;
        }
    };

    const createBars = () => {
        if (!this.thumbNailsDone) {
            return;
        }
        this.progressBars = [];
        for (var i = 0; i < this.uploadFileInfos.length; i++) {
            let f = this.uploadFileInfos[i];
            let id = 'a' + i;
            let bar = new ldBar('#' + id, {
                preset: this.form.progType.toLowerCase()
            });
            bar.set(0);
            console.log("Creating progress bar::" + id);
            this.progressBars.push(bar);
            this.showThumbnail(f, i);
        }
        for (var i = 0; i < this.errInfos.length; i++) {
            let f = this.errInfos[i];
            this.showErrThumbnail(f, i);
        }
        this.thumbNailsDone = false;
    };

    const printBannedBanner = (file:File, id: string, ts:string,
msg:string)  => {
        this.errInfos.push({
            file: file,
            id: id,
            meta: '',
            thumb: '',
            ts: ts,
            msg: msg
        });
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

*/
import Tab1 from './tab1.svelte';
import Tab2 from './tab2.svelte';
import Tab3 from './tab3.svelte';
import Tab4 from './tab4.svelte';
</script>



<main class="dark:bg-gray-800 dark:text-white mx-auto w-full">
<!-- Dark mode controls -->
<div class="flex justify-end items-center space-x-2 mx-auto relative">
  <div class="w-14 h-8">

  <label for="dark-mode" class="w-full h-full rounded-full p-1 flex justify-between cursor-pointer">
    <span class="hidden dark:inline">&#127774;</span>
    <span class="inline dark:hidden">&#127769; </span>
  </label>
  <input type="checkbox" id="dark-mode" class='hidden' on:change={toggle} />
  </div>
</div>


<div class="bg-light p7 rounded w-9/12 mx-auto">
  <ul id="tabs" class="inline-flex pt-2 px-1 w-full border-b">

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
              <a on:click={() => openTab = 1} class={ (openTab === 1 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
	File upload</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
              <a on:click={() => openTab = 2} class={ (openTab === 2 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              > Setup</a>
    </li> 

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">

              <a on:click={() => openTab = 3} class={ (openTab === 3 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
	Statistics</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">

              <a on:click={() => openTab = 4} class={ (openTab === 4 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
	Help</a>
    </li>

  </ul>

<div id="tab-contents">
 <div class={openTab === 1 ? "block" : "hidden"} id="link1">
		<Tab1></Tab1>
  </div>

 <div class={openTab === 2 ? "block" : "hidden"} id="link2">
		<Tab2></Tab2>
  </div>

 <div class={openTab === 3 ? "block" : "hidden"} id="link3">
		<Tab3></Tab3>
  </div>


 <div class={openTab === 4 ? "block" : "hidden"} id="link4">
		<Tab4></Tab4>
  </div>

 </div>
</div>
<!-- XXX tabs -->


<div id="progress-up-progressArea"> 
  {#each uploadFileInfos as info, id } 
    <section class="m-4 p-4 mt-4 mb-4 transition-colors
    text-light-100 dark:text-white mx-auto">
     <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
    border-gray-300 text-gray-600 dark:text-white relative">
    
      <div on:click={delItem(id)} title="Delete" class="absolute
    cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
    	<img width="25" height="25" src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/trash-icon.svg" />
      </div>
    
      <div class="flex flex-wrap -mx-2 mb-8">
          <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
             <div class="h-12 text-sm text-grey-dark flex items-left
    justify-left">

		<div  id="{info.id}-thumb">
	 {@html "info.thumb"}
		</div>
             </div>
          </div>
    
          <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
            <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
              <ul>
          	    <li  class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">
          	    Name: {info.file.name}
          	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">
          	    Date: {info.ts}
          	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">
          	    Type: {info.file.type}
          	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">
          	    Size: {info.file.size} 
          	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800 dark:text-white">
       	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
		    Metadata: {info.meta}
      	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800 dark:text-white">
		<span>{info.bytesSent} of {info.file.size} uploaded
{info.rate} MB/s ETA {info.eta} s</span>
          	    </li>
              </ul>
            </div>
           </div>
      </div>
          <div  class='ldBar bottom-0 right-0 pb-8' id="{info.id}" >
	   </div>
      </div>
    </section>
  {/each}
</div>

<div id="progress-up-errArea"> 
  {#each  errInfos as err,id } 
    <section class="bg-red-200 m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white">
 <div class="bg-red-600 dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">

    <div title="Removed from uploads" class="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
          <img width="25" height="25"
src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" />
    </div>

    <div class="flex flex-wrap -mx-2 mb-8">
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
		<div  id="{err.id}-thumb">
	  {@html "err.thumb"}
	</div>
         </div>
      </div>
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12  text-grey-dark flex items-left justify-left">
         <ul>
      	    <li  class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {err.file.name}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {err.ts}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {err.file.type}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {err.file.size} 
      	    </li>
       	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
		    Metadata: {err.meta}
      	    </li>

         </ul>
        </div>
       </div>
		{err.msg}
      </div>
     </div>
    </section>
  {/each}
</div>

</main>


