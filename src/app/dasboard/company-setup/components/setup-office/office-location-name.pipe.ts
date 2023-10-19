import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'officeLocationName'
})
export class OfficeLocationNamePipe implements PipeTransform {

  transform(value: string): string {
    // Split the string by comma and remove the first part (before the comma)
    const parts = value.split(', ');
    if (parts.length > 1) {
      parts.shift();  // Remove the first part
      return parts.join(', ');  // Join the remaining parts back together
    }
    return value;
  }

}
