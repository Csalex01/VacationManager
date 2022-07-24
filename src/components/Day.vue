<template>
	<div :class="{today: today}">
		<router-link v-if="request != undefined" :to="{ name: 'LeaveRequests' }">
			<div class="box pt-2" :class="status">
				
					<div>
						<h5>{{ day }}</h5>
						<span v-if="request">
							{{ request.reason }}
						</span>
					</div>
				
			</div>
		</router-link>

		<div v-else class="box">
			<h5>{{ day }}</h5>
		</div>
	</div>
</template>

<script>
export default {
	name: "Day",
	props: ["day", "request", "today"],
	beforeCreate() {
		if (!this.request)
			return

		this.status = {
			'accepted': this.request.status == 'Accepted',
			'pending': this.request.status == 'Pending',
			'declined': this.request.status == 'Declined'
		}
	}
}
</script>

<style scoped>
a {
	text-decoration: none;
	color: black;
}
.box {
	display: block;
	height: 100px;
}

.accepted {
	background: lightgreen;
}

.pending {
	background: rgb(255, 253, 110);
}

.declined {
	background: rgb(255, 118, 118);
}

.today {
	border: 3px solid gray;
	border-radius: 5px;
}
</style>