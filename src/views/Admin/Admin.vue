<template>
	<div v-if="hasAccess">
		<h1>
			<i class="fa-solid fa-hammer"></i>
			Admin Panel
		</h1>

		<p>The following table shows all the registered users.</p>

		<div class="table-responsive">
			<table class="table table-striped mt-3">
				<thead style="background: #212529; color: white;">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Username</th>
						<th scope="col">First Name</th>
						<th scope="col">Last Name</th>
						<th scope="col">User Group</th>
						<th scope="col">Approved</th>
						<th scope="col">Requests (Pending/Total)</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(user, index) in registeredUsers" :key="user.UID">
						<th scope="row">{{ index + 1}}</th>
						<td><span style="color: gray" class="me-1">@</span>{{ user.Username }}</td>
						<td>{{ user.FirstName }}</td>
						<td>{{ user.LastName }}</td>
						<td>
							<i v-if="user.Role == 'Admin'" style="color: red">{{ user.Role }}</i>
							<i v-else-if="user.Role == 'Employee'" style="color: green">{{ user.Role }}</i>
							<i v-else-if="user.Role == 'Viewer'" style="color: blue">{{ user.Role }}</i>
						</td>
						<td>
							<i v-if="user.Approved" class="fa-solid fa-circle-check" style="color: green"></i>
							<i v-else class="fa-solid fa-circle-xmark" style="color: red"></i>
						</td>
						<td>
							<button class="btn btn-success me-2"><i class="fa-solid fa-pen-to-square"></i> Edit Requests</button>
							({{ user.pendingRequests }}/{{ user.requestCount }})
						</td>
						<td>
							<router-link :to="{ name: 'ProfileManager', params: { UID: user.UID } }">
								<button class="btn btn-warning me-1"><i class="fa-solid fa-pen-to-square"></i> Edit User</button>
							</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { firestore, auth } from '../../firebase/config'

export default {
	name: "Admin",
	data() {
		return {
			user: null,
			hasAccess: false,
			registeredUsers: [],
			UID: null,
			enableModal: false
		}
	},
	beforeCreate() {
		auth.onAuthStateChanged(user => {
			if (user) {
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
			}
		})

		firestore.collection("users").get()
			.then(querySnapshot => {
				querySnapshot.forEach(docRef => {
					const data = docRef.data()

					if (data.Requests != null)
						data.requestCount = data.Requests.length
					else
						data.requestCount = 0

					data.pendingRequests = 0

					this.registeredUsers.push(data)
				})

				console.log(this.registeredUsers)
			})
			.catch(error => {
				console.error(`Error: ${error.code}\n${error.message}`)
			})
	}
}
</script>
