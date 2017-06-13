import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div className='markerFlag'>{text}</div>;

export default class SimpleMap extends Component {
  // static defaultProps = {
  //   center: {lat: 59.95, lng: 30.33},
  //   zoom: 11
	constructor() {
		super();
		this.state = {
			currentZoom: 14,
			center: {lat:43.6532, lng:-79.3832}
		}
	}
	hoverMapItem() {
		var hoverItem = document.getElementsByClassName('markerFlag');
		// this handler will be executed only once when the cursor moves over the unordered list
		markerFlag.addEventListener("mouseenter", (event) => {
			markerFlag.className += " displayLaundromatName";
		});
	}
	render() {
		var latitude = this.props.lat;
		var longitude = this.props.lng;
		var data = this.props.data;
		console.log(data);
		return (
			<GoogleMapReact
				defaultCenter={this.state.center}
				defaultZoom={this.state.currentZoom}
				bootstrapURLKeys={{
					key: 'AIzaSyDcyjwPm5OjBxyMNY9W3UJkJCpmfOMGJk0'
				}}
				>
					{/* <div className='markerInfo'> */}
						{data.map((laundromatData) => {
							return (
								// <div>
									<AnyReactComponent
										lat={laundromatData.geometry.location.lat}
										lng={laundromatData.geometry.location.lng}
										// text={laundromatData.name}
										text={' '}
										key={laundromatData.id} />
								// </div>
							);
							this.setState({
								center: {
									lat: laundromatData[0].geometry.location.lat,
									lng: laundromatData[0].geometry.location.lng
								}
							});
						})}
					{/* </div> */}
			</GoogleMapReact>
		);
	}
}
