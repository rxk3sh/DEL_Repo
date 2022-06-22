import { LightningElement,api,track, wire } from 'lwc';
import fetchComments from '@salesforce/apex/DEL_CommentsPageController.fetchComments';
import insertComment from '@salesforce/apex/DEL_CommentsPageController.insertComment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';	
import { NavigationMixin } from 'lightning/navigation';


export default class Del_commentsPage extends NavigationMixin(LightningElement) {
    strBody = "";
    @api recordId;
    @track list_Comments = [];
    @track blnIsLoading = false;
    list_Errors;
    strInsertId;
    objwiredComments; //contains retrieved data and errors from fetchComments(). Used to refresh apex data after insertion.
    //fetchComments-this method used to fetch the comments related to the case.
    @wire(fetchComments,{strRecordId : '$recordId'})
    commResult (result){
        this.objwiredComments=result;
        if(result.data){
            this.list_Comments = JSON.parse(JSON.stringify(result.data));
        }
        else if(result.error){
            this.list_Errors = error;
        }
    }
    //handleChange- this method is invoked on the click comment submission button and used to insert the entered comment and refresh the updated comment list.
    handlechange(){
        if(this.isCommentValid()){
            this.handleIsLoading(true);
            this.strBody = this.template.querySelector('lightning-input').value;
            insertComment({strRecordId : this.recordId,strBody : this.strBody})
            .then((result)=>{
                this.strInsertId = result;
                console.log('comment id is'+this.strInsertId);
                //Toast event to show the success message of comment insertion.
                const event = new ShowToastEvent({
                    title : 'SUCCESS',
                    variant : 'success',
                    message :'Comment added successfully!',
                });
                this.dispatchEvent(event);
                //nullifying the comment input box after comment is submitted.
                this.template.querySelector('.nullify').value = null;
                //refreshing the comment list.
                this.updateRecordView();
                this.handleIsLoading(false);
            });

        }
    }
//isCommentValid- this method restricts the insertion of empty comment.
    isCommentValid(){
        let CommentInputField = this.template.querySelector(".nullify");
        if(CommentInputField.value == '' || CommentInputField.value == null){
            CommentInputField.setCustomValidity('Enter a comment');
            CommentInputField.reportValidity();
            return false;
        }else{
            CommentInputField.setCustomValidity('');
            CommentInputField.reportValidity()
            return true;
        }
    }
//handleLoading- This method is used to control the lightning spinner during record insertion.
    handleIsLoading(blnIsLoading){
        this.blnIsLoading = blnIsLoading;
    }
//updateRecordView- This method is used to refresh the apex data of comments after insertion of a comment.
    updateRecordView(){
        refreshApex(this.objwiredComments);
    }
//navigateToUser- This method is used to navigate to user profile on click of his name.
    navigateToUser(event){
        this[NavigationMixin.Navigate]({
            type : 'standard__recordPage',
            attributes : { 
                recordId : event.target.dataset.id,
                actionName : 'view'
            }
        });
    }
}