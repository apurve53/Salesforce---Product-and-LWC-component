import { LightningElement, track, api } from 'lwc';
import getContactIdsByEmail from '@salesforce/apex/EmailManager.getContactIdsByEmail';
import emailSend from '@salesforce/apex/EmailManager.emailSend';

export default class ToShareCollectEmails extends LightningElement {
	emailInput = '';
	isEmailsListHavingEmails = true;
	@track emailList = [];
	hasEmails = false;
	@api product;
	@track inputField;

	connectedCallback() {
		console.log('Product to share in toShare: ', this.product);
	}
	handleChange(event) {
		this.emailInput = event.target.value;
		this.inputField = event.currentTarget;
		if (this.inputField) {
			this.inputField.reportValidity();
		}
		if (this.emailInput.length === 0) {
			this.inputField.setCustomValidity('');
			this.inputField.reportValidity();
		}
	}

	// Here I will check if there is any COntect Id is present with Entered Email Id.
	handleSearchContact() {

		/*This opration is sending EMails to the COntect or Leads where We need the Lead or Contact Id to send Emails.
		// this.emailList.push(this.emailInput);
		/* Execute the imperative apex call */
		// getContactIdsByEmail({ emailId: this.emailInput })
		// 	.then((result) => {
		// 		// 'result' contains email id returned from Apex.
		// 		console.log('the id is : ', result);
		// 		if (!result) {
		// 			this.inputField.setCustomValidity('No matching contact found for this email.');
		// 			this.inputField.reportValidity();
		// 		} else {
		// 			this.emailList.push({ 'id': result, 'email': this.emailInput });
		// 			this.hasEmails = true;
		// 			this.emailInput = '';
		// 			this.inputField.setCustomValidity('');
		// 			this.inputField.reportValidity();
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		this.inputField.reportValidity();
		// 		console.error('Error fetching contact IDs:', error);
		// 	});
	}

	handleAdd() {
		console.log('aa');
		if (!this.emailInput) {
			this.inputField.setCustomValidity('No email.');
			this.inputField.reportValidity();
			return;
		}
		// Prevent duplicate emails
		if (this.emailList.includes(this.emailInput)) {
			console.log('cc');
			this.inputField.setCustomValidity('Duplicate Email.');
			this.inputField.reportValidity();
			return;
		}
		this.emailList.push(this.emailInput);
		// let id = this.emailList.push({ 'id': result, 'email': this.emailInput });
		this.hasEmails = true;
		this.emailInput = '';
		this.inputField.setCustomValidity('');
		this.inputField.reportValidity();


		// FUnction is callling Apex method to make changes and crating Contect Ids list
		// this.handleSearchContact();
	}

	handleRemove(event) {
		const index = event.target.dataset.index;
		this.emailList = this.emailList.filter(
			(_, i) => i != index
		);
		// this.hasEmails = this.emailList.length === 0 ? false : true;
	}
	// Close Modal
	closeShareModal() {
		this.emailInput = '';
		this.emailList = [];
		this.dispatchEvent(new CustomEvent('openorclose'));
	}

	handleSendEmail(evt) {
		evt.stopPropagation();
		console.log('Product for apex method: ', this.product);
		let toSend = { 'emailList': this.emailList, 'product': this.product };
		console.log('what to hsare : ', JSON.stringify(toSend));
		emailSend(toSend).then((result) => {
			console.log('THis is sending infor ', result);
		}).catch(error => console.log('Server side Error, ', error))
	}
}