public class EmailManager {
	/*
	This is how we can send Email Template with the emails. Where we need Contect or 
	*/
	// public static void emailSend(List<Contact> conList, ProductAndLWCService.EmailValuesWrapper products){
	// 	conList = [SELECT Id, Name, CreatedById, CreatedBy.Name FROM Contact WHERE CreatedDate = TODAY LIMIT 2];
	// 	List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
	// 	EmailTemplate et = [SELECT Id, Name, HtmlValue FROM EmailTemplate WHERE Name = 'Product Marketing' LIMIT 1];
	// 	String preparedEmailTemplate = changeEmailBody(et.HtmlValue, products);
	// 	for(Contact con : conList){
	// 		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
	// 		mail.setTemplateId(et.Id);
	// 		mail.setTargetObjectId(con.Id); // Contact or Lead Id
	// 		mail.setSaveAsActivity(true);
	// 		mail.setHtmlBody(preparedEmailTemplate);
	// 		emailList.add(mail);
	// 	}
	// 	// Messaging.sendEmail(emailList);
	// }

	private static String changeEmailBody(String htmlString,  Map<String, Object>  product){
		htmlString = htmlString.replace('&amp;ProductName&amp;', JSON.serialize(product.get('name')));
		htmlString = htmlString.replace('&amp;ProductPrice&amp;', String.valueOf(product.get('price')));
		htmlString = htmlString.replace('&amp;ProductImageUrl&amp;', JSON.serialize(product.get('imageUrl')));
		htmlString = htmlString.replace('&amp;ProductLink&amp;', JSON.serialize(product.get('link')));
		return htmlString;
	}

	@AuraEnabled
	public static Boolean emailSend(List<String> emailList, Map<String, Object> product){
		
		try {
			System.debug('Sharing :::' + JSON.serialize(emailList));
			System.debug('Sharing :::' + JSON.serialize(product));
			if (emailList != null && !emailList.isEmpty()) {
				EmailTemplate et = [SELECT Id, Name, HtmlValue FROM EmailTemplate WHERE Name = 'Product Marketing' LIMIT 1];
				System.debug('This is et html :' + et.HtmlValue);
				String body = changeEmailBody(et.HtmlValue, product);
				System.debug('body :' + body);
				Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
				mail.setToAddresses(emailList);
				mail.setSubject('Product Shared With You');
				mail.setHtmlBody(body);
				List<Messaging.SendEmailResult> results = Messaging.sendEmail( new Messaging.SingleEmailMessage[] { mail });
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
			}
			return true;
		} catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
	}

	
	
	
	@AuraEnabled
    public static String getContactIdsByEmail(String emailId) {
        // Null/empty sanity check
        if (String.isNotBlank(emailId)) {
           List<Contact> contacts = [SELECT Id FROM Contact WHERE Email = :emailId WITH USER_MODE LIMIT 1];
		   if (!contacts.isEmpty()) {
            	return contacts[0].Id;
        	}
		}
		return null;
    }
}