<template>
	<div class="alert" :class="alertClass">
		{{ alertMessage }}
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
				this.alertMessage = `Error: ${this.message}`

				break
			case "Warning":
				this.isWarning = true
				this.alertMessage = `Warning: ${this.message}`

				break
			case "Success":
				this.isSuccess = true
				this.alertMessage = `Success: ${this.message}`

				break
		}

		this.alertClass = {
			'alert-danger': this.isError,
			'alert-warning': this.isWarning,
			'alert-success': this.isSuccess
		}
	}
}
</script>
