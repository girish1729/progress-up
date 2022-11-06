<template>
 <div>
  <ProgressUp uploadURL='https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34' filesName="uploadFiles" />
 </div>
</template>

<script>
import ProgressUp from 'progress-up';

export default {
  name: 'App',
  components: {
    ProgressUp
  } 
}
</script>

