import { LightningElement , track} from 'lwc';
export default class MultiSelectPicklist extends LightningElement {
    @track showTimeOptions = [
        { label: 'Option 1', value: 'Option1' },
        { label: 'Option 2', value: 'Option2' },
        { label: 'Option 3', value: 'Option3' },
        { label: 'Option 4', value: 'Option4' },
        { label: 'Option 5', value: 'Option5' }
    ];
    selectedOptions = [];
    handleChange(event) {
        this.selectedOptions = event.detail;
        console.log('selectedOptions :: ',JSON.stringify(this.selectedOptions));
        const selectedValues = this.selectedOptions.map(option => option.value).join(';');
        console.log('Selected Values:', selectedValues);
    }
}