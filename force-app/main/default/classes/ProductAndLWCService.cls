public with sharing class ProductAndLWCService { 
    public class UrlKeyValue{
        @AuraEnabled public String key;
        @AuraEnabled public String value;
        public UrlKeyValue(String imageId, String imageUrl){
            this.key = imageId;
            this.value = imageUrl;
        }
    }

    public class EmailValuesWrapper {
        @AuraEnabled public String name;
        @AuraEnabled public Decimal price;
        @AuraEnabled public String imageUrl;
        @AuraEnabled public String link;
    
        // Constructor to initialize the wrapper easily
        public EmailValuesWrapper(String name, Decimal price, String imageUrl, String link) {
            this.name = name;
            this.price = price;
            this.imageUrl = imageUrl;
            this.link = link;
        }
    }
}