<template>
 <div>
  <ProgressUp />
 </div>
</template>

<script>
import ProgressUp from 'progress-up/vue';

export default {
  name: 'App',
  components: {
    ProgressUp
  }, 
  created() {
	console.log("ProgressUp created");
  },
  mounted() {
	console.log("ProgressUp mounted");
  }
}
</script>

