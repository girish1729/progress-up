<template>
 <div>
  <ProgressUp uploadURL='http://localhost:2324/uploadmultiple' filesName="uploadFiles" />
 </div>
</template>

<script>
import ProgressUp from 'progress-up/vue';

export default {
  name: 'App',
  components: {
    ProgressUp
  } 
}
</script>

