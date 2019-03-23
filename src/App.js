import React, { Component } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import Navigation from './components/Navigation';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';

var productLink = 'https://api.jsonbin.io/b/5c8f06732d33133c40155809/9';
var key = '$2a$10$Sv7oWDHBiXDaUnQ26ruN7.mxTX1YNwHa1n2pRqsuBmZ1FEqkm40bK';

class App extends Component {
	constructor(props) {
		super(props)
		this.state = { 
			'products': null,
			'openCart': false,
			'cartItems':[],
			'productDetail': null,
			'openProduct':false,
			'cartSlide':false,
			'imageLoaded': false
		};
		this.getProducts = this.getProducts.bind(this);
		this.onProductClickHandler = this.onProductClickHandler.bind(this);
		this.overlayClickHandler = this.overlayClickHandler.bind(this);
		this.addToCartHandler = this.addToCartHandler.bind(this);
	}

	componentDidMount() {
		this.getProducts();
	}

	getProducts() {
		let self = this;
		var localStore = localStorage.getItem('products');
		if(!localStore){
			fetch(productLink, {
				'headers': {
					'secret-key': key
				}
			})
			.then(function (response) {
				if (response.status !== 200) {
					console.log('load fails');
					return false;
				}
				return response.json();
			})
			.then(function (products) {
				console.log('Success');
				// self.setState({ 'products': products });
				localStorage.setItem('products', JSON.stringify(products));
				self.setState({
					'products':products
				})
			});
		}else{
			self.setState({
				'products':JSON.parse(localStore)//.slice(0,16)
			})
		}
		
	}

	addToCartHandler(item){
		let temp=[];
		let currentCart = this.state.cartItems;
		var product = this.findProductById(item);
		if(!currentCart.length){
			temp.push(product);			
			this.setState({'cartItems': temp});
		}else{
			currentCart.push(product);	
			this.setState({'cartItems': currentCart});		
		}
	}

	checkDuplication(){

	}

	

	findProductById(id){
		var products = this.state.products;
		for (let i = 0; i < products.length; i++) {
			if(products[i].id === id){
				return products[i];
			}
		}

		return null;
	}		

	onCartMenuClickHandler(e){
		e.preventDefault();
		console.log(this.state.cartItems);
		let target = e.target;
		if(target.dataset.cartNav === 'open'){
			this.setState({'openCart':true});
			document.body.className = 'modal-open';
			setTimeout((self)=>{
				self.setState({'cartSlide':true});
			},150,this);		
		}else{
			this.setState({'openCart':false,'cartSlide':false});
			document.body.className = '';
			
		}
	}

	onProductClickHandler(e){
		e.preventDefault();
		let target = e.target;
		let data = target.dataset;
		let product = this.findProductById(data.id);
		this.setState({'openProduct':true,'productDetail':product});
		document.body.className = 'modal-open';
	}	

	overlayClickHandler(e){
		this.setState({
			'openProduct':false,
			'openCart':false,
			'cartSlide':false,
			'imageLoaded':false
		});
		document.body.className = '';

	}

	checkImageHandler(e){
		if(e.target.src){
			this.setState({'imageLoaded':true});
		}else{
			console.log('wait a moment');
		}
	}


	render() {
		let products = this.state.products ? this.state.products : null;
		
		if (!products) {
			return (
				<div className="App">
					Loading...
				</div>
			);
		} else {
			const isDetail = this.state.openProduct ? true : false;
			let detail = isDetail ? (
			<ProductDetails 
				imageLoaded={this.state.imageLoaded} 
				checkImage={this.checkImageHandler.bind(this)} 
				overlayClick={this.overlayClickHandler} 
				openProduct={this.state.openProduct} 
				product={this.state.productDetail}
				addToCart={this.addToCartHandler}>
			</ProductDetails>) : '';
			let cart = this.state.openCart ? (
				<Cart 
					selectedProducts={this.state.cartItems}
					onCartClose={this.onCartMenuClickHandler.bind(this)} 
					openCart={this.state.openCart}
					overlayClick={this.overlayClickHandler}
					cartSlide={this.state.cartSlide}>
				</Cart>
			) : '';

			return (
				<React.Fragment>
					<Navigation onCartClickMenu={this.onCartMenuClickHandler.bind(this)} cart={this.state.cartItems}></Navigation>
					{cart}
					<div className="App">
						{/* <div className="search-bar">
							<input type="text" name="" id="" placeholder="Search product"/>
						</div> */}
						<ProductList 
							products={products} 
							addToCart={this.addToCartHandler}
							onProductClick={this.onProductClickHandler}>
						</ProductList>
					</div>
					{detail}
				</React.Fragment>
			);
		}

	}
}

export default App;

