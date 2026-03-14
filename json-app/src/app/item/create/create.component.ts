import { Component } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  item: Item = {
    id: 0,
    name: '',
    price: 0,
    category: '',
    qty: 0,
    stock: 0,
    images: [],
    coverImage: ''
  }

  constructor(private itemService: ItemService, private router: Router) { }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async onImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const selectedFiles = Array.from(input.files);
    const allowed = 10 - (this.item.images?.length || 0);
    if (allowed <= 0) return;
    const filesToRead = selectedFiles.slice(0, allowed);
    const urls = await Promise.all(filesToRead.map(file => this.readFileAsDataUrl(file)));
    this.item.images = [...(this.item.images || []), ...urls];
  }

  async onCoverImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.item.coverImage = await this.readFileAsDataUrl(input.files[0]);
  }

  removeImage(index: number) {
    if (!this.item.images) return;
    this.item.images.splice(index, 1);
  }

  // single cover image does not need remove function; clear with button in template if needed

  create() {
    this.itemService.create(this.item).subscribe({
      next:(data)=>{
      this.router.navigate(['']);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  cancel(){
    this.router.navigate(['']);
  }
}

