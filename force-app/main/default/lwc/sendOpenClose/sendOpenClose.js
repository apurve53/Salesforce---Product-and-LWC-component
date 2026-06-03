import { LightningElement, wire } from 'lwc';
import { publish, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ISOPEN_CHANNEL from '@salesforce/messageChannel/IsOpen__c';
//Is it possible that a single message channel can send Message ontext from both side components?
export default class SendOpenClose extends LightningElement {
	@wire( MessageContext ) messageContext;
	isOpen = false;
	subscription = null;
	openClose () {
		console.log( 'on command Before publishing in drndOpenClose is Open :: ', this.isOpen );
		publish( this.messageContext, ISOPEN_CHANNEL, { 'isOpened': !this.isOpen } );
	}

	connectedCallback () {
		if ( !this.subscription ) {
			this.isOpen = subscribe( this.messageContext, ISOPEN_CHANNEL, ( message ) => {
				this.isOpen = message.isOpened;
				console.log( 'This isOpen ::', this.isOpen );
			} )
		}
	}

	disconnectedCallback () {
		if ( this.subscription ) {
			unsubscribe( this.subscription );
			this.subscription = null;
		}
	}
}