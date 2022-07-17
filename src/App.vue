<template>
    <Navbar />

    <div class="container mt-3">
        <RouterView />
    </div>
</template>

<script>
// import { auth } from './firebase/config'

import Navbar from "./components/Navbar.vue"

export default {
	name: "App",
	components: { Navbar },
	created() {
		document.title = "Vacation Manager";
		// auth.onAuthStateChanged(user => {
		// 	if (user)
		// 		console.log(user.uid)
		// 	else
		// 		console.log("User not logged in!")
		// })
	}
}
</script>

<style scoped>
</style>
