public with sharing class CaseConsoleController {
	
	@AuraEnabled(cacheable=true)
	public static Case getCaseDetails(Id caseId) {
		return [
			SELECT Id, CaseNumber, Subject, Status, Priority, Description,
			Account.Name, Contact.Name, CreatedDate, Owner.Name
			FROM Case 
			WHERE Id = :caseId 
			WITH SECURITY_ENFORCED
			LIMIT 1
		];
	}

	@AuraEnabled
	public static void postMessage(Id caseId, String messageBody) {
		if (String.isBlank(messageBody)) {
			// throw new AuraHandledException('Message body cannot be empty.');
			System.debug('Error in Post message CaseConsoleController.class');
		}
		
		FeedItem post = new FeedItem();
		post.ParentId = caseId;
		post.Body = messageBody;
		post.Type = 'TextPost';
		insert as system post;
	}
}
