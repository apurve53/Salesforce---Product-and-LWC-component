import { LightningElement, wire, track } from 'lwc';
import getMyCases from '@salesforce/apex/CommunityCaseController.getMyCases';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class MyCases extends NavigationMixin(LightningElement) {
	@track cases = [];
	@track wiredCasesResult;
	currentRefreshValue;
	navigateToCreateCase() {
		this[NavigationMixin.Navigate]({
			type: 'comm__namedPage',
			attributes: {
				name: 'create_case__c'
			}
		});
	}

	handleCaseClick(event) {
		// Gets the ID from the clicked button's data-id attribute
		const caseId = event.target.dataset.id;
		console.log('case Id : ', caseId);
		// Navigates directly to the case record page
		this[NavigationMixin.Navigate]({
			type: 'comm__namedPage',
			attributes: {
				name: 'case_detail__c'
			},
			state: {
				c__caseId: caseId
			}
		});
	}

	@wire(CurrentPageReference)
	async getStateParameters(pageRef) {
		const newRefreshValue = pageRef.state.c__refresh;
		await refreshApex(this.wiredCasesResult);
	}

	@wire(getMyCases)
	wiredCases(result) {
		this.wiredCasesResult = result;
		if (result.data) {
			this.cases = [...result.data];
		}
		else if (result.error) {
			console.error(result.error);
		}
	}

	connectedCallback() {
		refreshApex(this.wiredCasesResult);
	}


}