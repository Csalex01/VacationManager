<template>
	<div class="container box mt-4">
		<h1>Log In</h1>
	
		<label for="email" class="form-label">
			<span style="color: red">*</span>
			Email Address
		</label>
		<input type="email" name="email" class="form-control" id="email" placeholder="Enter Email Address" v-model="email" required>
		<!-- <div v-if="alertMessage && alertType" style="color: red">ERROR MESSAGE</div> -->

		<br>

		<label for="paassword" class="form-label">
			<span style="color: red">*</span>
			Password
		</label>
		<input type="password" name="password" class="form-control mb-1" id="password" placeholder="Enter Password" v-model="password" required>
		<!-- <div v-if="alertMessage && alertType" style="color: red">ERROR MESSAGE</div> -->

		<div class="mt-2 mb-3">
			<a style="color: blue; text-decoration: none">Reset Password</a>
		</div>

		<Alert v-if="alertMessage && alertType" class="mt-3" :type="alertType" :message="alertMessage" />

		<p style="color: red; float: right" class="mt-4">* - Required fields</p>

		<a href="#" class="btn btn-primary mt-2" @click="login">Log In</a>

	</div>
</template>

<script>
import { auth } from '../../firebase/config'

import Alert from '../../components/Alert.vue'

export default {
	name: "Login",
	data() {
		return {
			email: "",
			password: "",
			alertMessage: null,
			alertType: null
		}
	},
	components: { Alert },
	methods: {
		login() {
			if (this.email.length == 0 || this.password.length == 0) {
				this.alertMessage = "All fields must be filled!"
				this.alertType = "Warning"
				return
			}

			auth.signInWithEmailAndPassword(this.email, this.password)
				.then(userCredintial => {
					// console.log(`Logged in: ${userCredintial.user.uid}`)
					this.$router.push({ name: "Index" })
				})
				.catch(error => {
					// console.error(`Error: ${error.code}\n${error.message}`)
					this.errorCode = error.code
					// console.log(this.errorCode)

					switch (error.code) {
						case "auth/user-not-found":
							this.alertMessage = "User not found or invalid credintials given!"
							this.alertType = "Error"
							break
						case "auth/invalid-email":
							this.alertMessage = "Please enter a valid email address!"
							this.alertType = "Error"
							break
						default:
							this.alertMessage = `Unknown error occured! (${error.code})`
							this.alertType = "Error"
					}

					console.log(this.alertMessage)
					console.log(this.alertType)
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