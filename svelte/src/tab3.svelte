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

   {#each statsTable as stat}
	            <tr key={stat.id} class="bg-gray-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-gray-900">{stat.id}</td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {stat.ts}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">

    {#if stat.status}
                <img src={successIcon} /> 
     {:else} 
                <img src={failureIcon} />
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



