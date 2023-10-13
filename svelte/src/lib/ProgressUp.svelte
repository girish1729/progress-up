<script lang='ts'>
   import {openTab, totalsize, totalfiles, inputs, uploadFileList, uploadFileInfos, errInfos, progressBars, } from './store.js';

let darkMode = false;

    let disableUpload = true;
    let thumbNailsDone = false;
    let isDragged = false;
    let details = '';

   function toggle() {
        darkMode = !darkMode;
        window.document.body.classList.toggle('dark');
    }

 
 const checkTotalSize =() => {
        if ($inputs.sizeLimitType == "Total limit") {
            if ($totalsize <= ($inputs.fileSizeLimit * 1024 * 1024)) {
                return true;
            }
            return false;
        }
        return false;
    };

       const delItem = (index:number) => {
	let s:number;
	s = $uploadFileInfos[index].size;
        $totalsize -= s;
        $uploadFileInfos && $uploadFileInfos.splice(index, 1);
        checkTotalSize();
    };


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


<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/images/progress-up-logo.svg" width="100" height="100" alt="Progress.Up HTML5 logo" />

<h1 class="flex justify-center text-5xl">  Progress-up HTTPS Uploader </h1>

<h3 class="flex justify-center text-xl mb-4 pb-4">
	Svelte edition 
</h3>


<div class="bg-light p7 rounded w-9/12 mx-auto">
  <ul id="tabs" class="inline-flex pt-2 px-1 w-full border-b">

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
              <a on:click={() => $openTab = 1} class={ ($openTab === 1 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
	File upload</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
              <a on:click={() => $openTab = 2} class={ ($openTab === 2 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              > Setup</a>
    </li> 

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">

              <a on:click={() => $openTab = 3} class={ ($openTab === 3 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
	Statistics</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">

              <a on:click={() => $openTab = 4} class={ ($openTab === 4 ?  "bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px" : "px-4 text-dark-800 font-semibold py-2 rounded-t")}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
	Help</a>
    </li>

  </ul>

<div id="tab-contents">
 <div class={$openTab === 1 ? "block" : "hidden"} id="link1">
		<Tab1></Tab1>
  </div>

 <div class={$openTab === 2 ? "block" : "hidden"} id="link2">
		<Tab2></Tab2>
  </div>

 <div class={$openTab === 3 ? "block" : "hidden"} id="link3">
		<Tab3></Tab3>
  </div>


 <div class={$openTab === 4 ? "block" : "hidden"} id="link4">
		<Tab4></Tab4>
  </div>

 </div>
</div>
<!-- XXX tabs -->


<div id="progress-up-progressArea"> 
  {#each $uploadFileInfos as info, id } 
    <section class="m-4 p-4 mt-4 mb-4 transition-colors
    text-light-100 dark:text-white mx-auto">
     <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
    border-gray-300 text-gray-600 dark:text-white relative">
    
      <div on:click={() => delItem(id)} title="Delete" class="absolute
    cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
    	<img width="25" height="25" src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/trash-icon.svg" />
      </div>
    
      <div class="flex flex-wrap -mx-2 mb-8">
          <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
             <div class="h-12 text-sm text-grey-dark flex items-left
    justify-left">
		<div  id="{info.id}-thumb">
	 		{@html info.thumb }
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
          	    Size: {info.size} 
          	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800 dark:text-white">
       	    <li class="text-xl font-light leading-relaxed text-gray-800 dark:text-white">
		    Metadata: {info.meta}
      	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800 dark:text-white">
		<span>{info.bytesSent} of {info.size} uploaded
{info.rate} MB/s ETA {info.eta} s</span>
          	    </li>
              </ul>
            </div>
           </div>
      </div>
          <div  class='ldBar bottom-0 right-0 pb-8' id={info.id} >
	   </div>
      </div>
    </section>
  {/each}
</div>

<div id="progress-up-errArea"> 
  {#each  $errInfos as err,id } 
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
	  		{@html err.thumb}
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
		{@html err.msg}
      </div>
     </div>
    </section>
  {/each}
</div>

</main>


