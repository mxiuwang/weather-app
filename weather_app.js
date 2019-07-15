window.addEventListener('load',()=>{ // addEventListener(action, function that runs after the action occurs)
	let temperatureDescription = document.querySelector('.temperature-description'); // document.querySelector('myclass') returns the first instance of the class 'myclass' in the document 
	let temperatureDegree = document.querySelector('.temperature-degree');
	let locationTimezone = document.querySelector('.location-timezone');
	let temperatureSection = document.querySelector('.temperature');
	const temperatureSpan = document.querySelector('.temperature span')

	if(navigator.geolocation){ // obtain GPS coords of user's location using Navitagor function, built into JS.
	// if the geolocation exists in browser
		navigator.geolocation.getCurrentPosition(position => { // saves "Position" object in variable position
			let long = position.coords.longitude 
			let lat = position.coords.latitude 

			const proxy = `https://cors-anywhere.herokuapp.com/`; // api won't let you access the website from localhost, is this proxy serves like a VPN
			const api = `${proxy}https://api.darksky.net/forecast/2b7689e87a6d356f31313103223111bb/${lat},${long}`; // api is a server-friendly version of all the data 

			fetch(api) // get the data from the api link
				.then(response => { // then, get the data in the api from the server and name it "response"
					return response.json() // convert "response" to json (JS-friendly format)
				})
				.then(data => { // get data from response
					console.log(data) // print it (doesn't actually serve any purpose, just allows us to read the data)
					let {temperature, summary}= data.currently; // pull out temperature and summary from 'currently'
					// or you can do data.currently.temperature 
					temperature = parseFloat(temperature).toFixed(1)
					// temp celsius
					let celsius = (temperature-32)*(5/9)
					const timezone = data.timezone.split("/")[1];
					console.log(timezone.split("/"))
					temperatureDegree.textContent = parseFloat(celsius).toFixed(1); // Set DOM elements from the API (temperatureDegree defined at the top, temperature defined above)
					temperatureDescription.textContent = summary; // setting textContent overrides the original text content in the html file
					locationTimezone.textContent =timezone;

					const icon = data.currently.icon; // import icon from 'currently'
					// Call the setIcon method 
					setIcons(icon, document.querySelector('.icon'))

					// Flip temp between F and C on click
					temperatureSection.addEventListener('click', () => {
						if (temperatureSpan.textContent === "C"){
							temperatureSpan.textContent = "F";
							temperatureDegree.textContent = temperature; 
						} else {
							temperatureSpan.textContent = "C";
							temperatureDegree.textContent = parseFloat(celsius).toFixed(1); // round to 2 decimal places 
						}
					})
				})

		})
	} else{ // if the user does not allow website to access location, or if location DNE in browser
		h1.textContent = "location cannot be displayed"
	}

	function setIcons(icon, iconID){ // icon is the string imported from currently, and iconID is .icon class from the html file
		const skycons = new Skycons({color: "white"}) // imports Skycons 
		console.log(icon)
		const currentIcon = icon.replace(/-/g, "_").toUpperCase(); // change the imported 'icon' to the correct format by replacing every '-' in the icon  name in the API with '_', and changing all letters to uppercase
		skycons.play(); // display the icon
		return skycons.set(iconID, Skycons[currentIcon]) // returns skycons; set() updates map object with a key (iconID) and value (Skycons[currentIcon])
		// this is the format dictated in the Skycons documentation 
	}
});