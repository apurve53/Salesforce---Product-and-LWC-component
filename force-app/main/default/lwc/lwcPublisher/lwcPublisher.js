import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_CHANNEL from '@salesforce/messageChannel/RecordSelectChannel__c';

export default class LwcPublisher extends LightningElement {
	@wire( MessageContext ) messageContext;
	count = 0;
	sendData () {
		const payload = { recordId: this.count };
		publish( this.messageContext, RECORD_CHANNEL, payload );
	}

	connectedCallback () {
		setInterval( () => {
			this.count++;
			this.sendData();
		}, 1000 );
	}
}