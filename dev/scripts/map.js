import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div className='markerFlag'>{text}</div>;

export default class SimpleMap extends Component {
  // static defaultProps = {
  //   center: {lat: 59.95, lng: 30.33},
  //   zoom: 11
	constructor() {
		super();
	}
	render() {
		var latitude = this.props.lat;
		var longitude = this.props.lng;
		var data = this.props.data;
		console.log(data);
		return (
			<GoogleMapReact
				defaultCenter={{lat: latitude,lng: longitude}}
				defaultZoom={4}
				apiKey={'AIzaSyDcyjwPm5OjBxyMNY9W3UJkJCpmfOMGJk0'}
				>
					<div className='markerInfo'>
						{data.map((laundromatData) => {
							return (
								<div>
									<AnyReactComponent lat={laundromatData.geometry.location.lat} lng={laundromatData.geometry.location.lng} text={laundromatData.name} key={laundromatData.id} />
									{console.log(laundromatData.geometry)}
									{console.log(laundromatData.geometry.location.lat)}
									{console.log(laundromatData.geometry.location.lng)}
								</div>
							)
						})}
					</div>
			</GoogleMapReact>
		);
	}
}
