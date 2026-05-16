public with sharing class EmailManagerService {
    public class RecipientWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String email;
    }

    public class ShsreProductWrapper{
		@AuraEnabled Map<String, Object> product;
		@AuraEnabled List<EmailManagerService.RecipientWrapper> contacts;

		ShsreProductWrapper(Map<String, Object> product, List<RecipientWrapper> contacts){
			this.product = new Map<String, Object>{product};
			this.contacts = new List<EmailManagerService.RecipientWrapper>(contacts);
		}
	}
}