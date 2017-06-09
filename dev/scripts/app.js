import React from 'react';
import ReactDOM from 'react-dom';

// Initialize Firebase
var config = {
	apiKey: "AIzaSyD8aeD_g3ZGbgqnBz4rLl3nMN3fZSa9Sys",
	authDomain: "laundry-app-10f78.firebaseapp.com",
	databaseURL: "https://laundry-app-10f78.firebaseio.com",
	projectId: "laundry-app-10f78",
	storageBucket: "laundry-app-10f78.appspot.com",
	messagingSenderId: "535061224744"
};
firebase.initializeApp(config);

const auth = firebase.auth();
const dbRef = firebase.database().ref('/');
var laundryIcons = {};

const googleMapsKey = 'AIzaSyDcyjwPm5OjBxyMNY9W3UJkJCpmfOMGJk0';

dbRef.on('value', function(snapshot) {
	laundryIcons = snapshot.val().icons;
	console.log(laundryIcons);

	for (var prop in laundryIcons) {
		console.log(laundryIcons[prop].URL);
		// return (
		// 	<Gallery img={laundryIcons[prop].URL} description={laundryIcons[prop].description} />
		// )
	}
});

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			clickedIcon: null
		};
	}
	render() {
		return (
			<div>
				<h1>The Right Wash</h1>
				<div className="gallery">
					<img />
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
