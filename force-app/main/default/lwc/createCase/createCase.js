import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createCase from '@salesforce/apex/CommunityCaseController.createCase';
import { NavigationMixin } from 'lightning/navigation';
export default class CreateCase extends NavigationMixin(LightningElement) {

	@track subject = '';
	@track description = '';
	@track priority = 'Medium';
	@track typeValue = 'Technical Issue';
	@track loading = false;
	priorityOptions = [
		{ label: 'Low', value: 'Low' },
		{ label: 'Medium', value: 'Medium' },
		{ label: 'High', value: 'High' }
	];
	typeOptions = [
		{
			label: 'Technical Issue',
			value: 'Technical Issue'
		},
		{
			label: 'Billing',
			value: 'Billing'
		},
		{
			label: 'Refund',
			value: 'Refund'
		},
		{
			label: 'General Question',
			value: 'General Question'
		}
	];

	handleSubject(event) {
		this.subject = event.target.value;
	}

	handleDescription(event) {
		this.description = event.target.value;
	}

	handlePriority(event) {
		this.priority = event.target.value;
	}

	handleType(event) {
		this.typeValue = event.target.value;
	}

	async handleCreateCase() {
		if (!this.subject || !this.description) {
			this.showToast(
				'Error',
				'Please fill all required fields.',
				'error'
			);
			return;
		}
		this.loading = true;
		try {
			const genratedCase = await createCase({
				subject: this.subject,
				description: this.description,
				priority: this.priority,
				typeValue: this.typeValue
			});
			this.showToast(
				'Success',
				'Case created successfully.',
				'success'
			);
			console.log('Created Case Id => ', JSON.stringify(genratedCase));
			this.resetForm();
			if (genratedCase?.Id) {
				this[NavigationMixin.Navigate]({
					type: 'comm__namedPage',
					attributes: {
						name: 'help_support__c'
					}
				});
			}
		}
		catch (error) {
			console.error(error);
			this.showToast(
				'Error',
				error?.body?.message || 'Something went wrong.',
				'error'
			);
		}
		finally {
			this.loading = false;
		}
	}

	resetForm() {
		this.subject = '';
		this.description = '';
		this.priority = 'Medium';
		this.typeValue = 'Technical Issue';
	}

	showToast(title, message, variant) {
		this.dispatchEvent(
			new ShowToastEvent({
				title,
				message,
				variant
			})
		);
	}
}