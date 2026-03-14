import { Component , OnInit} from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allItems: Item[] = [];
  filteredItems: Item[] = [];
  items: Item[] = [];
  searchText: string = "";
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  setPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.items = this.filteredItems.slice(start, end);
  }

  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.setPage(this.currentPage);
  }

  searchProduct() {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      this.filteredItems = [...this.allItems];
    } else {
      this.filteredItems = this.allItems.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  loadProducts() {
    this.itemService.getAllItems().subscribe((data) => {
      this.allItems = data;
      this.filteredItems = [...data];
      this.updatePagination();
    });
  }

  delete(id: number) {
    const isConfirm = confirm("Are you sure you want to delete this item?");
    if (isConfirm) {
      this.itemService.delete(id).subscribe(() => {
        this.allItems = this.allItems.filter(item => item.id !== id);
        this.searchProduct();
      });
    }
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}

