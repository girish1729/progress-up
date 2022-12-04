
<svelte:head>
<script
src="https://cdn.jsdelivr.net/npm/tus-js-client@latest/dist/tus.min.js"
defer></script>
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
<script
src="https://cdn.jsdelivr.net/npm/pdfobject@2.2.8/pdfobject.min.js"
defer></script>
<script type="module"
src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/progressBar/loading-bar.js"
defer></script>
<script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"
defer></script>
</svelte:head>


<script>
</script>

<section class="dark:bg-gray-800 dark:text-white">

<div class="flex justify-end items-center space-x-2 mx-auto relative">
  <div class="w-14 h-8">

  <label onClick={darkMode} htmlFor="dark-mode" class="w-full h-full rounded-full p-1 flex justify-between cursor-pointer">
    <span class="hidden dark:inline">&#127774;</span>
    <span class="inline dark:hidden">&#127769; </span>
  </label>

  <input  type="checkbox" name="darkMode" class='hidden' />
  </div>
</div>


<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/images/progress-up-logo.svg" width="100" height="100" alt="Progress.Up HTML5 logo" />

<h2 class="text-5xl leading-tight">  HTML5 Multiple File Upload with Progress Bar 
</h2>
	<h3 class="flex justify-center text-3xl text-gray-100 mb-4
pb-4">React plugin </h3>




<!-- XXX tabs -->
<div class="bg-light p7 rounded w-9/12 mx-auto">
  <!-- Tabs -->
  <ul id="tabs" class="inline-flex pt-2 px-1 w-full border-b">

    <li class="bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px">
	<a id="default-tab" href="#first">File upload</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#second">Setup</a>
    </li> 

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#third">Statistics</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#fourth">Help</a>
    </li>

  </ul>


<div id="tab-contents">

 <div class={openTab === 1 ? "block" : "hidden"} id="link1">
	<slot> <tab1 /> </slot>
<div class={openTab === 2 ? "block" : "hidden"} id="link2">
	<slot> <tab2 /> </slot>
<div class={openTab === 3 ? "block" : "hidden"} id="link3">
	<slot> <tab3 /> </slot>
 <div class={openTab === 4 ? "block" : "hidden"} id="link4">
	<slot> <tab4 /> </slot>
 </div>
</div>


<div id="progress-up-progressArea"> 
  {uploadFileInfos.length > 0
  ? (
  uploadFileInfos.map(({file,id, meta, ts, bytesSent, rate, eta}, index) => (

  <section key={file.name} class="m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white mx-auto">
    <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
border-gray-300 text-gray-600 dark:text-white relative">

  <div  onClick={() => delItem(index)} title="Delete" class="absolute
cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
	<img width="25" height="25" src={trashIcon} />
  </div>

  <div class="flex flex-wrap -mx-2 mb-8">
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left
justify-left">

      		<div id="{id}-thumb">{ showThumbnail(file, index) }</div>
        </div>
      </div>

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
          <ul>
      	    <li  class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {file.name}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {ts}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {file.type}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {file.size} 
      	    </li>
       	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
	    Metadata: {meta}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
		<span>{bytesSent} of {file.size} uploaded  {rate} MB/s ETA {eta} s</span>
      	    </li>
          </ul>
        </div>
       </div>
  </div>

      <div class='ldBar bottom-0 right-0 pb-8' id={id} ></div>

    </div>
  </section>
 ))
): <br/> }
</div>

<div id="progress-up-errArea"> 
  {errInfos.length > 0
  ? (
  errInfos.map(({file, thumb, ts, meta, msg}, index) => (
    <section key={file.name} class="bg-red-200 m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white">
 <div class="bg-red-600 dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">

    <div title="Removed from uploads" class="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
          <img width="25" height="25"
src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" />
    </div>

    <div class="flex flex-wrap -mx-2 mb-8">

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
      <div id="{id}-thumb" >{ showThumbnail(file, index) }</div>
         </div>
      </div>

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12  text-grey-dark flex items-left justify-left">
         <ul>
      	    <li  class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {file.name}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {ts}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {file.type}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {file.size} 
      	    </li>
       	    <li class="font-light leading-relaxed text-gray-800 dark:text-white">
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

