import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div className='markerFlag'><div className='flagText'>{text}</div></div>;

export default class SimpleMap extends Component {
	constructor() {
		super();
		this.state = {
			currentZoom: 14,
		}
	}
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
						console.log(laundromatData);
						return <AnyReactComponent
							lat={laundromatData.geometry.location.lat}
							lng={laundromatData.geometry.location.lng}
							text={laundromatData.name}
							key={laundromatData.id} />;
					})}
			</GoogleMapReact>
		);
	}
}
