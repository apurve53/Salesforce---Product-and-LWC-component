public with sharing class CommunityCaseController {
    @AuraEnabled
    public static Case createCommunityCase(String subject, String description, String priority) {
        try {
            // 1. Get the logged-in community user's contact and account info
            User currentUser = [
                SELECT ContactId, AccountId 
                FROM User 
                WHERE Id = :UserInfo.getUserId() 
                LIMIT 1
            ];
            
            // 2. Initialize the case with user input
            Case newCase = new Case();
            newCase.Subject = subject;
            newCase.Description = description;
            newCase.Priority = priority;
            newCase.Origin = 'Web'; // Tracks that it came from the portal
            
            // 3. CRITICAL: Link the case to the user so your Sharing Set works
            if (currentUser.ContactId != null) {
                newCase.ContactId = currentUser.ContactId;
                newCase.AccountId = currentUser.AccountId;
            } else {
                throw new AuraHandledException('Error: Current user is not a valid community user.');
            }
            
            // 4. Insert the record securely
            insert as user newCase; 
            return newCase;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static case createCase(String subject, String description, String priority, String typeValue){
        Id userId = UserInfo.getUserId();
        System.debug('Current user Id : ' + userId);
        System.debug('all Params :' + subject + ':: ' + description + ' :: ' + priority + '::' + typeValue);
        User currentUser = [
            SELECT Id, ContactId
            FROM User
            WHERE Id = :userId
            LIMIT 1
        ];
        if(currentUser.ContactId == null){
            // AuraHandledException ex = new AuraHandledException('No contact is linked with this community user.');
            // ex.setMessage('No contact is linked with this community user.');
            // throw ex;
            // return 'User not found';
            System.debug(' User Not found');
        }
        Case newCase = new Case();
        newCase.Subject = subject;
        newCase.Description = description;
        newCase.Priority = priority;
        newCase.Type = typeValue;
        newCase.Status = 'New';
        newCase.Origin = 'Community';
        newCase.ContactId = currentUser.ContactId;
        insert newCase;
        return newCase.Id;
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getMyCases() {
        Id userId = UserInfo.getUserId();
        User u = [
            SELECT ContactId
            FROM User
            WHERE Id = :userId
            LIMIT 1
        ];
        if(u.ContactId == null){
            return new List<Case>();
        }

        List<case> returningCase = [
            SELECT Id,
                   CaseNumber,
                   Subject,
                   Status,
                   Priority,
                   CreatedDate
            FROM Case
            WHERE ContactId = :u.ContactId
            ORDER BY CreatedDate DESC
        ];
        System.debug('List of cases : ' + JSON.serialize(returningCase));
        return returningCase;
    }
}
