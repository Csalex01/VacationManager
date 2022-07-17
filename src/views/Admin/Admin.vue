<template>
	<div v-if="hasAccess">
		<h1>Admin View</h1>
	</div>
</template>

<script>
import { firestore, auth } from '../../firebase/config'

export default {
	name: "Admin",
	data() {
		return {
			user: null,
			hasAccess: false
		}
	},
	beforeCreate() {
		auth.onAuthStateChanged(user => {
			if (user) {
				const doc = firestore.collection("users").doc(user.uid)
				doc.get()
					.then(docRef => {
						if (docRef.exists) {
							this.user = docRef.data()

							console.log(this.user)

							// if (this.user.Role != "Admin")
							// 	this.$router.push({ name: "Index" })

							this.hasAccess = true
						} else
							console.log("No such document!")
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})
			}
		})
	}
}
</script>
