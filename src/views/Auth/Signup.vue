<template>
	<div class="container box mt-4">
		<h1>Sign Up</h1>

		<br>

		<label for="email" class="form-label">
			<span style="color: red">*</span>
			Email Address
		</label>
		<input type="email" name="email" class="form-control" id="email" placeholder="Enter Email Address" v-model="email">

		<br>

		<label for="username" class="form-label">
			<span style="color: red">*</span>
			Username
		</label>
		<input type="text" name="username" class="form-control" id="username" placeholder="Enter Username" v-model="username">

		<br>

		<div class="row">
			<div class="col">
				<label for="firstName" class="form-label">
					<span style="color: red">*</span>
					First Name
				</label>
				<input type="text" name="firstName" class="form-control" id="firstName" placeholder="Enter First Name" v-model="firstName">
			</div>

			<div class="col">
				<label for="lastName" class="form-label">
					<span style="color: red">*</span>
					Last Name
				</label>
				<input type="text" name="lastName" class="form-control" id="lastName" placeholder="Enter Last Name" v-model="lastName">
			</div>
		</div>

		<br>

		<div class="row">
			<div class="col">
				<label for="paassword" class="form-label">
					<span style="color: red">*</span>
					Password
				</label>
				<input type="password" name="password1" class="form-control mb-1" id="password" placeholder="Enter Password" v-model="password1">
			</div>

			<div class="col">
				<label for="paassword" class="form-label">
					<span style="color: red">*</span>
					Confirm Password
				</label>
				<input type="password" name="password2" class="form-control mb-1" id="password2" placeholder="Confirm Password" v-model="password2">
			</div>
		</div>

		<Alert v-if="alertMessage && alertType" class="mt-3" :type="alertType" :message="alertMessage" />

		<p style="color: red; float: right" class="mt-4">* - Required fields</p>

		<a href="#" class="btn btn-primary mt-3" @click="signup">Sign Up</a>
	</div>
</template>

<script>
import { firestore, auth } from '../../firebase/config'

import Alert from '../../components/Alert.vue'
import { def } from '@vue/shared'

export default {
	name: "Signup",
	components: { Alert },
	data() {
		return {
			email: "",
			username: "",
			firstName: "",
			lastName: "",
			password1: "",
			password2: "",
			alertMessage: "",
			alertType: ""
		}
	},
	methods: {
		signup() {
			console.log(`Email: ${this.email}\nUsername: ${this.username}\nName: ${this.firstName} ${this.lastName}\nPassword: ${this.password1} ${this.password2}`)

			if (
				this.email.length == 0 ||
				this.username.length == 0 ||
				this.firstName.length == 0 ||
				this.lastName.length == 0 ||
				this.password1.length == 0 ||
				this.password2.length == 0
			) {
				this.alertMessage = "All fields must be filled!"
				this.alertType = "Warning"
				return
			}

			if (this.username.length < 4) {
				this.alertMessage = "The minimum username length is 4!"
				this.alertType = "Warning"
				return
			}

			if (this.password1.length < 6) {
				this.alertMessage = "The minimum password length is 6!"
				this.alertType = "Warning"
				return
			}

			if (this.password1 != this.password2) {
				this.alertMessage = "Passwords do not match!"
				this.alertType = "Warning"
				return
			}

			firestore.collection("users").get()
				.then(querySnapshot => {
					querySnapshot.forEach(docRef => {
						const data = docRef.data()

						if (data.Username == this.username) {
							this.alertMessage = "Username is already in use!"
							this.alertType = "Error"
							return
						}
					})
				})
				.catch(error => {
					console.error(`Error: ${error.code}\n${error.message}`)
				})

			auth.createUserWithEmailAndPassword(this.email, this.password1)
				.then(userCredintial => {
					console.log(userCredintial.user)

					firestore.collection("users").doc(userCredintial.user.uid).set({
						UID: userCredintial.user.uid,
						Username: this.username,
						FirstName: this.firstName,
						LastName: this.lastName,
						Role: "Viewer",
						Approved: false,
						RegisteredOn: Date.now()
					})
						.then(docRef => {
							console.log(`User successfully added to database with ID: ${userCredintial.user.uid}`)
						})
						.catch(error => {
							console.error(`Error: ${error.code}\n${error.message}`)

							this.alertMessage = error.message
							this.alertType = "Error"

							return
						})

					this.$router.push({ name: "Index" })
				})
				.catch(error => {
					console.error(`Error: ${error.code}\n${error.message}`)

					switch (error.code) {
						case "auth/user-not-found":
							this.alertMessage = "User not found or invalid credintials given!"
							this.alertType = "Error"
							break
						case "auth/invalid-email":
							this.alertMessage = "Please enter a valid email address!"
							this.alertType = "Error"
							break
						case "auth/email-already-in-use":
							this.alertMessage = "The email address is already in use!"
							this.alertType = "Error"
							break
						default:
							this.alertMessage = `Unknown error occured! (${error.code})`
							this.alertType = "Error"
					}
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