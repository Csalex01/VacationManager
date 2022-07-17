<template>
	<div class="container box mt-4">
		<h1>Log In</h1>

		<br>

		<label for="email" class="form-label">Email Address</label>
		<input type="email" name="email" class="form-control" id="email" placeholder="Enter Email Address" v-model="email">

		<br>

		<label for="paassword" class="form-label">Password</label>
		<input type="password" name="password" class="form-control mb-1" id="password" placeholder="Enter Password" v-model="password">

		<a href="#" style="color: red; text-decoration: none">Reset Password</a>

		<br> <br>

		<a href="#" class="btn btn-primary" @click="login">Log In</a>
	</div>
</template>

<script>
import { auth } from '../../firebase/config'

export default {
	name: "Login",
	data() {
		return {
			email: null,
			password: null
		}
	},
	methods: {
		login() {
			auth.signInWithEmailAndPassword(this.email, this.password)
				.then(userCredintial => {
					console.log(`Logged in: ${userCredintial.user.uid}`)
					this.$router.push({ name: "Index" })
				})
				.catch(error => {
					console.error(`Error: ${error.code}\n${error.message}`)
				})
		}
	}
}
</script>

<style scoped>
.box {
	max-width: 500px;
}
</style>