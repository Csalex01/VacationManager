<template>
	<div class="container box mt-4">
		<h1>Sign Up</h1>

		<br>

		<label for="email" class="form-label">Email Address</label>
		<input type="email" name="email" class="form-control" id="email" placeholder="Enter Email Address">

		<br>

		<label for="username" class="form-label">Username</label>
		<input type="text" name="username" class="form-control" id="username" placeholder="Enter Username">

		<br>

		<div class="row">
			<div class="col">
				<label for="firstName" class="form-label">First Name</label>
				<input type="text" name="firstName" class="form-control" id="firstName" placeholder="Enter First Name">
			</div>

			<div class="col">
				<label for="lastName" class="form-label">Last Name</label>
				<input type="text" name="lastName" class="form-control" id="lastName" placeholder="Enter Last Name">
			</div>
		</div>

		<br>

		<div class="row">
			<div class="col">
				<label for="paassword" class="form-label">Password</label>
				<input type="password" name="password1" class="form-control mb-1" id="password" placeholder="Enter Password">
			</div>

			<div class="col">
				<label for="paassword" class="form-label">Confirm Password</label>
				<input type="password" name="password2" class="form-control mb-1" id="password2" placeholder="Confirm Password">
			</div>
		</div>

		<br>

		<a href="#" class="btn btn-primary">Sign Up</a>
	</div>
</template>

<script>
export default {
	name: "Signup"
}
</script>

<style scoped>
.box {
	max-width: 500px;
}
</style>