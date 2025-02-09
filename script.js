let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let seeMoreButtons = document.querySelectorAll('.seeMore');
let backButton = document.getElementById('back');
let showCart = document.querySelector('#shopping-cart')
let body = document.querySelector('body')
let closebtn = document.querySelector(".close")
let listProductHTML = document.querySelector('.listProduct')
let listCartHTML = document.querySelector('.listCart')
let iconCartSpan = document.querySelector('#shopping-cart span')
let plus = document.querySelector('.plus')
let minus = document.querySelector('.minus')


// let body_element = document.getElementById('body_item');
// let dark_btn = document.getElementById('dark')
// let light_btn = document.getElementById('light')

// function dark(){
//     body_element.style.background = "black";
//     body_element.style.color = "white"
// }

// function light(){
//     body_element.style.background = "white";
//     body_element.style.color = "black";
// }
// backto top
let tab = document.getElementById('tab');
tab.style.display ='none';
window.addEventListener('scroll', () =>{
    if(this.scrollY > 500){
        tab.style.display = 'block';
    }
    else{
        tab.style.display = 'none';
    }
})
tab.onclick = function(){
    window.scrollTo({
        top:0,
        behavior:'smooth'
    });
}

let listProducts = [];
let carts = [];

showCart.addEventListener('click', () => {
    body.classList.toggle('active');
})
closebtn.addEventListener('click', () => {
    body.classList.toggle('active');

})




nextButton.onclick = function () {
    showSlider('next');
}
prevButton.onclick = function () {
    showSlider('prev');
}
let unAcceppClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    if (type === 'next') {
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    } else {
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }
    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(() => {
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000)
}
seeMoreButtons.forEach((button) => {
    button.onclick = function () {
        carousel.classList.remove('next', 'prev');
        carousel.classList.add('showDetail');
    }
});
backButton.onclick = function () {
    carousel.classList.remove('showDetail');
}

// product
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('list-item');
            newProduct.dataset.id = product.id
            newProduct.innerHTML = `
            <img src="${product.Image}" alt="">
        <h2>${product.name}</h2>
        <div class="price">₹${product.price}</div>
        <button class="addtocart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct)
        })
    }
}

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addtocart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id)
    }
})

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);

    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }
    else {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}
const addCartToHTML = () => {
    // Clear existing content in listCartHTML
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;

            let newCart = document.createElement('div');
            newCart.classList.add("item");
            newCart.dataset.id = cart.product_id;
            // Find the product information based on product_id
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            // Check if product exists
            let info = listProducts[positionProduct];

            // Populate newCart HTML with dynamic content
            newCart.innerHTML = `
                        <div class="image">
                            <img src="${info.Image}" alt="">
                        </div>
                        <div class="name">
                            ${info.name}
                        </div>
                        <div class="totalPrice">$${info.price * cart.quantity}</div>
                        <div class="quantity">
                            <span class="minus"><</span>
                            <span>${cart.quantity}</span>
                            <span class="plus">></span>
                        </div>`;

            // Append newCart to listCartHTML
            listCartHTML.appendChild(newCart);


        });
    }
    iconCartSpan.innerText = totalQuantity;

}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.closest('.item').dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type)
    }
})
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
            if(valueChange > 0 ){
                carts[positionItemInCart].quantity= valueChange;
            }
            else{
                carts.splice(positionItemInCart,1);
            }
            break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}


const initApp = () => {
    fetch('Products.json').then(response => response.json()).then(data => {
        listProducts = data;
        addDataToHTML();

        //get cart from mermory
        if (localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML()
        }
    })
}
initApp();
// testimonial js
var galleryThumbs = new Swiper('.gallery-thumbs', {
	effect: 'coverflow',
	grabCursor: true,
	centeredSlides: true,
	slidesPerView: '2',
	// coverflowEffect: {
	//   rotate: 50,
	//   stretch: 0,
	//   depth: 100,
	//   modifier: 1,
	//   slideShadows : true,
	// },
	
	coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 50,
        modifier: 6,
        slideShadows : false,
	  },
	  
  });
  
  
var galleryTop = new Swiper('.swiper-container.testimonial', {
	speed: 400,
	spaceBetween: 50,
	autoplay: {
	  delay: 3000,
	  disableOnInteraction: false,
	},
	direction: 'vertical',
	pagination: {
	  clickable: true,
	  el: '.swiper-pagination',
	  type: 'bullets',
	},
	thumbs: {
		swiper: galleryThumbs
	  }
  });
  
  