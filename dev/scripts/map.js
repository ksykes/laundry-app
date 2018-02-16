import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div className='markerFlag'>{text}</div>;

export default class SimpleMap extends Component {
	constructor() {
		super();
		this.state = {
			currentZoom: 14,
		}
	}
	// hoverMapItem() {
	// 	var hoverItem = document.getElementsByClassName('markerFlag');
	// 	// this handler will be executed only once when the cursor moves over the unordered list
	// 	markerFlag.addEventListener("mouseenter", (event) => {
	// 		markerFlag.className += " displayLaundromatName";
	// 	});
	// }
	render() {
		var latitude = this.props.lat;
		var longitude = this.props.lng;
		var data = this.props.data;
		return (
			<GoogleMapReact
				center={{lat:latitude,lng:longitude}}
				defaultZoom={this.state.currentZoom}
				bootstrapURLKeys={{
					key: 'AIzaSyBbVM4jItRq01mD2j2LxR0VJapThMQIwcM'
				}}>
					{data.map((laundromatData) => {
						return (
							<AnyReactComponent
								lat={laundromatData.geometry.location.lat}
								lng={laundromatData.geometry.location.lng}
								// text={laundromatData.name}
								text={' '}
								key={laundromatData.id}
							/>
						)
					})}
			</GoogleMapReact>
		);
	}
}
