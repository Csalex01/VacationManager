<template>
	<nav class="navbar navbar-dark navbar-expand-xl bg-dark">
		<div class="container">

			<router-link :to="{ name: 'Index' }" class="navbar-brand">
				<img src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo.svg" alt="" width="30" height="24">
				Vacation Manager
			</router-link>

			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="collapse">

				<ul class="navbar-nav">
					<li v-if="loggedIn" class="nav-item">
						<router-link :to="{ name: 'Calendar' }" class="nav-link" :class="{active: $route.name === 'Calendar'}">Calendar</router-link>
					</li>

					<li v-if="loggedIn" class="nav-item">
						<router-link :to="{ name: 'LeaveRequests' }" class="nav-link" :class="{active: $route.name === 'LeaveRequests'}">Leave requests</router-link>
					</li>

					<li v-if="loggedIn && isAdmin" class="nav-item">
						<router-link :to="{ name: 'Admin' }" class="btn btn-outline-danger" :class="{active: $route.name === 'Admin'}">Admin panel</router-link>
					</li>
				</ul>

				<ul class="navbar-nav ms-auto">

					<li v-if="!loggedIn" class="nav-item">
						<router-link :to="{ name: 'Signup' }" class="btn btn-outline-success" :class="{active: $route.name === 'Signup'}">Sign Up</router-link>
					</li>

					<li v-if="!loggedIn" class="nav-item">
						<router-link :to="{ name: 'Login' }" class="nav-link" :class="{active: $route.name === 'Login'}">Log In</router-link>
					</li>

					<li v-if="loggedIn" class="nav-item">
						<a class="btn btn-outline-success" @click="logout">Log Out</a>
					</li>
				</ul>

			</div>

		</div>
	</nav>
</template>

<script>
import { firestore, auth } from '../firebase/config'

export default {
	name: "Navbar",
	data() {
		return {
			loggedIn: false,
			user: null,
			isAdmin: false
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

							if (this.user.Role == "Admin")
								this.isAdmin = true

						} else
							console.log("No such document!")
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})
			}
		})
	},
	methods: {
		logout() {
			auth.signOut()
				.then(() => {
					this.loggedIn = false
					this.$router.push({ name: "Index" })
				})
				.catch(error => {
					console.error(`Error: ${error.code}\n${error.message}`)
				})
		}
	}
}
</script>

<style>
</style>