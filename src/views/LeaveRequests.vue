<template>
    <div v-if="loggedIn && approved">
		<h1>
			<i class="fa-solid fa-tower-observation"></i>
			Leave Requests
		</h1>

		<button type="button" class="btn btn-primary mt-3 mb-3" data-bs-toggle="modal" data-bs-target="#requestModal">
			New Leave Request
		</button>

		<div class="modal fade" id="requestModal" tabindex="-1" aria-labelledby="requestModal" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h5 class="modal-title">New Leave Request</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>

					<div class="modal-body">
						<p>You can create a new leave request by filling out the following form.</p>

						<div class="mb-3">
							<label for="startDate" class="form-label">
								<span style="color: red">*</span>
								Start Date
							</label>
							<input type="date" name="startDate" id="startDate" class="form-control" v-model="startDate">
						</div>

						<div class="mb-3">
							<label for="endDate" class="form-label">
								<span style="color: red">*</span>
								End Date
							</label>
							<input type="date" name="endDate" id="endDate" class="form-control" v-model="endDate">
						</div>

						<div>
							<label for="reason" class="form-label">Reason</label>
							<textarea name="reason" id="reason" cols="30" rows="10" class="form-control" v-model="reason"></textarea>
						</div>

						<span style="color: red; float: right" class="mt-2">* - Required fields</span>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Dismiss</button>
						<button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="submitRequest">Submit New Leave Request</button>
					</div>
				</div>
			</div>
		</div>

		<p>The following table shows your own leave requests.</p>

		<div class="table-responsive">
			<table class="table table-striped mt-3">
				<thead style="background: #212529; color: white">
					<tr>
						<th scope="col" style="width: 50px">#</th>
						<th scope="col">Start Date</th>
						<th scope="col">End Date</th>
						<th scope="col">Reason</th>
						<th scope="col">Status</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(request, index) in requests" :key="request.id">
						<th scope="row">{{ index + 1 }}</th>
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
					</tr>
				</tbody>
			</table>
		</div>
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
			approved: false,
			startDate: null,
			endDate: null,
			reason: "",
			requests: []
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

							if (!this.user.Approved || this.user.Role == "Viewer") {
								this.approved = false
								this.$router.push({ name: "Index" })
							} else {
								this.approved = true
							}

							firestore.collection("requests").get()
								.then(querySnapshot => {
									querySnapshot.forEach(docRef => {

										if (docRef.exists) {
											const data = docRef.data()

											if (data.UID == this.user.UID)
												this.requests.push({
													id: docRef.id,
													start: data.Start,
													end: data.End,
													reason: data.Reason,
													status: data.Status,
													timestamp: data.Timestamp
												})
										}
									})

									this.requests.sort((a, b) => a.timestamp - b.timestamp)
									console.log(this.requests)
								})
						}
					})
					.catch(error => {
						console.error(`Error: ${error.code}\n${error.message}`)
					})
			} else {
				this.$router.push({ name: "Index" })
			}
		})

	},
	methods: {
		submitRequest() {
			console.log(this.startDate)
			console.log(this.endDate)
			console.log(this.reason)

			const request = {
				UID: this.user.UID,
				Start: this.startDate,
				End: this.endDate,
				Reason: this.reason.length == 0 ? "No reason given" : this.reason,
				Status: "Pending",
				Timestamp: Date.now()
			}

			firestore.collection("requests").add(request)
				.then(docRef => {
					console.log(docRef.id)
					this.requests.push({
						id: docRef.id,
						start: request.Start,
						end: request.End,
						reason: request.Reason,
						status: request.Status,
						timestamp: request.Timestamp
					})

					this.startDate = ""
					this.endDate = ""
					this.reason = ""
				})
				.catch(error => {
					console.error(`Error: ${error.code}\n${error.message}`)
				})
		}
	}
}
</script>
