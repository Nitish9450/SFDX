// https://playful-narwhal-arqgqo-dev-ed.trailblaze.my.site.com/Gpokerv2/ see demo on this site
import { LightningElement, api } from 'lwc';

export default class CustomeCircularProgressBar extends LightningElement {
    @api progress =20;

    get progressOffset() {
        // Calculate stroke-dashoffset for progress
        const maxOffset = 100;
        return maxOffset - this.progress;
    }
}