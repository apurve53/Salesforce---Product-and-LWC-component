import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import productWithPriceAndImage from '@salesforce/apex/ProductAndLWC.productWithPriceAndImage'
import productLikeDislike from '@salesforce/apex/ProductAndLWC.productLikeDislike';
import updateReaction from '@salesforce/apex/ProductAndLWC.updateReaction';
export default class AllProductPage extends LightningElement {

	@track products;
	reactionProductId;
	recordId;
	wiredResult

	//This function handling update of Product Reaction of user.
	handleDispatch(event) {
		updateReaction(event.detail).then(result => {
			if (result === true) {
				// console.log('result is true : ', result);
				refreshApex(this.wiredResult);

			}
		}).catch(error => {
			console.log('error : ', error);
		})
	}

	@wire(productLikeDislike)
	wiredRecords(result) {
		this.wiredResult = result;
		// console.log('wire calling :');
		const { error, data } = result;
		if (data) {
			// console.log('prods in wire :', data);
			this.products = data;
		} else if (error) {
			console.log('error in wire funciton');
		}
	}
}