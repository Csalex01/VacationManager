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
						<router-link :to="{ name: 'Calendar' }" class="nav-link" :class="{active: $route.name === 'Calendar'}">
							<i class="fa-solid fa-calendar"></i>
							Calendar
						</router-link>
					</li>

					<li v-if="loggedIn && (role == 'Employee' || role == 'Admin')" class="nav-item">
						<router-link :to="{ name: 'LeaveRequests' }" class="nav-link" :class="{active: $route.name === 'LeaveRequests'}">
							<i class="fa-solid fa-tower-observation"></i>
							Leave Requests
						</router-link>
					</li>

					<li v-if="isAdmin" class="nav-item">
						<router-link :to="{ name: 'Admin' }" class="btn btn-outline-danger" :class="{active: $route.name === 'Admin'}">
							<i class="fa-solid fa-hammer"></i>
							Admin Panel
						</router-link>
					</li>
				</ul>

				<ul class="navbar-nav ms-auto">

					<li v-if="!loggedIn" class="nav-item">
						<router-link :to="{ name: 'Signup' }" class="btn btn-outline-success" :class="{active: $route.name === 'Signup'}">
							<i class="fa-solid fa-user-plus"></i>
							Sign Up
						</router-link>
					</li>

					<li v-if="!loggedIn" class="nav-item">
						<router-link :to="{ name: 'Login' }" class="nav-link" :class="{active: $route.name === 'Login'}">
							<i class="fa-solid fa-right-to-bracket"></i>
							Log In
						</router-link>
					</li>

					<li v-if="loggedIn" class="nav-item">
						<router-link :to="{name: 'Profile'}" class="nav-link" :class="{active: $route.name === 'Profile'}">
							<i class="fa-solid fa-address-card"></i>
							Profile
						</router-link>
					</li>

					<li v-if="loggedIn" class="nav-item">
						<a class="btn btn-outline-warning" @click="logout">
							<i class="fa-solid fa-arrow-right-from-bracket"></i>
							Log Out
						</a>
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
			isAdmin: false,
			role: null,
			name: null
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
							this.role = this.user.Role
							this.name = `${this.user.FirstName} ${this.user.LastName}`

							if (this.user.Role == "Admin")
								this.isAdmin = true

						} else
							console.log("No such document!")
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})
			} else {
				this.loggedIn = false
				this.isAdmin = false
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

<style scoped>
.nav-item {
	margin-right: 10px;
}
</style>