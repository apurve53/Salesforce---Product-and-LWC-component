import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';
export default class Custom_home extends LightningElement {
	userId = USER_ID;
	userName;
	userEmail;
	isLoading = true;

	connectedCallback() {
		console.log('other user Info : ', JSON.stringify(NAME_FIELD), ' :: ', EMAIL_FIELD);
	}

	@wire(getRecord, { recordId: '$userId', fields: [NAME_FIELD, EMAIL_FIELD] })
	userData({ error, data }) {
		if (data) {
			this.userName = data.fields.Name.value;
			this.userEmail = data.fields.Email.value;
			this.isLoading = false;
		} else if (error) {
			console.error('Error retrieving user data:', error);
			this.isLoading = false;
		}
	}
}