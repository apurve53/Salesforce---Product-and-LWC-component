import { LightningElement, api } from 'lwc';

export default class ProductList extends LightningElement {
	@api products;

	handleDispatch(event) {
		this.dispatchEvent(new CustomEvent('likedislike', {
			detail: event.detail
		}))
	}
}