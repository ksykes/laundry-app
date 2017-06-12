import React from 'react';
import ReactDOM from 'react-dom';
import {ajax} from 'jquery';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

import Map from './map.js';

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
			clickedIconCategory: null,
			iconArray: [],
			geolocationLat: 43.6532,
			geolocationLng: -79.3832,
			data: []
		}
		this.storeIcon = this.storeIcon.bind(this);
		this.getLocation = this.getLocation.bind(this);
	}
	componentDidMount() {
		// display laundry icons from Firebase
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
		// initiate MixItUp plugin
		function initiateMixItUp() {
			console.log('mixitup is working');
			document.getElementById('gallery').mixItUp();
		}
	}
	storeIcon(icon) {
		// store selected item info in state
		this.setState ({
			clickedIconURL: icon.URL,
			clickedIconDescription: icon.description,
			clickedIconCategory: icon.category
		}, () => {
			// display selected item info in modal
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
		// if successful store coordinates as latitude and longitude
		var success = (position) => {
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
				// store nearby laundromats
				var nearbyLaundry = res.results;
				// exporting data to map.js
				this.setState({
					data: nearbyLaundry
				});
			})
		}
		function error() {
			// if geolocation is unsuccessful display error message
			prompt('Your browser doesn\'t support geolocation.');
		}
		// get geolocation of user
		navigator.geolocation.getCurrentPosition(success, error);
	}
	render() {
		return (
			<div>
				<h1>The Laundry Attendant</h1>
				<h3>Click on an icon below to deciper your laundry instructions.</h3>
				{/* MixItUp filter buttons */}
				<button type="button" data-filter="all">All</button>
				<button type="button" data-filter=".bleaching">Bleaching</button>
				<button type="button" data-filter=".washing">Washing</button>
				<button type="button" data-filter=".drying">Drying</button>
				<button type="button" data-filter=".ironing">Ironing</button>
				<button type="button" data-filter=".professional">Dry Cleaning</button>
				{/* display gallery images */}
				<div id="gallery">
					{this.state.iconArray.map((icon) => {
						return <div className={'galleryItem mix ' + icon.category} key={this.state.iconArray.indexOf(icon)} onClick={() => this.storeIcon(icon)}>
							<img src={`${icon.URL}`} />
						</div>
					})}
				</div>
				{/* <h3>If you're new to doing your own laundry, here's a step-by-step.</h3>
				<h3>Need more help? Check out some answers to the most common laundry problems.</h3> */}
				<button onClick={this.getLocation}>Find your closest laundromat</button>
				<div id='map'>
					<Map ref='map' lat={this.state.geolocationLat} lng={this.state.geolocationLng}  data={this.state.data}/>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
