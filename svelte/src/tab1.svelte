<script>
  let isDragActive = false;

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
 	



