import { LightningElement ,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getLeaves from '@salesforce/apex/LeaveManagementHandler.getLeaves';

export default class LeaveManagementManager extends LightningElement {

    @track isButtonClicked = true;
    @track labelHideShow = 'Hide';
    @track isApplyLeave = false;
    @track isPendingLeaves = false;
    @track isLeavesHistory = false;
    @track isEditLeave = false;
    @track recordId = '';
    @track dataList = [];
    @track columnsList = [
        {label: 'User', fieldName: 'userName'},
        {label: 'Type of leave', fieldName: 'Type_of_leave__c'},
        {label: 'From date', fieldName: 'From_date__c'},
        {label: 'To date', fieldName: 'To_date__c'},
        {label: 'Reason', fieldName: 'Reason__c'},
        {label: 'No of days', fieldName: 'No_of_days__c'},
        {label: 'Status', fieldName: 'Status__c', 
            cellAttributes :{ 
            class:{ 
                fieldName: 'statuscss' },
              }
        },
    

    {
        type : 'button',
        typeAttributes: {
            label: 'Edit',    
            disabled: {
                fieldName: 'isEditDisabled'
              
            }
        }
    }
    ];
    connectedCallback() {
        this.handleLoad();
    }

    handleLoad(){
        getLeaves().then((result) => {
            this.dataList = result.map(a=> {
                return {
                    ...a,
                    userName: a.User__r != undefined ? a.User__r.Name : '',
                  //  isEditDisabled: a.Status__c == 'Approved' || a.Status__c == 'Rejected' ? true : false,
                    statuscss: a.Status__c == 'Approved' ? 'slds-theme_success' :
                    a.Status__c == 'Rejected' ? 'slds-theme_error' :
                    a.Status__c == 'Pending' ? 'slds-theme_warning' : 'slds-theme_info'
                }
            })
             console.log(result);
         }).catch((error) => {
             console.log(error);
         })
        }

        handleApplyClose()
        {
            this.isEditLeave = false;
        }


        handleSave(event)
        {
           const eve = new ShowToastEvent({
               title: 'Success',
               message: 'Leave Approved/Rejected Successfully : Id = ' + event.detail.id,
               variant: 'success',
           });
           this.dispatchEvent(eve);
          
          this.isEditLeave = false;
          window.location.reload();
           
        }

        handleRowAction(event) {
            this.isEditLeave = true;
            this.recordId = event.detail.row.Id;
            console.log('Row action triggered with recordId: ' + this.recordId);
         }
}