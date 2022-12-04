<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/tus-js-client@latest/dist/tus.min.js" defer></script>

	<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
	<script src="https://cdn.jsdelivr.net/npm/pdfobject@2.2.8/pdfobject.min.js"
defer></script>

	<script type="module" src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/progressBar/loading-bar.js"
defer></script>

	<script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js" defer></script>

</svelte:head>


<script>
	import './assets/style.css';
	import Tab1 from './tab1.svelte';
	import Tab2 from './tab2.svelte';
	import Tab3 from './tab3.svelte';
	import Tab4 from './tab4.svelte';
</script>

<Tab1></Tab1>
<Tab2></Tab2>
<Tab3></Tab3>
<Tab4></Tab4>
