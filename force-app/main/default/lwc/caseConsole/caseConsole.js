import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { CurrentPageReference } from 'lightning/navigation';

// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCaseDetails from '@salesforce/apex/CaseConsoleController.getCaseDetails';
import getConversationItems from '@salesforce/apex/ConsoleFeedOfCasesController.getConversationItems';
import postMessage from '@salesforce/apex/CaseConsoleController.postMessage';
import CASE_ID_FIELD from '@salesforce/schema/Case.Id';
import CASE_STATUS_FIELD from '@salesforce/schema/Case.Status';
import { updateRecord } from 'lightning/uiRecordApi';

export default class CaseConsole extends LightningElement {
	caseId; // Implicitly captures Case Id when loaded onto record view page

	@track caseRecord;
	@track conversations = [];
	@track newMessage = '';

	wiredConversationResult;
	wiredCaseDetail;

	// showToast(title, message, variant) {
	// 	this.dispatchEvent(
	// 		new ShowToastEvent({ title, message, variant })
	// 	);
	// }

	handleCaseClose() {
		// Ensure caseId exists before proceeding
		if (!this.caseId) {
			// this.showToast('Error', 'No Case ID found to close.', 'error');
			return;
		}
		// Construct the record input object with required fields
		const fields = {};
		fields[CASE_ID_FIELD.fieldApiName] = this.caseId;
		fields[CASE_STATUS_FIELD.fieldApiName] = 'Closed'; // Change to match your exact Picklist Value
		const recordInput = { fields };
		// Execute UI API update
		updateRecord(recordInput)
			.then(async () => {
				await refreshApex(this.wiredCaseDetail);
				// this.showToast('Success', 'Case closed successfully!', 'success');
				// Optional: Dispatch event to refresh parent component view if needed
			})
			.catch(error => {
				// this.showToast('Error closing case', error.body.message, 'error');
			});
	}

	@wire(CurrentPageReference)
	getStateParameters(pageRef) {
		if (pageRef && pageRef.state) {
			// Read the exact key name you sent ('c__caseId')
			console.log('pageRef.state.c__caseId : ', pageRef.state.c__caseId);

			this.caseId = pageRef.state.c__caseId;
			console.log('Successfully captured Case ID: ', this.caseId);
		}
	}

	@wire(getCaseDetails, { caseId: '$caseId' })
	wiredCase(result) {
		this.wiredCaseDetail = result;
		console.log('detail wire');

		if (result.data) {
			this.caseRecord = result.data;
			console.log('record view : ', JSON.stringify(this.caseRecord));
		} else {
			console.log('Data for details is not cominh');
		}

	}

	@wire(getConversationItems, { caseId: '$caseId' })
	wiredChat(result) {
		console.log('conversation wire');
		this.wiredConversationResult = result;
		if (result.data) {
			console.log('conversation :: ' + JSON.stringify(result.data));
			// Apply standard dynamic SLDS CSS Chat Layout classes 
			this.conversations = result.data.map(item => ({
				...item,
				chatClass: item.isCurrentAgent ? 'slds-chat-message__text slds-chat-message__text_outbound' : 'slds-chat-message__text slds-chat-message__text_outbound-agent'
				// bubbleClass: item.isCurrentAgent ? 'slds-chat-message slds-chat-listitem_inbound' : 'slds-chat-message slds-chat-listitem_outbound'
			}));
			this.scrollFeedToBottom();
		} else {
			console.log('no data for conversation');
		}
	}

	handleInputChange(event) {
		this.newMessage = event.target.value;
	}

	handleKeyDown(event) {
		if (event.key === 'Enter') {
			this.handleSend();
		}
	}

	async handleSend() {
		if (!this.newMessage.trim()) return;
		try {
			await postMessage({ caseId: this.caseId, messageBody: this.newMessage });
			this.newMessage = '';
			await refreshApex(this.wiredConversationResult);
			this.scrollFeedToBottom();
		} catch (error) {

		}
	}

	scrollFeedToBottom() {
		setTimeout(() => {
			const container = this.template.querySelector('.chat-scroller');
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
		}, 100);
	}
}
