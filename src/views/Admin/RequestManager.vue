<template>
  <h1>Request Manager View</h1>
  {{ UID }}
</template>

<script>
export default {
	name: "Request Manager",
	params: ['UID'],
	data() {
		return {
			UID: null
		}
	},
	beforeMount() {
		this.UID = this.$route.params.UID
	}
}
</script>