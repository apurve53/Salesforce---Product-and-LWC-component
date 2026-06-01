public with sharing class CertificateProcessor {

	@AuraEnabled
	public static void processCertificate( Id contactId, String templateContent) {
		try {
			Contact con = [
				SELECT
					Id,
					Name,
					Email,
					Role__c,
					Duties_Summary__c,
					CreatedDate,
					Certificate_Issue_Date__c
				FROM Contact
				WHERE Id = :contactId
				LIMIT 1
			];
			String processedContent = templateContent;
			processedContent = processedContent.replace('{{FULL_NAME}}', con.Name);
			processedContent = processedContent.replace('{{ROLE}}', con.Role__c);
			processedContent = processedContent.replace('{{START_DATE}}', String.valueOf(con.CreatedDate.date()));
			processedContent = processedContent.replace('{{END_DATE}}',String.valueOf(con.Certificate_Issue_Date__c));
			processedContent = processedContent.replace('{{DUTIES_SUMMARY}}',con.Duties_Summary__c);
			System.debug('content : ' + processedContent); 
			Blob fileBlob = Blob.valueOf(processedContent);
			Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
			attachment.setFileName('Certificate.html');
			attachment.setBody(fileBlob);
			attachment.setContentType('text/html');
			Messaging.SingleEmailMessage
			email = new Messaging.SingleEmailMessage();
			email.setToAddresses( new String[] { con.Email } );
			email.setSubject('Your Certificate');
			email.setPlainTextBody('Please find attached certificate.');
			email.setFileAttachments( new Messaging.EmailFileAttachment[] { attachment});
			List<Messaging.SendEmailResult> results =  Messaging.sendEmail( new Messaging.SingleEmailMessage[] { email });
			for (Messaging.SendEmailResult res : results) {
			    if (res.isSuccess()) {
			        System.debug('Email was successfully accepted by Salesforce and queued for routing.');
			    } else {
			        // Inspect the underlying failure array to debug formatting or setup errors
			        List<Messaging.SendEmailError> errors = res.getErrors();
			        for (Messaging.SendEmailError err : errors) {
			            System.debug('Queue Failure Reason: ' + err.getMessage());
			        }
			    }
			}
		}catch (Exception e) {
			System.debug('Error Type: ' + e.getTypeName());
			System.debug('Error Message: ' + e.getMessage());
			System.debug('Line Number: ' + e.getLineNumber());
			System.debug('Stack Trace: ' + e.getStackTraceString());
		}
	}
}