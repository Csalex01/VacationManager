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
						<th scope="col"><span style="color: gray" class="me-1">@</span> Username</th>
						<th scope="col">E-mail</th>
						<th scope="col">First Name</th>
						<th scope="col">Last Name</th>
						<th scope="col" class="col-1">User Group</th>
						<th scope="col" class="col-1">Status</th>
						<th scope="col" class="col-1">E-mail Notif.</th>
						<th scope="col" class="col-2">Requests (A/P/D/T)</th>
						<th scope="col" class="col-2">Actions</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(user, index) in registeredUsers" :key="user.UID">
						<th scope="row">{{ index + 1}}</th>
						<td><span style="color: gray" class="me-1">@</span>{{ user.Username }}</td>
						<td>{{ user.Email }}</td>
						<td>{{ user.FirstName }}</td>
						<td>{{ user.LastName }}</td>
						<td>
							<i v-if="user.Role == 'Admin'" class="text-danger">{{ user.Role }}</i>
							<i v-else-if="user.Role == 'Employee'" class="text-success">{{ user.Role }}</i>
							<i v-else-if="user.Role == 'Viewer'" class="text-primary">{{ user.Role }}</i>
						</td>
						<td>
							<span v-if="user.Approved" class="text-success">
								<i class="fa-solid fa-circle-check me-2"></i>
								Approved
							</span>
							<span v-else class="text-danger">
								<i class="fa-solid fa-circle-xmark me-2"></i>
								Refused
							</span>
						</td>
						<td>
							<span v-if="user.OptionalEmail" class="text-success">
								<i class="fa-solid fa-circle-check me-2"></i>
								On
							</span>
							<span v-else class="text-danger">
								<i class="fa-solid fa-circle-xmark me-2"></i>
								Off
							</span>
						</td>
						<td>
							<router-link :to="{ name: 'RequestManager', params: {UID: user.UID}}">
								<button class="btn btn-success me-2">
									<i class="fa-solid fa-pen-to-square"></i>
									Edit Requests
								</button>
							</router-link>
							({{ user.acceptedRequests }}/{{ user.pendingRequests }}/{{ user.declinedRequests }}/{{ user.requestCount }})
						</td>
						<td>
							<router-link :to="{ name: 'ProfileManager', params: { UID: user.UID } }">
								<button class="btn btn-warning me-1">
									<i class="fa-solid fa-pen-to-square"></i> 
									Edit User
								</button>
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
			registeredUsers: null,
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

							firestore.collection("users").get()
								.then(querySnapshot => {
									this.registeredUsers = []
									querySnapshot.forEach(docRef => {
										const data = docRef.data()

										data.requestCount = 0
										data.pendingRequests = 0
										data.acceptedRequests = 0
										data.declinedRequests = 0

										firestore.collection("requests").get()
											.then(querySnapshot => {
												querySnapshot.forEach(docRef => {
													const req = docRef.data()

													if (req.UID == data.UID) {
														data.requestCount++

														if (req.Status == "Pending")
															data.pendingRequests++

														if (req.Status == "Accepted")
															data.acceptedRequests++

														if (req.Status == "Declined")
															data.declinedRequests++
													}
												})

												this.registeredUsers.push(data)
												this.registeredUsers.sort((a, b) => a.RegisteredOn - b.RegisteredOn)
											})
									})
								})
								.catch(error => {
									console.error(`Error: ${error.code}\n${error.message}`)
								})

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
