import { LightningElement,api,track } from 'lwc';
import fetchComments from '@salesforce/apex/DEL_CommentsPageController.fetchComments';
import insertComment from '@salesforce/apex/DEL_CommentsPageController.insertComment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Del_commentsPage extends LightningElement {
    strBody="";
    @api recordId;
    @track comments=[];
    @track isLoading=false;
    errors;
    strInsertId;
    connectedCallback(){
        fetchComments({recordId:this.recordId})
    .then((result) => {
        this.comments = result;
    })
    .catch((error) => {
        this.error = error;
    });
    }
    handlechange(){
        this.handleIsLoading(true);
        this.strBody= this.template.querySelector('lightning-input').value;
        insertComment({recordId:this.recordId,strBody:this.strBody})
        .then((result)=>{
            this.strInsertId=result;
            console.log('comment id is'+this.strInsertId);
            const event = new ShowToastEvent({
                title: 'Comment Added!',
                variant: 'success',
                message:'CommentId:: '+this.strInsertId,
            });
            this.dispatchEvent(event);
            this.updateRecordView();
            this.handleIsLoading(false);
        });
        

}
handleIsLoading(isLoading) {
    this.isLoading = isLoading;
}

updateRecordView() {
   setTimeout(() => {
        eval("$A.get('e.force:refreshView').fire();");
   }, 1000); 
}
}