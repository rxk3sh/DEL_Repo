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
    @AuraEnabled(cacheable = true)
    public static List<DEL_Casecomment__c> fetchComments(String strRecordId){
        return [SELECT
                CreatedDate,
                CreatedById,
                CreatedBy.SmallPhotoUrl,
                CreatedBy.Name,
                Body__c 
                FROM DEL_CaseComment__c 
                WHERE Case__c = :strRecordId 
                ORDER BY CreatedDate 
                DESC];
    }
    //insertComment- This method takes the Body of comment and case Id as parameters and inserts the comment to salesforce.
    @AuraEnabled
    public static string insertComment(string strBody,string strRecordId){
        DEL_Casecomment__c objCaseComment = new DEL_Casecomment__c(
            Body__c = strBody,
            Case__c = strRecordId
            );
        insert objCaseComment;
        return objCaseComment.Id;
    }
}
