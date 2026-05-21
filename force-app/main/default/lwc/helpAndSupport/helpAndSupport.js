import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class HelpAndSupport extends NavigationMixin(LightningElement) {
	handleRedirect() {
		this[NavigationMixin.Navigate]({
			type: 'comm__namedPage',
			attributes: {
				name: 'help_support__c'
			}
		});
	}
}
