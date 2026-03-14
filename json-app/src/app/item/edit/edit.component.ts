import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Item } from '../item';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  item: Item = {
    id: 0,
    name: '',
    price: 0,
    category: '',
    qty: 0,
    stock: 0,
    images: [],
    coverImage: ''
  };

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      this.getById(id);
    });
  }

  getById(id: number) {
    this.itemService.getById(id).subscribe((data) => {
      this.item = data;
    });
  }

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
    const urls = await Promise.all(filesToRead.map((file) => this.readFileAsDataUrl(file)));
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

  cancel() {
    this.router.navigate(['']);
  }

  update() {
    this.itemService.update(this.item).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}