import { LightningElement, wire, track } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import RECORD_CHANNEL from '@salesforce/messageChannel/RecordSelectChannel__c';

export default class LwcSubscriber extends LightningElement {
	@track messageReceived = '';
	@wire( MessageContext ) messageContext;
	subscription = null;
	connectedCallback () {
		// subscribe(this.messageContext,RECORD_CHANNEL,(message) => {
		// 	this.messageReceived=message.recordId;
		// });
		if ( !this.subscription ) {
			this.subscription = subscribe(
				this.messageContext,
				RECORD_CHANNEL,
				( message ) => {
					this.messageReceived = message.recordId;
				}
			);
		}
	}
	disconnectedCallback () {
		if ( this.subscription ) {
			unsubscribe( this.subscription );
			this.subscription = null;
		}
	}
}
