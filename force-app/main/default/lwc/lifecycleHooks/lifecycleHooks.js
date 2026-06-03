import { api, LightningElement, track, wire } from 'lwc';
import { publish, MessageContext, subscribe } from 'lightning/messageService';
import ISOPEN_CHANNEL from '@salesforce/messageChannel/IsOpen__c';
export default class LifecycleHooks extends LightningElement {
	@wire( MessageContext ) messageContext;
	@track isOpen;
	subscription = null;
	constructor () {
		super(); // Always call super() first in the constructor
		console.log( '%c1. Constructor Fired', 'color: #2563eb; font-weight: bold;' );
		this.isOpen = true;
		// Component is created, but elements are not in the DOM yet
	}

	connectedCallback () {
		console.log( 'on open Lifecycle hook :: , lifeCycleHooks isOpend :: ', this.isOpen );
		publish( this.messageContext, ISOPEN_CHANNEL, { 'isOpened': this.isOpen } );
		console.log( '%c2. ConnectedCallback Fired', 'color: #16a34a; font-weight: bold;' );
		// Component is inserted into the DOM. Good for fetching data.

		if ( !this.subscription ) {
			this.subscription = subscribe(
				this.messageContext,
				ISOPEN_CHANNEL,
				( message ) => {
					console.log( 'reciving subscription message ::', message.isOpened );
					this.isOpen = message.isOpened;
				}
			);
		}
	}

	renderedCallback () {
		console.log( '%c3. RenderedCallback Fired', 'color: #ca8a04; font-weight: bold;' );
		// Component has finished rendering. Fires on initial load AND every UI update.
	}

	disconnectedCallback () {
		console.log( '%c4. DisconnectedCallback Fired', 'color: #dc2626; font-weight: bold;' );
		publish( this.messageContext, ISOPEN_CHANNEL, { 'isOpened': this.isOpen } );
		// Component is removed from the DOM. Good for cleaning up timers or listeners.
	}

	errorCallback ( error, stack ) {
		console.log( '%c5. ErrorCallback Fired', 'color: #7c3aed; font-weight: bold;' );
		console.error( 'Error Details:', error );
		console.error( 'Stack Trace:', stack );
		// Captures errors that happen in any child components.
	}
}