<template>
	<h1>Welcome!</h1>

	<div v-if="!loggedIn">
		<p>You need to be authenticated in order to continue!</p>
	</div>

	<div v-else-if="loggedIn && !approved">
		<p>Please be patient until an administrator approves your registration.</p>
	</div>
</template>

<script>
import { firestore, auth } from '../firebase/config'

export default {
	name: "Index",
	data() {
		return {
			user: null,
			approved: false,
			loggedIn: false
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

							if (this.user.Approved) {
								this.approved = true
								this.$router.push({ name: "Calendar" })
							}
						}
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})
			}
		})
	}
}
</script>
