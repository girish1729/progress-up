<script setup>
</script>

<template>
  <uploadarea>
    <template #title>
     progress.up | HTML5 multiple file upload progress bar
    </template>
    <template #author>
	Girish Venkatachalam
    </template>
    <template #uploadform>
	<div class="wrapper">
	 <header>Progress.up file upload </header>
	 <div class='text-center'>
	   <button onClick="location.reload()" class="clearButton" role="button">Clear all</button>
	 </div>
	 <form action="#">
	      <input class="file-input" type="file" name="myFiles" multiple hidden>
	      <font-awesome-icon size="10x" icon="fa-solid fa-cloud-upload-alt" />
	      <p>Browse Files to Upload</p>
	 </form>
	 <section class="progress-area"></section>
	 <section class="uploaded-area"></section>
	</div>
    </template>

  </uploadarea>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
