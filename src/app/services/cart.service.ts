import { Injectable } from '@angular/core';
// import { Storage } from '@capacitor/storage';
import { Storage } from '@ionic/storage';
import { DbService } from './db.service';


export class MenuItem { 
    id: number;
    title: string;
    prices: number;
    minprice: number;
    note: string;
    image: string;
    veg: string;
    non_veg: string;
    packaging_cost:any;
    item = []
    Addon = []
    resturantId: string;
    tableID: string;
    floor: string;

    constructor(id: number, title: string, prices: number, minprice: number, note: string, veg: string, non_veg: string, image: string, item:any, Addon:any, resturantId: string, tableID: string, floor: string) {
        this.id = id;
        this.title = title;
        this.prices = prices;
        this.image = image;
        this.item = item;
        this.minprice = minprice;
        this.veg = veg;
        this.non_veg = non_veg;
        this.note = note;
        this.Addon = Addon;
        this.resturantId = resturantId;
        this.tableID = tableID;
        this.floor = floor;
    }
}
export class CartItem {
    id: number;
    title: string;
    prices: number;
    image: string;
    resturantId: string;
    quantity: number;
    veg: string;
    non_veg: string;
    packaging_cost;
    minprice: number;
    note: string;
    item: any;
    Addon = [];
    tableID: string;
    floor: string;


    constructor(item: MenuItem, quantity: number, items:any, Addon:any, packaging_cost:any, resturantId:any, tableID:any, floor:any) {
        this.id = item.id;
        this.title = item.title;
        this.prices = item.prices;
        this.image = item.image;
        this.minprice = item.minprice;
        this.note = item.note;
        this.quantity = quantity;
        this.item = items;
        this.veg = item.veg;
        this.non_veg = item.non_veg;
        this.Addon = Addon;
        this.packaging_cost = packaging_cost;
        this.resturantId = resturantId;
        this.tableID = tableID;
        this.floor = floor;
    }
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  list: Array<CartItem>;
  tableID: any;

  constructor(public storage: Storage,public db:DbService) {
        this.tableID = localStorage['tableid']
        this.list = []
        this.getvalue()
   }

   getvalue() {
        this.storage.get('cartItems').then((val) => {
            if (val == null || val == undefined) {
                this.list = []
                return this.list
            }
            else {
                return this.list = val
            }
        });
    }

    getAllCartItems() {
        return this.list;
    }

    getItemById(id: Number):any {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].id == id) {
                this.changecart()
                return this.list[i];
            }
        }
    }

    package_cost() {
        let length = 0;
        this.list.forEach(element => {
            length += (element.packaging_cost * element.quantity)
        });
        return length;
    }

    addcartItem(item: MenuItem, quantity: number, items:any, Addon:any, tableID:any, floor:any) {
        // this.storage.get('cartItems').then((val) => {
        //     if (val == null || val == undefined) {
        //         this.list = []
        //     }
        //     else {
        //         this.list = val;
        //         this.list[Addon].quantity++
        //         this.storage.set('cartItems', this.list)
        //         // this.changecart()
        //         // this.list[Addon].quantity++
        //     }
        // });
        // this.getvalue()
        this.list[Addon].quantity++
        this.changecart()
        // return true;
    }

    removetocart_item(item:any){
        // item.count = item.count - 1
        let index:any = this.list.findIndex((res:any)=>res.item_code == item.item_code);
        this.list.splice(index,1);
        this.changecart()
        // setTimeout(() =>{this.db.mycart_emit.next('getted');},400)
        console.log(index);
    }

    // addItem(item: MenuItem, quantity: number, items:any, Addon:any, resturantId:any, tableID:any, floor:any):any {
        // this.getvalue()
        addItem(item:any):any {
        var isExists: boolean = false;
        // var id = item.id;

        this.list = this.list ? this.list : [];
        let index = 0;
        if(this.list.length != 0){

            this.list.map((res:any,i:any)=>{
                if(res.item_code == item.item_code){
                    this.list[i] = item;
                    index++; 
                }
            })
           
            index == 0 ? this.list.push(item as never) : null;
            this.changecart();
        }else{
            this.list.push(item as never);
            this.changecart();
        }

    

        // let data:any = this.list.find((res:any)=>res.item_code == item.item_code);

        // if(data){
        //     // let index:any = this.list.indexOf(data['item_code']);
        //     data = item;
        //     this.changecart();
        //     return true;
        // }else{
        //     this.list.push(item as never);
        //     this.changecart()
        //     return true;
        // }
        // var packaging_cost = items.packaging_cost;
        // for (var i = 0; i < this.list.length; i++) {
        //         if (this.list[i].id == id && Addon.length == 0 && this.list[i].tableID == tableID) {
        //             this.list[i].quantity++
        //             isExists = true;
        //             this.changecart()
        //             return true;
        //         }
        //         else if (this.list[i].id == id && Addon.length != 0 && this.list[i].tableID != tableID) {
        //             isExists = false;
        //             break;
        //         }
        //     else {
        //         isExists = false;
        //     }
        // }
        // if (!isExists) {
        //     console.log(item);
        //     this.list = this.list ? this.list : [];
        //     this.list.push(item as never);
        //     // this.list.push(new CartItem(item, quantity, items, Addon, packaging_cost, resturantId, tableID, floor));
        //     this.changecart()
        //     return true;
        // }
    }

    update(item: MenuItem, quantity: number, items:any, Addon:any, resturantId:any, tableID:any, floor:any){
        
    }

    changecart() {
        this.storage.set('cartItems', this.list)
    }

    removeoneItemById(id:any, tableID:any, floor:any) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].floor == floor) {
            if (this.list[i].tableID == tableID) {
                if (this.list[i].id == id) {
                    if (this.list[i].quantity != 0) {
                        this.list[i].quantity--
                        if (this.list[i].quantity == 0) {
                            this.list.splice(i, 1);
                            this.changecart()
                            break;
                        }
                        this.changecart()
                        break;
                    }
                    if (this.list[i].quantity == 0) {
                        this.list.splice(i, 1);
                        this.changecart()
                        break;
                    }
                    this.changecart()
                }
                }
            }
            this.changecart()
        }
    }

    removecartItemById(id:any, index:any, tableID:any, floor:any) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].floor==floor) {
            if (this.list[i].tableID == tableID) {
                if (this.list[i].id == id) {
                    if (i== index) {
                    var j = i
                    this.list[j].quantity--
                    if (this.list[j].quantity == 0) {

                        this.list.splice(index, 1);
                        this.changecart()
                    }
                    this.changecart()
                }
                    
                }

            }
            }  
        }
    }
    emptyCart() {
        for (var i = 0; i < this.list.length; i++) {
            this.list.splice(i, 1);
            // this.changecart()
            i--;
        }
        this.storage.set('cartItems', this.list)
            // this.changecart()

    }

    quantityPlus(item:any) {
        item.quantity += 1;
    }

    quantityMinus(item:any) {
        item.quantity -= 1;
    }

    getCartLength() {
        let length = 0;
        this.list.forEach(element => {
            length += element.quantity;
        });
        return length;
    }

    get_restaurantId() {
        var res;
        for (var i = 0; i < this.list.length; i++) {
            res = this.list[i].resturantId
        }
        return res;
    }

    getGrandTotal(): number {
        var amount = 0;
        // for (var i = 0; i < this.list.length; i++) {
        //     amount += (this.list[i].prices * this.list[i].quantity);
        // }
        this.list.map((res:any)=>{
            amount += (res.rate * res.quantity);
        })
        return amount;
    }
    
    remove_cart_item(id:any,index:any){
        // this.getvalue();
        let check_item=this.list.find(obj => obj.id == id);
        if(check_item){
            this.list.splice(index,1);
            this.changecart();
        }
    }
    update_cart_items(lists:any){
        this.list = lists;
        this.changecart();
    }

    TableCartItems(table:any) {
        // console.log(this.list);
        var tableIDitems: any = [];
        tableIDitems = this.list ? this.list : [];
        return tableIDitems;
        // this.getvalue()
        // var tableIDitems: any = [];
        // for (var i = 0; i < this.list.length; i++) {
        //     if (this.list[i].tableID == table) {
        //         tableIDitems.push(this.list[i])
        //     }
        // }
        // // let t_array = tableIDitems.reverse();
        // // return t_array;
        // return tableIDitems;
    }

    getTableCartTotal(table:any): number {
        var amount = 0;
        // for (var i = 0; i < this.list.length; i++) {
        //     // if (this.list[i].floor==floor) {
        //     if (this.list[i].tableID == table) {
        //         amount += (this.list[i].prices * this.list[i].quantity);
        //     }
        //     // }
        // }
        this.list.map((res:any)=>{
            amount += (res.rate * res.quantity);
        })
        return amount;
    }

    emptytableCart(table:any) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].tableID == table) {
                this.list.splice(i, 1);
                i--;
            }
        } 
    }

    getTableCartLength(table:any) {
        // this.getvalue()
        var length = 0;
        for (var i = 0; i < this.list.length; i++) {
            // if (this.list[i].floor==floor) {
            if (this.list[i].tableID == table) {
                length += this.list[i].quantity;
            }
            // }
        }
        return length;

        // this.storage.get('cartItems').then((val) => {
        //     if (val == null || val == undefined) {
        //         this.list = []
        //     }
        //     else {
        //         this.list = val;
        //         let check = this.list.find(obj => obj.tableID == table)
        //         length += check.quantity;
        //         // this.changecart()
        //         // this.list[Addon].quantity++
        //     }
        // });
        // return length;
    }
}
