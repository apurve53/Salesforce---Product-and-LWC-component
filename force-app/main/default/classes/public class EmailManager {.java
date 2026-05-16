public class EmailManager {
	public static void emailSend(){
		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    	// Query your template
		EmailTemplate et = [SELECT Id FROM EmailTemplate WHERE DeveloperName = 'Product Marketing' LIMIT 1];
		mail.setTemplateId(et.Id);
		mail.setTargetObjectId(recipientId); // Contact or Lead Id
		mail.setSaveAsActivity(true);
		// Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
	}
}