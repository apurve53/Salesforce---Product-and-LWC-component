public class CaseReminderBatch implements Database.Batchable<SObject>, Database.Stateful {

	private String csvContent = 'Case Number,Subject,Status,Created Date\n';

	public Database.QueryLocator start(Database.BatchableContext bc) {
		return Database.getQueryLocator( [SELECT Id, CaseNumber, Subject, Status, CreatedDate FROM Case WHERE Status = 'New' AND CreatedDate <= :System.now().addDays(-1)] );
	}

	public void execute( Database.BatchableContext bc, List<Case> scope ) {
		for(Case c : scope) {
			csvContent += '"' + c.CaseNumber + '",' + '"' + c.Subject + '",' + '"' + c.Status + '",' + '"' + String.valueOf(c.CreatedDate) + '"\n';
		}
	}

	public void finish( Database.BatchableContext bc ) {
		Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
		attachment.setFileName( 'Pending_Cases.csv');
		attachment.setBody( Blob.valueOf(csvContent) );
		attachment.setContentType( 'text/csv' );
		Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
		email.setToAddresses( new String[]{ 'apurve2014@gmail.com' } );
		email.setSubject( 'Cases Pending More Than 7 Days' );
		email.setPlainTextBody( 'Please find attached CSV report.' );
		email.setFileAttachments( new Messaging.EmailFileAttachment[]{ attachment } );
		Messaging.sendEmail( new Messaging.SingleEmailMessage[]{ email } );
	}
}