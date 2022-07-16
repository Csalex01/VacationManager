<template>
	<div class="container box mt-4">
		<h1>Log In</h1>

		<br>

		<label for="email" class="form-label">Email Address</label>
		<input type="email" name="email" class="form-control" id="email" placeholder="Enter Email Address">

		<br>

		<label for="paassword" class="form-label">Password</label>
		<input type="password" name="password" class="form-control mb-1" id="password" placeholder="Enter Password">

		<a href="#" style="color: red; text-decoration: none">Reset Password</a>

		<br> <br>

		<a href="#" class="btn btn-primary">Log In</a>
	</div>
</template>

<script>
export default {
	name: "Login"
}
</script>

<style scoped>
.box {
	max-width: 500px;
}
</style>