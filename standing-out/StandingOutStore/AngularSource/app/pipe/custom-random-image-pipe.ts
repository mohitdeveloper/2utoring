import { Pipe, PipeTransform } from '@angular/core';
import { CoursesService, subjectImages } from '../services';
@Pipe({
    name: 'randomimage'
})
export class CustomRandomPipe implements PipeTransform {
    constructor(private cs: CoursesService) {

    }

    transform(i, subImages, subName): string {
        debugger;
        let randNum;
        if (!this.cs.imagesSequence[subName]) {
            this.cs.imagesSequence[subName] = 1;
            randNum = 0;
        } else {
            randNum = this.cs.imagesSequence[subName] % (subImages.length);
            this.cs.imagesSequence[subName] = this.cs.imagesSequence[subName] + 1;
        }
        //var randNum = Math.random() * (4 - 1) + 1;
        if (subImages && subImages[randNum]){
            return '/images/subjects/' + subImages[randNum]
        } else {
            debugger;
            //let randNumber = Math.floor((Math.random() * 9) + 0); //0 to 9 0 Where Start 9 Where Stop
            if (!this.cs.imagesSequence['general_images']) {
                this.cs.imagesSequence['general_images'] = 1;
                randNum = 0;
            } else {
                randNum = this.cs.imagesSequence['general_images'] % 31;
                this.cs.imagesSequence['general_images'] = this.cs.imagesSequence['general_images'] + 1;
            }
            console.log('/images/subjects/general_images/' + subjectImages['general_images'][randNum]);
            return '/images/subjects/general_images/' + subjectImages['general_images'][randNum];
        }
        //return '/images/subjects/' + (subImages ? (subImages[randNum] ? subImages[randNum]:'default.png'):'default.png');
    }
}