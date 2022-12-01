
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


