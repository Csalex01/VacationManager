<template>
	<div class="container box mt-4">
		<h1>Sign Up</h1>

		<br>

		<label for="email" class="form-label">Email Address</label>
		<input type="email" name="email" class="form-control" id="email" placeholder="Enter Email Address" v-model="email">

		<br>

		<label for="username" class="form-label">Username</label>
		<input type="text" name="username" class="form-control" id="username" placeholder="Enter Username" v-model="username">

		<br>

		<div class="row">
			<div class="col">
				<label for="firstName" class="form-label">First Name</label>
				<input type="text" name="firstName" class="form-control" id="firstName" placeholder="Enter First Name" v-model="firstName">
			</div>

			<div class="col">
				<label for="lastName" class="form-label">Last Name</label>
				<input type="text" name="lastName" class="form-control" id="lastName" placeholder="Enter Last Name" v-model="lastName">
			</div>
		</div>

		<br>

		<div class="row">
			<div class="col">
				<label for="paassword" class="form-label">Password</label>
				<input type="password" name="password1" class="form-control mb-1" id="password" placeholder="Enter Password" v-model="password1">
			</div>

			<div class="col">
				<label for="paassword" class="form-label">Confirm Password</label>
				<input type="password" name="password2" class="form-control mb-1" id="password2" placeholder="Confirm Password" v-model="password2">
			</div>
		</div>

		<br>

		<a href="#" class="btn btn-primary" @click="signup">Sign Up</a>
	</div>
</template>

<script>
import { firestore, auth } from '../../firebase/config'

export default {
	name: "Signup",
	data() {
		return {
			email: null,
			username: null,
			firstName: null,
			lastName: null,
			password1: null,
			password2: null
		}
	},
	methods: {
		signup() {
			console.log(`Email: ${this.email}\nUsername: ${this.username}\nName: ${this.firstName} ${this.lastName}\nPassword: ${this.password1} ${this.password2}`)

			auth.createUserWithEmailAndPassword(this.email, this.password1)
				.then(userCredintial => {
					console.log(userCredintial.user)

					firestore.collection("users").doc(userCredintial.user.uid).set({
						UID: userCredintial.user.uid,
						Username: this.username,
						FirstName: this.firstName,
						LastName: this.lastName,
						Role: "Viewer",
						Approved: false
					})
						.then(docRef => {
							console.log(`User successfully added to database with ID: ${userCredintial.user.uid}`)
						})
						.catch(error => {
							console.error(`Error: ${error.code}\n${error.message}`)
						})

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