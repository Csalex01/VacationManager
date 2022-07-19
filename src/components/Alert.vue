<template>
	<div class="alert" id="alert" :class="alertClass">

		<i class="fa-solid me-2" :class="alertIcon"></i>

		{{ message }}

		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="float: right"></button>	
	</div>
	
</template>

<script>
export default {
	name: "Alert",
	props: ["type", "message"],
	data() {
		return {
			isError: false,
			isWarning: false,
			isSuccess: false
		}
	},
	beforeCreate() {
		switch (this.type) {
			case "Error":
				this.isError = true

				break
			case "Warning":
				this.isWarning = true

				break
			case "Success":
				this.isSuccess = true

				break
		}

		this.alertClass = {
			'alert-danger': this.isError,
			'alert-warning': this.isWarning,
			'alert-success': this.isSuccess
		}

		this.alertIcon = {
			'fa-xmark': this.isError,
			'fa-triangle-exclamation': this.isWarning,
			'fa-check': this.isSuccess
		}
	}
}
</script>
