<template>
    <div v-if="loggedIn && approved">
		<h1>Leave Request View</h1>
	</div>
</template>

<script>
import { firestore, auth } from '../firebase/config'

export default {
	name: "LeaveRequests",
	data() {
		return {
			user: null,
			loggedIn: false,
			approved: false
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
							console.log(docRef.data())
							this.user = docRef.data()

							if (!this.user.Approved || this.user.Role == "Viewer") {
								this.approved = false
								this.$router.push({ name: "Index" })
							} else {
								this.approved = true
							}
						}
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})
			} else {
				this.$router.push({ name: "Index" })
			}
		})
	}
}
</script>
