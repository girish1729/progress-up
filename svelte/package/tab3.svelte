<script>import { statsTable } from './store.js';
const spitStatistics = (idx) => {
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
        var id = $statsTable.length + 1;
        let stat = {
            id: id,
            ts: ts,
            status: status,
            details: details
        };
        let st = [...$statsTable];
        st.push(stat);
        setStats(st);
        setIsUploadDisabled(true);
        setProgress([]);
        setSize(0);
        setNumberFiles(0);
    }
};
</script>

      <h2> Statistics </h2>
	<div class="flex flex-col">
	  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
	    <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
	      <div class="overflow-hidden">
	        <table class="min-w-full">
	          <thead class="bg-light border-b">
	            <tr>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                #
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Time
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Status
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Details
	              </th>
	            </tr>
	          </thead>
	          <tbody id="progress-up-statsTable">

   {#each $statsTable as stat}
	            <tr key={stat.id} class="bg-gray-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-gray-900">{stat.id}</td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {stat.ts}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">

    {#if stat.status}
                <img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/success-icon.svg"
alt="Success icon" /> 
     {:else} 
                <img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg"
alt="Failure icon" />
      {/if}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {stat.details}
	              </td>
	            </tr>
 {/each}

		   </tbody>
	        </table>
	      </div>
	    </div>
	  </div>
	</div>



