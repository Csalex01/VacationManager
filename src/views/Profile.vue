<template>
	<div class="container box">
		<h1>
			<i class="fa-solid fa-address-card"></i>
			Profile for {{ title }}
		</h1>

		<br>

		<label for="email" class="form-label">Email Address</label>
		<input type="email" name="email" class="form-control" id="email" placeholder="Email Address" v-model="email">

		<br>

		<label for="username" class="form-label">Username</label>
		<input type="text" name="username" class="form-control" id="username" placeholder="Username" v-model="username">

		<br>

		<div class="row">
			<div class="col">
				<label for="firstName" class="form-label">First Name</label>
				<input type="text" name="firstName" class="form-control" id="firstName" v-model="firstName">
			</div>

			<div class="col">
				<label for="lastName" class="form-label">Last Name</label>
				<input type="text" name="lastName" class="form-control" id="lastName" v-model="lastName">
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

		<div class="checkbox">
			<label class="form-label">
				<input type="checkbox" id="optionalEmail" class="me-3" v-model="optionalEmail">
				<span id="optionalEmailLabel">Receive E-mail notifications for changes. (Optional)</span>
			</label>
		</div>
		<br>

		<a href="#" class="btn btn-primary" @click="saveChanges">Save changes</a>

	</div>
</template>

<script>
import { firestore, auth } from '../firebase/config'

export default {
	name: "Profile",
	data() {
		return {
			user: null,
			loggedIn: false,
			email: null,
			username: null,
			firstName: null,
			lastName: null,
			password1: null,
			password2: null,
			title: null,
			optionalEmail: null
		}
	},
	beforeCreate() {
		auth.onAuthStateChanged(user => {
			if (user) {
				this.loggedIn = true

				const doc = firestore.collection("users").doc(user.uid)
				doc.get()
					.then(docRef => {
						if (docRef.exists) {
							// console.log(docRef.data())
							this.user = docRef.data()

							this.email = user.email
							this.username = this.user.Username
							this.firstName = this.user.FirstName
							this.lastName = this.user.LastName
							this.optionalEmail = this.user.OptionalEmail

							this.title = `${this.firstName} ${this.lastName} (${this.username})`
						}
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})
			} else
				this.$router.push({ name: "Index" })
		})
	},
	methods: {
		saveChanges() {
			const currentUser = auth.currentUser
			const doc = firestore.collection("users").doc(this.user.UID)

			currentUser.updateEmail(this.email)
				.then(() => {
					doc.update({
						Email: this.email
					})
						.then(() => console.log("Successfully updated email address!"))
				})
				.catch(error => {
					console.error(`Error: ${error.code}\n${error.message}`)
				})

			if (this.password1)
				currentUser.updatePassword(this.password1)
					.then(() => {
						console.log("Successfully updated password!")
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})

			doc.update({
				Username: this.username,
				FirstName: this.firstName,
				LastName: this.lastName,
				OptionalEmail: this.optionalEmail
			})
				.then(() => {
					console.log("Document updated successfully!")
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
	max-width: 1000px;
}

#optionalEmail {
	display: inline-block;
	width: 30px;
	height: 30px;
}

#optionalEmailLabel {
	display: inline-block;
	transform: translateY(-50%);
}
</style>