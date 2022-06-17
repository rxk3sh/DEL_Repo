/*******************************************************************************************************
* 
* @ Name            :   DEL_CommentsPageController
* @ Purpose         :   To insert new comment and fetching all the comments
* @ Author          :   Rakesh Nayak
* @ Usage           :   1) For inserting a new comment on click of submit button
*                       2) For fetching all the related comments for a case
* @ Test Class Name :   NIL
*
*   Date            |  Developer Name               |  Version      |  Changes
* ======================================================================================================
*  17-06-2022      |  rakesh.nayak@absyz.com      |  1.0          |  Initial Version
*
*******************************************************************************************************/
public class DEL_CommentsPageController {
    //fetchComments-This method queries and returns the CaseComment records related to the case with Id 'recordID'
    @AuraEnabled(cacheable=true)
    public static List<DEL_Casecomment__c> fetchComments(String recordId){
        System.debug('Record Id::'+recordId);
        return [SELECT
         Createddate,
         createdbyId,
         createdby.smallphotourl,
         createdby.name,
         Body__c 
         FROM DEL_CaseComment__c 
         WHERE Case__c=:recordId 
         ORDER BY Createddate 
         DESC];
    }
    //insertComment- This method takes the Body of comment and case Id as parameters and inserts the comment to salesforce.
    @AuraEnabled
    public static string insertComment(string strBody,string recordId){
       DEL_Casecomment__c objNewComment=new DEL_Casecomment__c(Body__c=strBody,case__c=recordId);
       insert objNewComment;
        return objNewComment.Id;
    }
}
