import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route, Link} from 'react-router-dom';
import {ajax} from 'jquery';

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
	render() {
		return (
			<Router>
				<div>
					<header>
						<a href='/' className='homeLink'>
							<img className='logo' src='./assets/washer.svg' alt='drawing of a front-loading washing machine' />
							<h1>The Laundry Mentor</h1>
							<h3>Helping you get your laundry done one icon at a time.</h3>
						</a>
					</header>

					<div className='wrapper'>
						<Route path='/tips' component={LaundrySteps} />
					</div>

					<div className='wrapper'>
						<Route path='/problems' component={LaundryFAQ} />
					</div>

					<div className='wrapper'>
						<Route exact path='/' component={Gallery} />
					</div>

					<nav>
						<div className='wrapper'>
							<p>Need some extra help with your laundry?</p>
							<div className='links'>
								<Link to='/tips'>📝  Laundry Step-by-Step</Link>
								<Link to='/problems'>😱  Common Laundry Problems</Link>
							</div>
						</div>
					</nav>
					<Footer />
				</div>
			</Router>
		)
	}
}

class Gallery extends React.Component {
	constructor() {
		super();
		this.state = {
			clickedIconURL: null,
			clickedIconDescription: null,
			clickedIconCategory: null,
			iconArray: [],
			geolocationLat: 43.655662,
			geolocationLng: -79.400273,
			data: [],
			loaderOn: false
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
			}, () => {
					var mixer = mixitup('#gallery');
				}
			);
		});
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
				confirmButtonColor: '#82D4BB'
			});
		});
	}
	getLocation() {
		// if successful store coordinates as latitude and longitude
		this.setState ({
			loaderOn: !this.state.loaderOn
		})
		var success = (position) => {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
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
					data: nearbyLaundry,
					geolocationLat: nearbyLaundry[0].geometry.location.lat,
					geolocationLng: nearbyLaundry[0].geometry.location.lng,
					loaderOn: !this.state.loaderOn
				});
				// // add displayNone class to button
				var addClass = document.getElementById('geoButton');
				addClass.className += 'displayNone';
				// add displayNone class to overlay
				var addClass = document.getElementById('overlay');
				addClass.className += 'displayNone';
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
		let loadMap;
		if (this.state.loaderOn) {
			loadMap = (
				<button className="spinner">
					<div className="bounce1"></div>
					<div className="bounce2"></div>
					<div className="bounce3"></div>
				</button>
			)
		} else {
			loadMap = (
				<button onClick={this.getLocation} id='geoButton'>Find your closest laundromat</button>
			)
		}
		return (
			<div className='gallery'>
				{/* MixItUp filter buttons */}
				<div className='filterButtons'>
					<h4>Filter:</h4>
					<button type="button" data-filter="all">All</button>
					<button type="button" data-filter=".bleaching">Bleaching</button>
					<button type="button" data-filter=".washing">Washing</button>
					<button type="button" data-filter=".drying">Drying</button>
					<button type="button" data-filter=".ironing">Ironing</button>
					<button type="button" data-filter=".professional">Dry Cleaning</button>
				</div>
				<h4>Click on an icon below to decipher your clothing's laundry tag.</h4>
				{/* display gallery images */}
				<div id="gallery">
					{this.state.iconArray.map((icon) => {
						return <div className={'galleryItem mix ' + icon.category} key={this.state.iconArray.indexOf(icon)} onClick={() => this.storeIcon(icon)}>
							<img src={`${icon.URL}`} />
						</div>
					})}
				</div>
				<div id='map' ref='map'>
					{loadMap}

					<div id='overlay'></div>
					<Map lat={this.state.geolocationLat} lng={this.state.geolocationLng}  data={this.state.data}/>
				</div>
			</div>
		)
	}
}

class LaundryFAQ extends React.Component {
	render() {
		return (
			<div>
				<a href='/' className='backLinks'>← Back</a>
				<h1>Most Common Laundry Problems</h1>
				<h3>Need more help? Check out some answers to the most common laundry problems.</h3>
				<div className='troubleshooting'>
					<h4>You notice detergent residue (white streaks) on clothes.</h4>
					<p>Your powdered detergent isn’t dissolving properly. Make sure the loads aren’t too full. If you are overstuffing the washer, your clothes don’t get clean, and the detergent won’t get washed away. Use liquid detergent with cold-water cycles. Try letting the washer fill with water, adding the detergent, and then adding the clothes. If the problem is caused by hard water, try using a water-softening product in the next load. To remove hard-water residue from clothes, soak them in a solution of 1 cup white vinegar per 1 gallon warm water. Rinse and rewash. You may also need to clean your washer: </p>
					<h4>You have a problem with pilling.</h4>
					<p>This is most common among synthetic fabrics. Try turning synthetic clothing inside out before washing. (Pilling is caused by abrasion of fibers, and this cuts down on abrasion during the wash and dry cycles.) You can also wash your synthetics together in a gentler, shorter cycle. Using a liquid detergent will help. To remove pills, snip them off with a battery-powered pill remover (available at sewing stores and discount retailers) or pull the fabric tight over a curved surface and carefully shave the pills off with a safety razor.</p>
					<h4>There’s a lot of lint on your clothes.</h4>
					<p>You probably need to sort better. Separate lint producers, such as fleece sweat suits, chenille items, new terry cloth towels, and flannel pajamas, from lint attractors, such as corduroys, synthetic blends, and dark fabric. To remove the lint, use a lint roller or pat with the sticky side of masking or packing tape. Check to make sure pockets are empty of tissues and other paper before you wash. Make sure the washer and dryer lint filters are clean.</p>
					<h4>You have sweat stains on your white T-shirts.</h4>
					<p>Many antiperspirants contain aluminum chloride, which reacts with sweat and discolours light fabrics. None are foolproof, but there are a few ways to get rid of these unsightly yellow stains. Turn the shirt inside out and rinse in cold water. For old stains, sponge with white vinegar, let it set for at least thirty minutes, and launder in the hottest water recommended for the fabric. Don't use the dryer, which will set the stain. For new stains, try rubbing with ammonia (1 tablespoon to 1/2 cup water) before washing. If that doesn't work, try Clorox—but not together with ammonia, unless you want to pass out on your laundry room floor.</p>
				</div>
			</div>
		)
	}
}

class LaundrySteps extends React.Component {
	render() {
		return (
			<div className='laundrySteps'>
				<a href='/' className='backLinks'>← Back</a>
				<h1>Laundry Step-by-Step</h1>
				<h3>If you're new to doing your own laundry, here's a step-by-step process.</h3>
				<div className='steps'>
					<ol>
						<li>Check your clothing’s tags to make sure you separate out the ones that need special care.</li>
						<li>Separate your laundry into four piles: whites, lights/brights, darks/blacks, and delicates. You may also need a separate load for towels or sheets.</li>
						<li>Perform a last-minute check and empty out all pockets, close zippers to prevent snagging, turn denim and embellished pieces inside out, pre-treat any stains, and put your delicates (underpinnings, lingerie, tights, and anything with lace) in mesh bags. Most stains will come out with a few spritzes of stain remover before being put in the washer, but blood and grease/oil are two substances that will <a href='https://www.thespruce.com/stain-removal-guide-3893802' target='_blank'>need extra attention</a> to get them out.</li>
						<li>Choose your temperature setting. Cold water is good for fine fabrics and delicates, sweaters, denim, and clothes that may shrink. It also protects new items with dark and bright colors from running. It’s also more eco-friendly! Warm water works best with whites and lights. Combined with detergent, the water temperature helps lift soil and stains while removing bacteria. Hot water is the best choice for heavily stained items and disinfecting dish and bath towels and washcloths.</li>
						<li>Choose your detergent and any other liquids needed.
							<ul>
								<li>If you have a high-efficiency washer you should use a high-efficiency (HE) detergent. HE options produce fewer suds and make it easier for HE machines to rinse out the soap. In most cases, it’ll clean just as well as regular detergent so you can use it in anything. Basically, you can always buy HE detergent for any washer but do not buy standard detergent for an HE washer.</li>
								<li>Scent-free detergent is a safe bet. People with sensitive skin should avoid laundry detergents with fragrance because fragrances are common skin allergens.</li>
								<li>Color-safe bleach works on all colors and helps removes stains. (It does not disinfect your clothing like chlorine bleach.)</li>
								<li>Chlorine bleach helps brighten whites. You should never use it on color fabrics! If your machine does not have a bleach dispenser, make sure to dilute the bleach with water first before putting it on your clothes.</li>
								<li>Fabric softener is a conditioner that keeps towels soft and fluffy and prevents static cling, but fabric softeners and antistatic dryer sheets are loaded with fragrance and should be avoided. (Dryer balls are a great alternative!)</li>
							</ul>
						You can get away with using anywhere from 1/2 to 1/8 of what the manufacturer recommends for detergent and still come away with clean clothes.
						</li>
						<li>Choose your washer cycle.
							<ul>
								<li>Regular or “normal” combines fast agitation with a fast spin cycle and is good for heavily-stained items, cottons, linen, denim, towels, and bedding.</li>
								<li>Permanent press combines fast agitation with a slow spin and is good for synthetic fibers (knits and polyesters) and prevents wrinkling.</li>
								<li>Delicate cycle combines slow agitation with a slow spin and is good for washable silks and wools, garments with embellishments, lingerie, and sheer fabrics.</li>
							</ul>
						Hand washing is a good alternative for very delicate items. Fill a kitchen or bathroom sink with cool or warm water and a little detergent. Let your delicates soak for 15-20 minutes and then rinse in clear water two to three times. Hang dry.
						</li>
						<li>Choose your drying method. If using the dryer:
							<ul>
								<li>Regular (high heat) setting is good for whites, jeans, towels, sheets, linens, and items that are pre-shrunk. Do not use this setting with clothing washed in hot water.</li>
								<li>Permanent press (medium heat) setting prevents colored garments from fading and ensures your clothes do not wrinkle or lose their shape. Do not use this setting for delicates because they will lose their shape.</li>
								<li>Delicate (low heat) setting uses a slower speed to gently dry fragile clothing and is good for knits and frail fabrics.</li>
							</ul>
						Hang drying is the best method for sturdy items, cottons, polyesters, silks, and fabrics that do not stretch. A good tip is to pin your tops by the hemline to avoid bunching at the shoulders. Knits and wool sweaters should be dried on a flat surface. Throw a clean dry towel in the dryer with wet clothes. The towel will help absorb the moisture, allowing the clothing to dry much quicker. If clothes are dry, but wrinkled—a case of “you left them sitting in the dryer too long”—toss in a clean, damp towel and turn on the dryer for 15 minute intervals into wrinkles are gone.
						</li>
					</ol>
				</div>
			</div>
		)
	}
}

class Footer extends React.Component {
	render() {
		return (
			<footer>
				<div className='wrapper'>
					<p>Thanks to <a href='http://lifehacker.com/does-it-matter-what-laundry-detergent-i-use-1121827834'>Lifehacker</a>, <a href='http://www.whowhatwear.com/are-you-doing-laundry-right-weve-got-the-dos-and-donts/'>Who What Wear</a>, <a href='http://www.artofmanliness.com/2012/08/02/heading-out-on-your-own-day-2-how-to-do-laundry/'>The Art of Manliness</a>, and my mama for the laundry advice.</p>
					<p>Developed and designed by <a href='http://kaitsykes.com'>Kait Sykes</a>. Copyright © 2017. All rights reserved.</p>
				</div>
			</footer>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
