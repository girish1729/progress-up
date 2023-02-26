<script>let progressTypes = "https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/images/progress-types.png";
</script>

    <div class="flex flex-col">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
	 <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
	    <div class="overflow-hidden">

	        <table class="min-w-full">
	          <thead class="bg-light border-b">
	            <tr>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	               Param
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Type
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Description
	              </th>
	            </tr>
	          </thead>
	          <tbody>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">uploadURL</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> String </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The absolute/relative path of HTTP POST
endpoint </td>
		   </tr>


	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">filesName</td>
	              <td class="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The name of files configured in backend </td>
		   </tr>

		   <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Progress type</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select option </td>
	              <td class="text-sm text-dark-900 font-light px-6
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

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">File size limit </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Input range (integer) </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The max file size in MB</td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">File size limit type</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Slide toggle </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The limit is either per file or total</td>
		   </tr>


	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">File MIME type filter</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select dropdown </td>
	              <td class="text-sm text-dark-900 font-light px-6
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

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Filter action </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Slide toggle </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The filter is either allow/deny</td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">HTTP auth </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Checkbox </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Enable it if your backend requires auth</td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">HTTP auth type</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select option </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Choose one of Digest/Basic HTTP auth </td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Auth username</td>
	              <td class="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Username configured in backend for auth </td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Password</td>
	              <td class="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Password configured in backend for auth </td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Progress Indicator</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select option</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> See below for possible options </td>
		   </tr>
		   </tbody>
	        </table>
	      </div>
	    </div>
	  </div>
	</div>

