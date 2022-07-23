<template>
	<div v-if="loggedIn && approved">
		<h1>
			<i class="fa-solid fa-pen-to-square"></i> 
			Request Manager
		</h1>
		
		<div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="requestModal" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h5>
							<i class="fa-solid fa-pen-to-square"></i> 
							Edit Request (ID: {{ modalRequest.id }})
						</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>

					<div class="modal-body">
						<p>You can edit the selected leave request below.</p>

						<div class="mb-3">
							<label for="startDdate" class="form-label">Start Date</label>
							<input type="date" name="startDate" id="startDate" class="form-control" v-model="modalRequest.start">
						</div>

						<div class="mb-3">
							<label for="endDate" class="form-label">End Date</label>
							<input type="date" name="endDate" id="endDate" class="form-control" v-model="modalRequest.end">
						</div>

						<div class="mb-3">
							<label for="reason" class="form-label">Reason</label>
							<textarea name="reason" id="reason" cols="30" rows="10" class="form-control" v-model="modalRequest.reason"></textarea>
						</div>

						<div>
							<label for="status" class="form-label">Status</label>
							<select name="status" id="role-dropdown" class="form-select" v-model="modalRequest.status">
								<option selected disabled hidden>{{ modalRequest.status }}</option>
								<option value="Accepted">Accepted</option>
								<option value="Pending">Pending</option>
								<option value="Declined">Declined</option>
							</select>
						</div>
					</div>

					<div class="modal-footer">
						<button class="btn btn-secondary" data-bs-dismiss="modal">Dismiss</button>
						<button class="btn btn-primary" data-bs-dismiss="modal" @click="submit">Confirm Edit</button>
					</div>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<table class="table table-striped mt-3">
				<thead style="background: #212529; color: white">
					<tr>
						<th scope="col" style="width: 50px">#</th>
						<th scope="col">Start Date</th>
						<th scope="col">End Date</th>
						<th scope="col">Reason</th>
						<th scope="col">Status</th>
						<th scope="col" class="col-3">Actions</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(request, index) in requests" :key="request.id">
						<th scope="row">{{ index + 1}}</th>
						<td>{{ request.start }}</td>
						<td>{{ request.end }}</td>
						<td>{{ request.reason }}</td>
						<td>
							<span v-if="request.status == 'Pending'" class="text-warning">
								<i class="fa-solid fa-clock me-2"></i>
								Pending
							</span>
							<span v-else-if="request.status == 'Accepted'" class="text-success">
								<i class="fa-solid fa-circle-check me-2"></i>
								Accepted
							</span>
							<span v-else-if="request.status == 'Declined'" class="text-danger">
								<i class="fa-solid fa-circle-xmark me-2"></i>
								Declined
							</span>
						</td>
						<td>
							<button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#editModal" @click="edit(request.id)">
								<i class="fa-solid fa-pen-to-square"></i> 
								Edit Request
							</button>
							<button class="btn btn-danger">
								<i class="fa-solid fa-trash"></i> 
								Delete Request
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
			requests: [],
			title: null,
			modalRequest: {}
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
													timestamp: data.Timestamp
												})
											}
										}
									})
									this.requests.sort((a, b) => a.timestamp - b.timestamp)
								})
						}
					})

			} else {
				this.$router.push({ name: "Index" })
			}
		})
	},
	methods: {
		edit(id) {
			this.modalRequest = (this.requests.filter(req => req.id == id))[0]
		},
		submit() {
			const doc = firestore.collection("requests").doc(this.modalRequest.id)
			doc.update({
				Start: this.modalRequest.start,
				End: this.modalRequest.end,
				Reason: this.modalRequest.reason,
				Status: this.modalRequest.status
			})
		}
	}
}
</script>