
<script>import { openTab, inputs } from './store.js';
let sizeLabel = "Single file limit";
let filterLabel = "Allow file type";
let authEnabled = false;
let fileTypeFilter = "All";
const applyFilter = () => {
    console.log($inputs);
    let filt = fileTypeFilter;
    let action;
    if (filterLabel === "Allow file type") {
        action = "allow";
    }
    else {
        action = "deny";
    }
    console.log("Setting:: mime " + filt + " action " + action);
    switch (filt) {
        case "All":
            break;
        case "PDF only":
            $inputs.filtFiles = {
                "type": "application/pdf",
                "action": action
            };
            break;
        case "Image only":
            $inputs.filtFiles = {
                "type": "image",
                "action": action
            };
            break;
        case "Video only":
            $inputs.filtFiles = {
                "type": "video",
                "action": action
            };
            break;
        case "Audio only":
            $inputs.filtFiles = {
                "type": "audio",
                "action": action
            };
            break;
        case "Zip only":
            $inputs.filtFiles = {
                "type": "application/zip",
                "action": action
            };
            break;
        case "Text only":
            $inputs.filtFiles = {
                "type": "text",
                "action": action
            };
            break;
        default:
            console.log("Filter not understood");
            break;
    }
    console.log("Setting:: " + $inputs.filtFiles.type);
    console.log("Setting:: " + $inputs.filtFiles.action);
};
const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    applyFilter();
};
const needsAuth = (event) => {
    enableAuth(event.target.checked);
};
const saveConfig = () => {
    console.log($inputs);
    console.log($inputs.uploadURL);
    console.log($inputs.filesName);
    console.log($inputs.progressType);
    if ($inputs.authEnabled) {
        console.log($inputs.authType);
        console.log($inputs.user, inputs.pass);
    }
    console.log($inputs.fileSizeLimit);
    console.log($inputs.sizeLimitType);
    console.log(fileTypeFilter);
    console.log($inputs.fileTypeAction);
    $openTab = 1;
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
const setAuth = (event) => {
    let auth = event.target.value;
    setAuthType(auth);
    console.log(auth);
};
const setIndicator = (event) => {
    let ind = event.target.value;
    ind = ind.toLowerCase();
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
const toggleSizeQ = () => {
    let val = $inputs.sizeLimitType;
    if (val) {
        sizeLabel = "Total limit";
    }
    else {
        sizeLabel = "Single file limit";
    }
    applyFilter();
};
const toggleFilterQ = () => {
    let val = $inputs.fileTypeAction;
    if (val) {
        filterLabel = "Deny file type";
    }
    else {
        filterLabel = "Allow file type";
    }
};
</script>

	<h2>File upload config</h2>
	   <form class="w-full max-w-lg">
	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="inputs.uploadURL">
	          POST endpoint  
	         </label>
	         <input name="inputs.uploadURL" bind:value={$inputs.uploadURL} 
        on:change={handleChange}
class="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	   focus:outline-none focus:bg-light" type="text"
	   placeholder="URL to post [cross origin or absolute URL needs
CORS]" />
	         <p class="text-red-500 text-xs italic">Please fill out field.</p>
	       </div>
	   
	       <div class="w-full md:w-1/2 px-3">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progress-up-filesName">
	   	Name of files input field
	         </label>
	         <input name="inputs.filesName" bind:value={$inputs.filesName} on:change={handleChange} id='filesName' class="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	    type="text" placeholder="Name of files input field" />
	       </div>
	      </div>
	   
	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progType">
	           Progress indicator type
	         </label>
	         <div class="relative">
	           <select name='progressType' on:change={setIndicator}
bind:value={$inputs.progressType} class="block appearance-none w-full bg-gray-200 border
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
	           <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	             <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	           </div>
	         </div>
	       </div>
	      </div>
	
	
	      <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">
<label class="relative flex justify-between items-center p-2 text-xl"
for="fileSizeLimit" />
<span>File Size Limit (MB)</span>
  <input name="fileSizeLimit" bind:value={$inputs.fileSizeLimit}
on:change={handleChange} class="m-6 p-6 form-range" type="range"
 min="10" max="1000" step="10" 
 />                      
<output id="sizeLimit" name="sizeLimit"
for="fileSizeLimit">{$inputs.fileSizeLimit}</output>
	</div>
	</div>

	      <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">

<label class="relative flex justify-between items-center p-2 text-xl"
for="sizeToggle" >
<span>{sizeLabel}</span>
  <input name="inputs.sizeLimitType" bind:value={$inputs.sizeLimitType}
on:change={toggleSizeQ}

 type="checkbox" class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
  <span class="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1
bg-blue-600 rounded-full duration-300 ease-in-out peer-checked:bg-yellow-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
</label>
	</div>
	</div>



	      <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progress-up-indicator">
	          File type Filters 
	         </label>
	         <div class="relative">
	           <select name="fileTypeFilter"
on:change={handleChange} id="fileTypeFilter" bind:value={fileTypeFilter}
 class="block appearance-none w-full bg-gray-200 border
	   border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	   >
	   			<option value="All" >All</option>
	   			<option value="PDF only" >PDF only</option>
	   			<option value="Image only">Image only</option>
	   			<option value="Video only">Video only</option>
	   			<option value="Audio only">Audio only</option>
	   			<option value="Zip only">Zip only</option>
	   			<option value="Text only">Text only</option>
	           </select>
	           <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	             <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	           </div>
	         </div>
	       </div>
	      </div>

<label class="relative flex justify-between items-center p-2 text-xl"
for="filterAction" >
<span>{filterLabel}</span>
  <input name='inputs.fileTypeAction' on:change={toggleFilterQ}

type="checkbox" class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
  <span class="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1
bg-green-600 rounded-full duration-300 ease-in-out peer-checked:bg-red-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
</label>

	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">
	       <label class="md:w-2/3 block text-dark-500 font-bold">
	         <span class="text-sm">
	           HTTP Auth required?
	         </span>
	         <input name='inputs.authEnabled' on:change={needsAuth}
checked={inputs.authEnabled || false} class="mr-2 leading-tight" type="checkbox" />
	       </label>
	      </div>
	     </div>
	   
      {#if authEnabled}
             <div id='progress-up-authsection' >
	        <div class="flex flex-wrap -mx-3 mb-6">
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide
text-dark-700 text-xs font-bold mb-2" for="authType">
	              Auth type
	            </label>
	            <div class="relative">
	              <select id='authType' on:change={setAuth}
bind:value={$inputs.authType} class="block appearance-none w-full bg-gray-200 border border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-light focus:border-gray-500" >
	                <option>HTTP basic auth</option>
	                <option>HTTP digest auth</option>
	              </select>
	       
	              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	              </div>
	            </div>
	          </div>
	      
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2" for="user">
	             Username  
	            </label>
	            <input name='inputs.user' bind:value={$inputs.user}
on:change={handleChange} class="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	      focus:outline-none focus:bg-light"  type="text"
	      placeholder="username" />
	            <p class="text-red-500 text-xs italic">Please fill out field.</p>
	          </div>
	      
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2" for="progress-up-pass">
	      	Password
	            </label>
	            <input name='inputs.pass' bind:value={$inputs.pass} on:change={handleChange} class="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	      focus:outline-none focus:bg-light focus:border-gray-500"
	       type="password" placeholder="Password" />
	          </div>
	         </div>
 	   </div>
     {/if} 
	   
	   <button type="button" on:click={saveConfig} class="inline-block px-6
	py-2.5 bg-red-600 text-dark dark:text-white font-medium text-xs leading-tight uppercase
	rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700
	focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800
	active:shadow-lg transition duration-150 ease-in-out">Save</button>
	   
	   <button type="button" on:click={testEP} class="inline-block
px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs
leading-tight uppercase rounded shadow-md hover:bg-blue-500
hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none
focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150
ease-in-out" >
	    Test file upload
	   </button>
	   </form>



