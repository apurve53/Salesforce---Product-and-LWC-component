public with sharing class ProductAndLWC {

	private static Set<Id> productIds;

	@AuraEnabled
	public static List<Map<String, Object>>  productWithPriceAndImage(){
		List<PricebookEntry> pricebookEntrys = [SELECT Id, UnitPrice, Product2.Id, Product2.Name,Product2.Description from PricebookEntry WHERE IsActive = true LIMIT 10];
		productIds = new Set<Id>();
		for(PricebookEntry p : pricebookEntrys){
			productIds.add(p.Product2.Id);
		}
		List<Product_Likes_and_Dislikes__c> reactions = [SELECT Id, Product__c, User__c, Reaction__c FROM Product_Likes_and_Dislikes__c WHERE Product__c IN :productIds];
		Map<String, Product_Likes_and_Dislikes__c> ractionMap = new Map<String, Product_Likes_and_Dislikes__c>();
		for(Product_Likes_and_Dislikes__c r : reactions){
			ractionMap.put(r.Product__c, r);
		}
		List<ContentDocumentLink> links = [SELECT LinkedEntityId, ContentDocument.LatestPublishedVersionId FROM ContentDocumentLink WHERE LinkedEntityId IN : productIds];
		Map<Id, List<ProductAndLWCService.UrlKeyValue>> productImageMap = new Map<Id, List<ProductAndLWCService.UrlKeyValue>>();

		for (ContentDocumentLink cdl : links) {
			if (!productImageMap.containsKey(cdl.LinkedEntityId)) {
				String url = '/sfc/servlet.shepherd/version/download/' + cdl.ContentDocument.LatestPublishedVersionId;
				productImageMap.put(cdl.LinkedEntityId, new List<ProductAndLWCService.UrlKeyValue>{new ProductAndLWCService.UrlKeyValue(cdl.ContentDocument.LatestPublishedVersionId, url)});
			}else {
				String url = '/sfc/servlet.shepherd/version/download/' + cdl.ContentDocument.LatestPublishedVersionId;
				productImageMap.get(cdl.LinkedEntityId).add(new ProductAndLWCService.UrlKeyValue(cdl.ContentDocument.LatestPublishedVersionId, url));
			}
		}
		List<Map<String, Object>> result = new List<Map<String, Object>>();
		for (PricebookEntry p : pricebookEntrys) {
			result.add(new Map<String, Object>{
				'id' => p.Product2.Id,
				'name' => p.Product2.Name,
				'price' => p.UnitPrice,
				'imageUrl' => productImageMap.containsKey(p.Product2.Id)? productImageMap.get(p.Product2.Id) : new List<ProductAndLWCService.UrlKeyValue>(),
				'isImages' => productImageMap.containsKey(p.Product2.Id) ? true : false,
				'description' => p.Product2.Description != null ? p.Product2.Description : 'Description is not Available',
				'reaction' => ractionMap.containsKey(p.Product2.Id) ? ractionMap.get(p.Product2.Id).Reaction__c : 'null'
			});
		}
		return result;
	}

	@AuraEnabled(cacheable=true)
	public static List<Map<String, Object>> productLikeDislike(){
		return productWithPriceAndImage();
	}

	@AuraEnabled
	public static Boolean updateReaction(String productId, String reaction){

		try{
			Id currentUserId = UserInfo.getUserId();
			List<Product_Likes_and_Dislikes__c> existingReaction = [
				SELECT Id, Reaction__c
				FROM Product_Likes_and_Dislikes__c
				WHERE User__c = :currentUserId
				AND Product__c = :productId
				LIMIT 1
			];
			if (!existingReaction.isEmpty()) {
				existingReaction[0].Reaction__c = reaction;
				update existingReaction[0];
			} else {
				Product_Likes_and_Dislikes__c newReaction =
				new Product_Likes_and_Dislikes__c();
				newReaction.User__c = currentUserId;
				newReaction.Product__c = productId;
				newReaction.Reaction__c = reaction;
				insert newReaction;
			}
			return true;
		} catch(Exception ex){
			return false;
		}
	}


}
