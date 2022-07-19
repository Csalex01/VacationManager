<template>
	<div v-if="hasAccess" class="container box">
		<h1>
			<i class="fa-solid fa-address-card"></i>
			Profile for {{ firstName }} {{ lastName }} ({{ username }})
		</h1>
		<p> UID: {{ UID }}</p>
		
		<label for="name" class="form-label">Name</label>
		<input type="text" name="name" class="form-control" id="name" disabled v-model="name">

		<br>

		<label for="username" class="form-label">Username</label>
		<input type="text" name="username" class="form-control" username="name" disabled v-model="username">

		<br>

		<label for="role" class="form-label">User Group</label>
		<select name="role" id="role-dropdown" class="form-select" v-model="role">
			<option selected disabled hidden>{{ role }}</option>
			<option value="Viewer">Viewer</option>
			<option value="Employee">Employee</option>
			<option value="Admin">Admin</option>
		</select>

		<br>

		<label for="approvedStatus" class="form-label me-3">Registration status (click to change)</label>
		<input v-if="approved" name="approvedStatus" class="btn btn-success" @click="approved = !approved" value="Approved">
		<input v-else name="approvedStatus" class="btn btn-danger" @click="approved = !approved" value="Refused">

		<br>

		<button class="btn btn-primary mt-3" @click="saveChanges">Save changes</button>
		<button class="btn btn-danger mt-3 ms-3"><i class="fa-solid fa-trash"></i> Delete Profile</button>
		
	</div>
</template>

<script>
import { firestore, auth } from '../../firebase/config'

export default {
	name: "ProfileManager",
	params: ['UID'],
	data() {
		return {
			hasAccess: false,
			firstName: null,
			lastName: null,
			name: null,
			username: null,
			approved: false,
			role: null,
			requests: [],
			user: null,
			loggedIn: false,
			otherUser: null
		}
	},
	beforeMount() {
		this.UID = this.$route.params.UID

		auth.onAuthStateChanged(user => {
			if (user) {
				this.loggedIn = true
				const doc = firestore.collection("users").doc(user.uid)
				doc.get()
					.then(docRef => {
						if (docRef.exists) {
							this.hasAccess = true
							this.user = docRef.data()

							if (this.user.Role != 'Admin')
								this.$router.push({ name: "Index" })

						} else
							console.log("No such document!")
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})
			} else
				this.$router.push({ name: "Index" })
		})

		const doc = firestore.collection("users").doc(this.UID)
		doc.get()
			.then(docRef => {
				if (docRef.exists) {
					console.log(docRef.data())

					this.otherUser = docRef.data()
					this.firstName = this.otherUser.FirstName
					this.lastName = this.otherUser.LastName
					this.name = `${this.firstName} ${this.lastName}`
					this.username = this.otherUser.Username
					this.approved = this.otherUser.Approved
					this.role = this.otherUser.Role
					this.requests = this.otherUser.Requests
				} else
					console.log("No such document!")
			})
	},
	methods: {
		saveChanges() {
			console.log(this.otherUser)
			console.log(this.firstName)
			console.log(this.lastName)
			console.log(this.username)
			console.log(this.approved)
			console.log(this.role)
			console.log(this.requests)

			const doc = firestore.collection("users").doc(this.UID)
			doc.update({
				Role: this.role,
				Approved: this.approved
			})
				.then(() => {
					console.log("Document updated successfully!")
				})
				.catch(error => {
					console.error(`Error: ${error.code}\n${error.message}`)
				})

			this.$router.push({ name: 'Admin' })
		}
	}
}
</script>

<style scoped>
.box {
	max-width: 1000px;
}
</style>