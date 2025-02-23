public class ContactController {
	@AuraEnabled(cacheable=true)
    public static List<Contact> getPrimaryContacts() {
        return [SELECT Id, Name, Phone, Email, Account.Name, Account.Website FROM Contact LIMIT 10];
    }
}