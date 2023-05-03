import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productData: undefined | product;
  productQuantity: number = 1;
  removeCart = false;
  cartData: undefined | product;

  constructor(private activateRoute: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    let productId = this.activateRoute.snapshot.paramMap.get('productId');
    console.warn(productId);

    productId && this.product.getProduct(productId).subscribe((result) => {
      console.log(result);
      this.productData = result;

      let cartData = localStorage.getItem('localCart');
      if (productId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: product) => productId == item.id.toString())
        if (items.length) {
          this.removeCart = true;
        }
        else {
          this.removeCart = false;
        }
      }

      let user = localStorage.getItem('user');
      if (user) {
        let userId = user && JSON.parse(user).id;
        this.product.getCardList(userId);

        this.product.cartData.subscribe((result) => {
          let item = result.filter((item: product) => productId?.toString() === item.productId?.toString())
          if (item.length) {
            this.cartData = item[0];
            this.removeCart = true;
          }
        })
      }

    });
  }

  hadleQuantity(val: string) {
    //val === 'plus' ? this.productQuantity++ : this.productQuantity-- ;  //it also work but it shows negative value as well.
    if (this.productQuantity < 20 && val == 'plus') {  // This if else Statement cannot show negative number and min count is 1.
      this.productQuantity += 1;
    }
    else if (this.productQuantity > 1 && val == 'minus') {
      this.productQuantity -= 1;
    }
  }

  addToCart() {                                 //This function is made for add to cart
    if (this.productData) {
      this.productData.quantity = this.productQuantity;

      if (!localStorage.getItem('user')) {        //this is made if user is not login then product will save to local storage
        //console.warn(this.productData);
        this.product.localAddToCart(this.productData)
        this.removeCart = true;
      } else {
        //console.warn("User is logged in");
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        //console.warn(userId);

        let cartData: cart = {
          ...this.productData,
          productId: this.productData.id,
          userId
        }
        delete cartData.id;
        //console.warn(cartData);
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCardList(userId);
            this.removeCart = true;
          }
        })
      }
    }
  }

  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);
    }
    else {

      console.warn("CartData", this.cartData);

      this.cartData && this.product.removeToCart(this.cartData.id).subscribe((result) => {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        this.product.getCardList(userId);
      });

      this.removeCart = false;
    }
  }
}
