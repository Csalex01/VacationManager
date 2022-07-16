<template>
	<nav class="navbar navbar-dark navbar-expand-xl bg-dark">
		<div class="container">

			<router-link :to="{ name: 'Index' }" class="navbar-brand">
				<img src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo.svg" alt="" width="30" height="24">
				Vacation Manager
			</router-link>

			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="collapse">

				<ul class="navbar-nav">
					<li class="nav-item">
						<router-link :to="{ name: 'Calendar' }" class="nav-link" :class="{active: $route.name === 'Calendar'}">Calendar</router-link>
					</li>

					<li class="nav-item">
						<router-link :to="{ name: 'LeaveRequests' }" class="nav-link" :class="{active: $route.name === 'LeaveRequests'}">Leave requests</router-link>
					</li>

					<li class="nav-item">
						<router-link :to="{ name: 'Admin' }" class="btn btn-outline-danger" :class="{active: $route.name === 'Admin'}">Admin panel</router-link>
					</li>
				</ul>

				<ul class="navbar-nav ms-auto">
					<li class="nav-item">
						<router-link :to="{ name: 'Signup' }" class="btn btn-outline-success" :class="{active: $route.name === 'Signup'}">Sign Up</router-link>
					</li>

					<li class="nav-item">
						<router-link :to="{ name: 'Login' }" class="nav-link" :class="{active: $route.name === 'Login'}">Log In</router-link>
					</li>
				</ul>

			</div>

		</div>
	</nav>
</template>

<script>
export default {
	name: "Navbar"
}
</script>

<style>
</style>