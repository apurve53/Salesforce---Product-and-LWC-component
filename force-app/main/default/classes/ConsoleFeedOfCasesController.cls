public without sharing class ConsoleFeedOfCasesController {
	@AuraEnabled(cacheable=true)
	public static List<ConversationWrapper> getConversationItems(Id caseId) {
		
		System.debug('Chat caseId :: ' +JSON.serialize(caseId));
		List<ConversationWrapper> chatList = new List<ConversationWrapper>();
		if (caseId == null) {
			System.debug('Blocked a null caseId execution.');
			return chatList; 
		}

		// Fetching Chatter/Feed items as conversation message
		List<FeedItem> feedItems = [
			SELECT Id, Body, CreatedDate, CreatedBy.Name, InsertedById
			FROM FeedItem 
			WHERE ParentId = :caseId AND Type = 'TextPost'
			WITH SECURITY_ENFORCED
			ORDER BY CreatedDate ASC
		];

		Id currentUserId = UserInfo.getUserId();
		
		for (FeedItem fi : feedItems) {
			ConversationWrapper msg = new ConversationWrapper();
			msg.id = fi.Id;
			if (fi.Body != null) {
				msg.body = fi.Body.stripHtmlTags();
			}
			// msg.body = fi.Body;
			msg.createdDate = fi.CreatedDate;
			msg.senderName = fi.CreatedBy.Name;
			// Determine if the message is from the logged-in agent or someone else
			msg.isCurrentAgent = (fi.InsertedById == currentUserId);
			chatList.add(msg);
		}
		System.debug('Chat List :: ' +JSON.serialize(chatList));
		return chatList;
	}

	public class ConversationWrapper {
		@AuraEnabled public String id {get;set;}
		@AuraEnabled public String body {get;set;}
		@AuraEnabled public DateTime createdDate {get;set;}
		@AuraEnabled public String senderName {get;set;}
		@AuraEnabled public Boolean isCurrentAgent {get;set;}
	}
}