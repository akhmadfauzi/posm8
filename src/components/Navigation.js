import React, { Component } from 'react';

class Navigation extends Component {
	render() {
		const cart = this.props.cart;
		const cartCount = cart.length > 0 ? (<span className="badge">{cart.length}</span>) : '';
		return (
			<nav className="nav">
				<ul className="left">
					<li>Swalon</li>
				</ul>

				<ul className="right">
					<li><button className="nav-cart-open" data-cart-nav="open" onClick={this.props.onCartClick.bind(this)}><i className="fa fa-shopping-cart"></i> Cart {cartCount}</button></li>
				</ul>
			</nav>
		);
	}
}

export default Navigation;