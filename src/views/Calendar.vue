<template>
  <div v-if="loggedIn && approved">
	<h1>
		<i class="fa-solid fa-calendar"></i>
		Calendar
	</h1>

	<div class="container text-center">
		<h1 class="mb-5">
			<button class="btn btn-secondary me-5" @click="prevMonth">Prev. month</button>
			<span style="display: inline-block; min-width: 300px">{{ year }} {{ month }}</span>
			<button class="btn btn-secondary ms-5" @click="nextMonth">Next month</button>
		</h1>

		<div class="row mb-3 g-0">
			<div class="col"></div>
			<div class="col"><h3>Sunday</h3></div>
			<div class="col"><h3>Monday</h3></div>
			<div class="col"><h3>Tuesday</h3></div>
			<div class="col"><h3>Wednesday</h3></div>
			<div class="col"><h3>Thursday</h3></div>
			<div class="col"><h3>Friday</h3></div>
			<div class="col"><h3>Saturday</h3></div>
		</div>

		<hr>

		<div class="row mb-3 g-0">
			<div class="col"><h3>Week 1</h3></div>
			<div class="col" v-for="(day, index) in weeks[0]" :key="index">
				<span v-if="day == undefined"></span>
				<Day v-else :day="day.day" :request="day.request" :today="day.today"/>
			</div>
		</div>

		<div class="row mb-3 g-0">
			<div class="col"><h3>Week 2</h3></div>
			<div class="col" v-for="(day, index) in weeks[1]" :key="index">
				<span v-if="day == undefined"> </span>
				<Day v-else :day="day.day" :request="day.request" :today="day.today"/>
			</div>
		</div>

		<div class="row mb-3 g-0">
			<div class="col"><h3>Week 3</h3></div>
			<div class="col" v-for="(day, index) in weeks[2]" :key="index">
				<span v-if="day == undefined"> </span>
				<Day v-else :day="day.day" :request="day.request" :today="day.today"/>
			</div>
		</div>

		<div class="row mb-3 g-0">
			<div class="col"><h3>Week 4</h3></div>
			<div class="col" v-for="(day, index) in weeks[3]" :key="index">
				<span v-if="day == undefined"> </span>
				<Day v-else :day="day.day" :request="day.request" :today="day.today"/>
			</div>
		</div>

		<div class="row mb-3 g-0">
			<div class="col"><h3>Week 5</h3></div>
			<div class="col" v-for="(day, index) in weeks[4]" :key="index">
				<span v-if="day == undefined"> </span>
				<Day v-else :day="day.day" :request="day.request" :today="day.today"/>
			</div>
		</div>

		<div class="row">
			<div class="col"><h3>Week 6</h3></div>
			<div class="col" v-for="(day, index) in weeks[5]" :key="index">
				<span v-if="day == undefined"> </span>
				<Day v-else :day="day.day" :request="day.request" :today="day.today"/>
			</div>
		</div>


	</div>
  </div>
</template>

<script>
import { firestore, auth } from '../firebase/config'

import Day from '../components/Day.vue'

export default {
	name: "Calendar",
	components: { Day },
	data() {
		return {
			user: null,
			loggedIn: false,
			approved: false,
			days: [],
			startDay: 0,
			year: 0,
			month: 0,
			weeks: [],
			requests: null,
			showCalendar: false,
			currYear: null,
			currMonth: null,
			currDay: null,
			today: null
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

							if (!this.user.Approved) {
								this.approved = false
								this.$router.push({ name: "Index" })
							} else {
								this.approved = true
							}
						}

						firestore.collection("requests").get()
							.then(querySnapshot => {
								this.requests = []
								querySnapshot.forEach(docRef => {

									if (docRef.exists) {
										const data = docRef.data()

										if (data.UID == this.user.UID)
											this.requests.push({
												id: docRef.id,
												start: data.Start,
												end: data.End,
												status: data.Status,
												reason: data.Reason
											})
									}
								})

								this.requests.sort((a, b) => a.timestamp - b.timestamp)

								this.today = new Date()

								this.currYear = 1900 + this.today.getYear()
								this.currMonth = this.today.getMonth()
								this.currDay = this.today.getDate()

								this.calculateCalendar(this.currYear, this.currMonth, this.currDay)
							})
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
		calculateCalendar(year, month, day) {
			const date = new Date(year, month, day)
			// console.log(1900 + date.getYear(), date.getMonth() + 1, date.getDate())
			const daysInMonth = this.getDaysInMonth(2022, date.getMonth())

			this.year = year

			switch (month) {
				case 0:
					this.month = "January"
					break
				case 1:
					this.month = "February"
					break
				case 2:
					this.month = "March"
					break
				case 3:
					this.month = "April"
					break
				case 4:
					this.month = "May"
					break
				case 5:
					this.month = "June"
					break
				case 6:
					this.month = "July"
					break
				case 7:
					this.month = "August"
					break
				case 8:
					this.month = "Septemper"
					break
				case 9:
					this.month = "October"
					break
				case 10:
					this.month = "November"
					break
				case 11:
					this.month = "December"
					break

			}

			this.days = []
			for (let i = 1; i <= daysInMonth; i++) {
				const day = new Date(this.currYear, this.currMonth, i)
				const today = new Date(1900 + this.today.getYear(), this.today.getMonth(), this.today.getDate())
				this.days.push({
					day: i,
					dayOfWeek: this.getDayOfWeek(1900 + date.getYear(), date.getMonth(), i),
					request: null,
					today: day.getTime() == today.getTime()
				})
			}

			this.startDay = this.days[0].dayOfWeek
			this.endDay = this.days[daysInMonth - 1].dayOfWeek

			let counter = 0
			for (let i = 0; i < 6; i++) {
				this.weeks[i] = []
				for (let j = 0; j < 7; j++) {
					if ((j < this.startDay && i == 0) || (j > this.endDay && i == 5))
						this.weeks[i][j] = null
					else {
						this.weeks[i][j] = this.days[counter]
						this.assignRequest(year, month, i, j, counter + 1)
						counter++
					}
				}
			}
		},
		getDaysInMonth(year, month) {
			return new Date(year, month + 1, 0).getDate();
		},
		getDayOfWeek(year, month, day) {
			return new Date(year, month, day).getDay()
		},
		assignRequest(year, month, week, day, counter) {
			for (let k = 0; k < this.requests.length; k++) {
				const start = Date.parse(this.requests[k].start) - 8.64e+7
				const end = Date.parse(this.requests[k].end)
				const currDay = new Date(year, month, counter).getTime()

				try {
					if (start <= currDay && currDay <= end) {
						this.weeks[week][day].request = this.requests[k]
					}
				} catch (e) {
					// Do nothing
				}
			}
		},
		nextMonth() {
			this.currMonth++
			// this.currDay = 1

			if (this.currMonth > 11) {
				this.currMonth = 0
				this.currYear++
			}

			this.calculateCalendar(this.currYear, this.currMonth, this.currDay)
		},
		prevMonth() {
			this.currMonth--
			// this.currDay = 1

			if (this.currMonth < 0) {
				this.currMonth = 11
				this.currYear--
			}

			this.calculateCalendar(this.currYear, this.currMonth, this.currDay)
		}
	}
}
</script>
