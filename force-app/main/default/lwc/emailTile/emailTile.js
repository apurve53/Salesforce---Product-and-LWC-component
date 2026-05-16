import { LightningElement, api } from 'lwc';

export default class EmailTile extends LightningElement {
	@api email;

	handleRemove() {
		this.dispatchEvent(new CustomEvent('openorclose'));
	}

}