public class DEL_CommentsPageController {
    @AuraEnabled(cacheable=true)
    public static List<DEL_Casecomment__c> fetchComments(String recordId){
        System.debug('Record Id::'+recordId);
        return [SELECT
         Createddate,
         createdby.smallphotourl,
         createdby.name,
         Body__c 
         FROM DEL_CaseComment__c 
         WHERE Case__c=:recordId 
         ORDER BY Createddate 
         DESC];
    }
    @AuraEnabled
    public static string insertComment(string strBody,string recordId){
       DEL_Casecomment__c newComment=new DEL_Casecomment__c(Body__c=strBody,case__c=recordId);
       insert newComment;
        return newComment.Id;
    }
}
