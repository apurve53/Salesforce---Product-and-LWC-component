import { LightningElement, api } from 'lwc';
import processCertificate from '@salesforce/apex/CertificateProcessor.processCertificate';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class SendCertificateUploader extends LightningElement {
	@api recordId;
	fileContent;
	handleFileUpload(event) {
		console.log('uploading');
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onload = () => {
				this.fileContent = reader.result;
				console.log('Upload done :: ', this.fileContent);
			};
		}
	}

	sendCertificate() {
		console.log('This is content :: ', this.fileContent);
		processCertificate({ contactId: this.recordId, templateContent: this.fileContent })
			.then(() => {
				console.log('in the then ', this.recordId);

				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Success',
						message: 'Certificate Sent',
						variant: 'success'
					})
				);
			})
			.catch(error => {
				console.log(error);
				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Error',
						message: error.body.message,
						variant: 'error'
					})
				);
			});
	}
}