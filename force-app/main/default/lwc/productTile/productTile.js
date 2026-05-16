import { api, LightningElement, track } from 'lwc';
import defaultImg from '@salesforce/resourceUrl/no_img';
import { NavigationMixin } from 'lightning/navigation';

export default class ProductTile extends NavigationMixin(LightningElement) {

	@api key;
	@api product;
	defaultImg = defaultImg;
	productUrl;
	isLiked;
	isDisliked;
	@track isModalOpen;

	// @api set product(value) {
	// 	this.product = value;
	// }

	// get product() {
	// 	console.log('tiletile')
	// 	return this.product;
	// }
	handleShareModelclose() {
		console.log('Closing in tile');
		this.isModalOpen = false;
	}
	connectedCallback() {
		this[NavigationMixin.GenerateUrl]({
			type: 'standard__recordPage',
			attributes: {
				recordId: this.product.id,
				objectApiName: 'Product2',
				actionName: 'view'
			}
		}).then(url => {
			this.productUrl = url;
		});
		if (this.product.reaction === 'Like') {
			this.isLiked = true;
		}
		this.isLiked = this.product.reaction === 'null' ? false : this.product.reaction === 'Like' ? true : false;
		this.isDisliked = this.product.reaction === 'null' ? false : this.product.reaction === 'Dislike' ? true : false;
	}

	//FUnction is responding Like or Dislike Button on Product Tile.
	handleLikeDislike(evt) {
		evt.stopPropagation();
		console.log('Prodc Id : ', evt.currentTarget.dataset.id);
		console.log('current Event : ', evt.currentTarget.title);
		console.log('current Product Reaction is Liked : ', this.isLiked);
		console.log('current Product Reaction id Disliked : ', this.isDisliked);
		let reacted = 'null';
		if (evt.currentTarget.title === 'Like') {
			reacted = this.isLiked ? null : 'Like'
		}
		if (evt.currentTarget.title === 'Dislike') {
			reacted = this.isDisliked ? null : 'Dislike'
		}
		this.dispatchEvent(new CustomEvent('likedislike', {
			detail: {
				reaction: reacted,
				productId: evt.currentTarget.dataset.id
			}
		}))
	}

	//Function responsding on Add Button click on Product Tile
	handleAddToCart(evt) {
		evt.stopPropagation();
		let recordId = evt.currentTarget.dataset.id;
	}

	//This Function is redirecting to the Product record view Page.
	handleNavigate(event) {
		event.preventDefault();
		let recordId = event.currentTarget.dataset.id;
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: recordId,
				objectApiName: 'Product2', // Ensure API name is correct
				actionName: 'view'
			}
		});
	}

	handleNativeShare(evt) {
		evt.stopPropagation();
		console.log('Sharing start');
		// console.log('This is Product to share : ', JSON.stringify(this.product));
		this.isModalOpen = true;
	}
}