<template>
    <Navbar />

  <div class="container">
    <RouterView class="mt-2" />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue"

export default {
	name: "App",
	components: { Navbar },
	created() {
		document.title = "Vacation Manager";
	}
}
</script>

<style scoped>
</style>
