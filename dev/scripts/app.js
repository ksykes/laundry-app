import React from 'react';
import ReactDOM from 'react-dom';
import {ajax} from 'jquery';

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
var nearbyLaundry = [];

const googleMapsKey = 'AIzaSyDcyjwPm5OjBxyMNY9W3UJkJCpmfOMGJk0';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			clickedIconURL: null,
			clickedIconDescription: null,
			iconArray: [],
			geolocation: {}
		}
		this.storeIcon = this.storeIcon.bind(this);
	}
	componentDidMount() {
		dbRef.on('value', (snapshot) => {
			laundryIcons = snapshot.val().icons;
			var icons = [];
			for (var prop in laundryIcons) {
				icons.push(laundryIcons[prop]);
			}
			this.setState ({
				iconArray: icons
			})
		});
	}
	storeIcon(icon) {
		this.setState ({
			clickedIconURL: icon.URL,
			clickedIconDescription: icon.description
		}, () => {
			swal({
				title: 'Instructions:',
				text: this.state.clickedIconDescription,
				imageUrl: this.state.clickedIconURL,
				type: 'info',
				confirmButtonText: 'OK',
				allowEscapeKey: true,
				allowOutsideClick: true,
				confirmButtonColor: '#e71d36'
			});
		});
	}
	getLocation() {
		navigator.geolocation.getCurrentPosition(success, error);
		function success(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			console.log('thing');
			console.log(position);
			ajax({
				url: 'https://proxy.hackeryou.com',
				method: 'GET',
				dataType: 'json',
				data: {
					reqUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
					params: {
						key: googleMapsKey,
						location: latitude + "," + longitude,
						radius: 500,
						type:'laundry'
					}
				}
			}).then(res => {
				var nearbyLaundry = res.results;
				console.log(nearbyLaundry);
			})
		}
		function error() {
			prompt('Please try again later.');
		}
	}
	initMap(latitude, longitude) {
		// var cityLocationA = {lat: 79.3832, lng: 43.6532};
		// var cityLocationB = {lat: 79.3370, lng: 43.8561};
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 4,
			// center: this.state.geolocation,
			center: {lat: 43.647797999999995, lng: -79.3965302}
			// styles: googleMapStyle
		});
		// var markerA = new google.maps.Marker({
		// 	position: cityLocationA,
		// 	map: map
		// });
		// var markerB = new google.maps.Marker({
		// 	position: cityLocationB,
		// 	map: map
		// });
	}
	render() {
		return (
			<div>
				<h1>The Laundry Attendant</h1>
				<h3>Click on an icon below to deciper your laundry instructions.</h3>
				<div className="gallery">
					{this.state.iconArray.map((icon) => {
						return <div className="galleryItem" key={this.state.iconArray.indexOf(icon)} onClick={() => this.storeIcon(icon)}>
							<img src={`${icon.URL}`} />
						</div>
					})}
				</div>
				<button onClick={this.getLocation}>Find your closest laundromat</button>
				{/* <Map /> */}
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
