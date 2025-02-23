import { LightningElement, track, wire } from 'lwc';
import getPrimaryContacts from '@salesforce/apex/ContactController.getPrimaryContacts';
import { refreshApex } from '@salesforce/apex';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

export default class AutoRefreshLWC extends LightningElement {
    @track contacts;
    channelName = '/data/ContactChangeEvent';
    subscription = {};
    _wireResult;

    columns = [
        { label: 'Name', fieldName: 'Name', sortable: true },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'Account', fieldName: 'AccountName', sortable: true },
        { label: 'Website', fieldName: 'AccountWebsite', type: 'url' }
    ];

    @wire(getPrimaryContacts)
    wiredContacts(wireResult) {
        this._wireResult = wireResult;
        if (wireResult.data) {
            this.contacts = wireResult.data.map((obj) => ({
                ...obj,
                AccountName: obj.Account?.Name,
                AccountWebsite: obj.Account?.Website
            }));
        } else if (wireResult.error) {
            console.error('Error:', wireResult.error);
        }
    }

    // Subscribe to Change Data Capture
    registerSubscribe() {
        subscribe(this.channelName, -1, (changeEvent) => {
            this.processChangeEvent(changeEvent);
        }).then((subscription) => {
            this.subscription = subscription;
        });
    }

    // Process Change Event
    processChangeEvent(changeEvent) {
        try {
            const changedRecordIds = changeEvent?.data?.payload?.ChangeEventHeader?.recordIds || [];
            if (!changedRecordIds.length) return;

            // If any displayed record was updated, refresh
            if (this.contacts.some(contact => changedRecordIds.includes(contact.Id))) {
                refreshApex(this._wireResult);
            } else {
                // If new records are added, update UI manually
                getPrimaryContacts()
                    .then(data => {
                        this.contacts = data.map(obj => ({
                            ...obj,
                            AccountName: obj.Account?.Name,
                            AccountWebsite: obj.Account?.Website
                        }));
                    })
                    .catch(error => console.error('Error fetching updated contacts:', error));
            }
        } catch (err) {
            console.error('Error processing event:', err);
        }
    }

    // Register error listener for EMP API
    registerErrorListener() {
        onError((error) => {
            console.error('CDC Error:', JSON.stringify(error));
        });
    }

    // Lifecycle Hooks
    connectedCallback() {
        this.registerErrorListener();
        this.registerSubscribe();
    }

    disconnectedCallback() {
        unsubscribe(this.subscription, () => console.log('Unsubscribed from change events.'));
    }
}