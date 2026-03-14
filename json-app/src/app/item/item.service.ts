import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  router: any;

  constructor(private _httpClient:HttpClient) { }
  getAllItems(){
    return this._httpClient.get<Item[]>("http://localhost:3000/item");
 
  }
    create(data:Item){
    return this._httpClient.post("http://localhost:3000/item" , data);
 
  }
   getById(id:Number){
    return this._httpClient.get<Item>(`http://localhost:3000/item/${id}`);
 
  }
    update(data:Item){
    return this._httpClient.put(`http://localhost:3000/item/${data.id}`,data);
 
  }
   delete(id:Number){
    return this._httpClient.delete(`http://localhost:3000/item/${id}`);
 
  }
}