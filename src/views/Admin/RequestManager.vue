<template>
	<div v-if="loggedIn && approved">
		<h1>
			<i class="fa-solid fa-pen-to-square"></i> 
			Request Manager View
		</h1>
		
		<div class="table-responsive">
			<table class="table table-striped mt-3">
				<thead style="background: #212529; color: white">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Start Date</th>
						<th scope="col">End Date</th>
						<th scope="col">Reason</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(request, index) in requests" :key="request.id">
						<th scope="row">{{ index + 1}}</th>
						<td>{{ request.start }}</td>
						<td>{{ request.end }}</td>
						<td>{{ request.reason }}</td>
						<td>
							<button class="btn btn-warning me-1">
								<i class="fa-solid fa-pen-to-square"></i> 
								Edit Request
							</button>
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
	name: "Request Manager",
	params: ['UID'],
	data() {
		return {
			UID: null,
			user: null,
			loggedIn: false,
			approved: false,
			requests: []
		}
	},
	beforeCreate() {
		// this.UID = this.$route.params.UID
		// console.log(this.UID)

		auth.onAuthStateChanged(user => {
			if (user) {
				this.loggedIn = true

				const doc = firestore.collection("users").doc(user.uid)
				doc.get()
					.then(docRef => {
						if (docRef.exists) {
							this.user = docRef.data()

							if (!this.user.Approved && this.user.Role != "Admin") {
								this.approved = false
								this.$router.push({ name: 'Index' })
							} else {
								this.approved = true
							}

							firestore.collection("requests").get()
								.then(querySnapshot => {
									querySnapshot.forEach(docRef => {

										if (docRef.exists) {
											const data = docRef.data()

											if (data.Requests == undefined)
												data.Requests = []

											data.Requests.push(docRef.id)

											if (data.UID == this.$route.params.UID) {
												this.requests.push({
													id: docRef.id,
													start: data.Start,
													end: data.End,
													reason: data.Reason,
													status: data.Status,
												})
											}
										}
									})

									// console.log(this.requests)
								})
						}
					})

			} else {
				this.$router.push({ name: "Index" })
			}
		})
	}
}
</script>