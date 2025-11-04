// Doi sang dinh dang tien VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Close popup 
const body = document.querySelector("body");
let modalContainer = document.querySelectorAll('.modal');
let modalBox = document.querySelectorAll('.mdl-cnt');
let formLogSign = document.querySelector('.forms');

// Click vùng ngoài sẽ tắt Popup
modalContainer.forEach(item => {
    item.addEventListener('click', closeModal);
});

modalBox.forEach(item => {
    item.addEventListener('click', function (event) {
        event.stopPropagation();
    })
});

function closeModal() {
    modalContainer.forEach(item => {
        item.classList.remove('open');
    });
    console.log(modalContainer)
    body.style.overflow = "auto";
}

function increasingNumber(e) {
    let qty = e.parentNode.querySelector('.input-qty');
    if (parseInt(qty.value) < qty.max) {
        qty.value = parseInt(qty.value) + 1;
    } else {
        qty.value = qty.max;
    }
}

function decreasingNumber(e) {
    let qty = e.parentNode.querySelector('.input-qty');
    if (qty.value > qty.min) {
        qty.value = parseInt(qty.value) - 1;
    } else {
        qty.value = qty.min;
    }
}

//Doi slide anh khi nhan vao mui ten o trang chu
const slides = document.querySelector(".img-list");
const imgs = document.getElementsByTagName("img");
const len = imgs.length;
let current = 1;
function changeSlides() {

    setInterval(() => {
        if (current == len - 2) {
            current = 1;
            let width = imgs[0].offsetWidth;
            slides.style.transform = `translateX(0px)`;
        } else {
            current++;
            let width = 0
            for (let i = 0; i < current; ++i) {
                width += imgs[i].offsetWidth
            }
            width -= 80
            slides.style.transform = `translateX(${-width}px)`;
        }
    }, 4000)
}   
changeSlides()

function handleButtonClickPrev() {
    if (current == 1) {
        // Nếu đang ở ảnh đầu tiên thì nhảy về ảnh cuối
        current = len - 2; 
    } else {
        current--;
    }

    // Tính lại tổng width từ ảnh đầu đến current
    let width = 0;
    for (let i = 0; i < current; ++i) {
        width += imgs[i].offsetWidth;
    }
    width -= 80; // nếu bạn có khoảng cách margin/padding thì giữ lại dòng này

    slides.style.transform = `translateX(${-width}px)`;
}


// Hàm xử lý khi nhấn nút
function handleButtonClickNext() {
    if (current == len - 2) {
        current = 1;
        let width = imgs[0].offsetWidth;
        slides.style.transform = `translateX(0px)`;
    } else {
        current++;
        let width = 0
        for (let i = 0; i < current; ++i) {
            width += imgs[i].offsetWidth
        }
        width -= 80
        console.log(width)
        slides.style.transform = `translateX(${-width}px)`;
    }
}

// Gắn sự kiện cho button sau khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", function() {
    const btnNext = document.getElementById("btn-next");
    const btnPrev = document.getElementById("btn-prev");

    btnNext.addEventListener("click", handleButtonClickNext);
    btnPrev.addEventListener("click", handleButtonClickPrev);
});

// Hàm gắn event listener cho phần đánh giá
function setupReviewEventListeners(productId) {
    // Xử lý click vào sao để chọn rating
    let starsContainer = document.getElementById(`rating-stars-${productId}`);
    if (starsContainer) {
        let stars = starsContainer.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            // Click để chọn rating
            star.addEventListener('click', function() {
                let rating = index + 1;
                starsContainer.setAttribute('data-selected-rating', rating);
                
                // Cập nhật hiển thị
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.remove('fa-regular');
                        s.classList.add('fa-solid');
                    } else {
                        s.classList.remove('fa-solid');
                        s.classList.add('fa-regular');
                    }
                });
            });
            
            // Hover để preview
            star.addEventListener('mouseover', function() {
                let rating = index + 1;
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.remove('fa-regular');
                        s.classList.add('fa-solid');
                    } else {
                        s.classList.remove('fa-solid');
                        s.classList.add('fa-regular');
                    }
                });
            });
        });
        
        // Khi rời chuột khỏi container, khôi phục rating đã chọn
        starsContainer.addEventListener('mouseleave', function() {
            let selectedRating = parseInt(starsContainer.getAttribute('data-selected-rating')) || 0;
            stars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid');
                } else {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                }
            });
        });
    }
    
    // Xử lý nút gửi đánh giá
    let submitBtn = document.querySelector(`.submit-review-btn[data-product="${productId}"]`);
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            submitReview(productId);
        });
    }
}

//Xem chi tiet san pham
function detailProduct(index) {
    let modal = document.querySelector('.modal.product-detail');
    let products = JSON.parse(localStorage.getItem('products'));
    event.preventDefault();
    let infoProduct = products.find(sp => {
        return sp.id === index;
    })
    // Tính số lượng đã xuất (tổng số lượng đã bán ra cho sản phẩm này)
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let exportedQty = 0;
    orderDetails.forEach(detail => {
        if (detail.id == infoProduct.id) {
            exportedQty += parseInt(detail.soluong);
        }
    });
    let stockQty = parseInt(infoProduct.soluong) - exportedQty;
    let modalHtml = `<div class="modal-header">
    <img class="product-image" src="${infoProduct.img}" alt="">
    </div>
    <div class="modal-body">
        <h2 class="product-title">${infoProduct.title}</h2>
        <div class="product-control">
            <div class="priceBox">
                <span class="current-price">${vnd(infoProduct.price)}</span>
            </div>
            <div class="buttons_added">
                <span class="curr-soluong">Số lượng còn: ${stockQty}</span>
                <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                <input class="input-qty" max="${stockQty}" min="1" name="" type="number" value="1">
                <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
            </div>
        </div>
        <p class="product-description">${infoProduct.desc}</p>
    </div>
    <div class="notebox">
            <p class="notebox-title">Ghi chú</p>
            <textarea class="text-note" id="popup-detail-note" placeholder="Nhập thông tin cần lưu ý..."></textarea>
    </div>
    <div class="reviews-section">
        <div class="reviews-header">
            <h3>Đánh giá sản phẩm</h3>
            <div class="rating-summary">
                <div class="average-rating">
                    ${generateStarDisplay(Math.round(calculateAverageRating(infoProduct.id)))}
                    <span class="rating-number">${calculateAverageRating(infoProduct.id).toFixed(1)}</span>
                </div>
                <span class="review-count">(${getReviewCount(infoProduct.id)} đánh giá)</span>
            </div>
        </div>
        <div class="reviews-content">
            ${renderReviews(infoProduct.id)}
            ${renderReviewForm(infoProduct.id)}
        </div>
    </div>
    <div class="modal-footer">
        <div class="price-total">
            <span class="thanhtien">Thành tiền</span>
            <span class="price">${vnd(infoProduct.price)}</span>
        </div>
        <div class="modal-footer-control">
            <button class="button-dathangngay" data-product="${infoProduct.id}"><i class="fa-solid fa-cart-shopping"></i> Mua ngay</button>
            <button class="button-dat" id="add-cart" onclick="animationCart()"><i class="fa-solid fa-basket-shopping"></i> Thêm vào giỏ</button>
        </div>
    </div>`;
    document.querySelector('#product-detail-content').innerHTML = modalHtml;
    modal.classList.add('open');
    body.style.overflow = "hidden";
    //Cap nhat gia tien khi tang so luong san pham
    let tgbtn = document.querySelectorAll('.is-form');
    let qty = document.querySelector('.product-control .input-qty');
    let priceText = document.querySelector('.price');
    tgbtn.forEach(element => {
        element.addEventListener('click', () => {
            let price = infoProduct.price * parseInt(qty.value);
            priceText.innerHTML = vnd(price);
        });
    });
    // Them san pham vao gio hang
    let productbtn = document.querySelector('.button-dat');
    productbtn.addEventListener('click', (e) => {
        if (localStorage.getItem('currentuser')) {
            addCart(infoProduct.id);
        } else {
            toast({ title: 'Warning', message: 'Chưa đăng nhập tài khoản !', type: 'warning', duration: 3000 });
        }

    })
    // Mua ngay san pham
    dathangngay();
    
    // Gắn event listener cho phần đánh giá sau khi modal được render
    setupReviewEventListeners(infoProduct.id);
}

// function animationCart() {
//     document.querySelector(".product-image").style.animation = "slidein ease 1s"
//     setTimeout(()=>{
//         document.querySelector(".count-product-cart").style.animation = "none"
//     },1000)
// }

function animationCart() {
  const product = document.querySelector(".product-image");
  const cart = document.querySelector(".fa-basket-shopping");

  // Lấy vị trí trên màn hình
  const productRect = product.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  // Tạo clone của hình sản phẩm
  const flyingImg = product.cloneNode(true);
  flyingImg.style.position = "fixed";
  flyingImg.style.left = productRect.left + "px";
  flyingImg.style.top = productRect.top + "px";
  flyingImg.style.width = productRect.width + "px";
  flyingImg.style.height = productRect.height + "px";
  flyingImg.style.transition = "all 1s ease-in-out";
  flyingImg.style.zIndex = 9999;

  document.body.appendChild(flyingImg);

  // Trigger animation (chạy sau 1 tick)
  requestAnimationFrame(() => {
    flyingImg.style.left = cartRect.left + "px";
    flyingImg.style.top = cartRect.top + "px";
    flyingImg.style.width = "20px";
    flyingImg.style.height = "20px";
    flyingImg.style.opacity = "0.5";
  });

  // Xóa clone sau khi bay xong
  setTimeout(() => {
    flyingImg.remove();
  }, 1000);
}


// Them SP vao gio hang
function addCart(index) {
    let currentuser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : [];
    let soluong = document.querySelector('.input-qty').value;
    let popupDetailNote = document.querySelector('#popup-detail-note').value;
    let note = popupDetailNote == "" ? "Không có ghi chú" : popupDetailNote;
    let productcart = {
        id: index,
        soluong: parseInt(soluong),
        note: note
    }
    let vitri = currentuser.cart.findIndex(item => item.id == productcart.id);
    if (vitri == -1) {
        currentuser.cart.push(productcart);
    } else {
        currentuser.cart[vitri].soluong = parseInt(currentuser.cart[vitri].soluong) + parseInt(productcart.soluong);
    }
    localStorage.setItem('currentuser', JSON.stringify(currentuser));
    updateAmount();
    closeModal();
    // toast({ title: 'Success', message: 'Thêm thành công sản phẩm vào giỏ hàng', type: 'success', duration: 3000 });
}

//Show gio hang
function showCart() {
    if (localStorage.getItem('currentuser') != null) {
        let currentuser = JSON.parse(localStorage.getItem('currentuser'));
        if (currentuser.cart.length != 0) {
            document.querySelector('.gio-hang-trong').style.display = 'none';
            document.querySelector('button.thanh-toan').classList.remove('disabled');
            let productcarthtml = '';
            currentuser.cart.forEach(item => {
                let product = getProduct(item);
                productcarthtml += `<li class="cart-item" data-id="${product.id}">
                <div class="cart-item-info">
                    <img src="${product.img}" class="cart-item-img">
                    <p class="cart-item-title">
                        ${product.title}
                    </p>
                    <span class="cart-item-price price" data-price="${product.price}">
                    ${vnd(parseInt(product.price))}
                    </span>
                </div>
                <p class="product-note"><i class="fa-solid fa-pencil"></i><span>${product.note}</span></p>
                <div class="cart-item-control">
                    <button class="cart-item-delete" onclick="deleteCartItem(${product.id},this)"><i class="fa-solid fa-trash"></i>Xóa</button>
                    <div class="buttons_added">
                        <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                        <input class="input-qty" max="100" min="1" name="" type="number" value="${product.soluong}">
                        <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
                    </div>
                </div>
            </li>`
            });
            document.querySelector('.cart-list').innerHTML = productcarthtml;
            updateCartTotal();
            saveAmountCart();
        } else {
            document.querySelector('.gio-hang-trong').style.display = 'flex'
        }
    }
    let modalCart = document.querySelector('.modal-cart');
    let containerCart = document.querySelector('.cart-container');
    let themmon = document.querySelector('.them-mon');
    modalCart.onclick = function () {
        closeCart();
    }
    themmon.onclick = function () {
        closeCart();
    }
    containerCart.addEventListener('click', (e) => {
        e.stopPropagation();
    })
}

// Delete cart item
function deleteCartItem(id, el) {
    let cartParent = el.parentNode.parentNode;
    cartParent.remove();
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let vitri = currentUser.cart.findIndex(item => item.id = id)
    currentUser.cart.splice(vitri, 1);

    // Nếu trống thì hiển thị giỏ hàng trống
    if (currentUser.cart.length == 0) {
        document.querySelector('.gio-hang-trong').style.display = 'flex';
        document.querySelector('button.thanh-toan').classList.add('disabled');
    }
    localStorage.setItem('currentuser', JSON.stringify(currentUser));
    updateCartTotal();
}

//Update cart total
function updateCartTotal() {
    document.querySelector('.text-price').innerText = vnd(getCartTotal());
}

// function getCartTotal() {
    //     let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    //     let tongtien = 0;
    //     if (currentUser && currentUser.cart.length) {
        
    //         currentUser.cart.forEach(item => {
//             console.log('Cart item:', item);
//             let product = getProduct(item.id);
//             if (product){
    //                 tongtien += (parseInt(product.soluong) * parseInt(product.price));
//                 console.log('Running total:', tongtien);
//             }
//         });
//     }
//     console.log('Total cart:', tongtien);
//     return tongtien;
// }

// Lay tong tien don hang
function getCartTotal() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let tongtien = 0;
    if (currentUser != null) {
        currentUser.cart.forEach(item => {
            let product = getProduct(item);
            tongtien += (parseInt(product.soluong) * parseInt(product.price));
        });
    }
    return tongtien;
}

// Get Product 
function getProduct(item) {
    let products = JSON.parse(localStorage.getItem('products'));
    let infoProductCart = products.find(sp => item.id == sp.id)
    let product = {
        ...infoProductCart,
        ...item
    }
    return product;
}

window.onload = updateAmount();
window.onload = updateCartTotal();

// Lay so luong hang

function getAmountCart() {
    let currentuser = JSON.parse(localStorage.getItem('currentuser'))
    let amount = 0;
    currentuser.cart.forEach(element => {
        amount += parseInt(element.soluong);
    });
    return amount;
}

//Update Amount Cart 
function updateAmount() {
    if (localStorage.getItem('currentuser') != null) {
        let amount = getAmountCart();
        document.querySelector('.count-product-cart').innerText = amount;
    }
}

// Save Cart Info
function saveAmountCart() {
    let cartAmountbtn = document.querySelectorAll(".cart-item-control .is-form");
    let listProduct = document.querySelectorAll('.cart-item');
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    cartAmountbtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            let id = listProduct[parseInt(index / 2)].getAttribute("data-id");
            let productId = currentUser.cart.find(item => {
                return item.id == id;
            });
            productId.soluong = parseInt(listProduct[parseInt(index / 2)].querySelector(".input-qty").value);
            localStorage.setItem('currentuser', JSON.stringify(currentUser));
            updateCartTotal();
        })
    });
}

// Open & Close Cart
function openCart() {
    showCart();
    document.querySelector('.modal-cart').classList.add('open');
    body.style.overflow = "hidden";
}

function closeCart() {
    document.querySelector('.modal-cart').classList.remove('open');
    body.style.overflow = "auto";
    updateAmount();
}

// Open Search Advanced
document.querySelector(".filter-btn").addEventListener("click",(e) => {
    e.preventDefault();
    document.querySelector(".advanced-search").classList.toggle("open");
    document.getElementById("home-title").scrollIntoView();
})

document.querySelector(".form-search-input").addEventListener("click",(e) => {
    e.preventDefault();
    document.getElementById("home-title").scrollIntoView();
})

function closeSearchAdvanced() {
    document.querySelector(".advanced-search").classList.toggle("open");
}

//Open Search Mobile 
function openSearchMb() {
    document.querySelector(".header-middle-left").style.display = "none";
    document.querySelector(".header-middle-center").style.display = "block";
    document.querySelector(".header-middle-right-item.close").style.display = "block";
    let liItem = document.querySelectorAll(".header-middle-right-item.open");
    for(let i = 0; i < liItem.length; i++) {
        liItem[i].style.setProperty("display", "none", "important")
    }
}

//Close Search Mobile 
function closeSearchMb() {
    document.querySelector(".header-middle-left").style.display = "block";
    document.querySelector(".header-middle-center").style.display = "none";
    document.querySelector(".header-middle-right-item.close").style.display = "none";
    let liItem = document.querySelectorAll(".header-middle-right-item.open");
    for(let i = 0; i < liItem.length; i++) {
        liItem[i].style.setProperty("display", "block", "important")
    }
}

//Signup && Login Form

// Chuyen doi qua lai SignUp & Login 
let signup = document.querySelector('.signup-link');
let login = document.querySelector('.login-link');
let container = document.querySelector('.signup-login .modal-container');
login.addEventListener('click', () => {
    container.classList.add('active');
})

signup.addEventListener('click', () => {
    container.classList.remove('active');
})

let signupbtn = document.getElementById('signup');
let loginbtn = document.getElementById('login');
let formsg = document.querySelector('.modal.signup-login')
signupbtn.addEventListener('click', () => {
    window.location.href = 'login.html';
})

loginbtn.addEventListener('click', () => {
    window.location.href = 'login.html';
})

// Dang nhap & Dang ky

// Chức năng đăng ký
let signupButton = document.getElementById('signup-button');
let loginButton = document.getElementById('login-button');
signupButton.addEventListener('click', (event) => {
    event.preventDefault();
    let fullNameUser = document.getElementById('fullname').value;
    let phoneUser = document.getElementById('phone').value;
    let passwordUser = document.getElementById('password').value;
    let passwordConfirmation = document.getElementById('password_confirmation').value;
    let checkSignup = document.getElementById('checkbox-signup').checked;
    // Check validate
    if (fullNameUser.length == 0) {
        document.querySelector('.form-message-name').innerHTML = 'Vui lòng nhập họ vâ tên';
        document.getElementById('fullname').focus();
    } else if (fullNameUser.length < 3) {
        document.getElementById('fullname').value = '';
        document.querySelector('.form-message-name').innerHTML = 'Vui lòng nhập họ và tên lớn hơn 3 kí tự';
    } else {
        document.querySelector('.form-message-name').innerHTML = '';
    }
    if (phoneUser.length == 0) {
        document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại';
    } else if (phoneUser.length != 10) {
        document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
        document.getElementById('phone').value = '';
    } else {
        document.querySelector('.form-message-phone').innerHTML = '';
    }
    if (passwordUser.length == 0) {
        document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu';
    } else if (passwordUser.length < 6) {
        document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('password').value = '';
    } else {
        document.querySelector('.form-message-password').innerHTML = '';
    }
    if (passwordConfirmation.length == 0) {
        document.querySelector('.form-message-password-confi').innerHTML = 'Vui lòng nhập lại mật khẩu';
    } else if (passwordConfirmation !== passwordUser) {
        document.querySelector('.form-message-password-confi').innerHTML = 'Mật khẩu không khớp';
        document.getElementById('password_confirmation').value = '';
    } else {
        document.querySelector('.form-message-password-confi').innerHTML = '';
    }
    if (checkSignup != true) {
        document.querySelector('.form-message-checkbox').innerHTML = 'Vui lòng check đăng ký';
    } else {
        document.querySelector('.form-message-checkbox').innerHTML = '';
    }

    if (fullNameUser && phoneUser && passwordUser && passwordConfirmation && checkSignup) {
        if (passwordConfirmation == passwordUser) {
            let user = {
                fullname: fullNameUser,
                phone: phoneUser,
                password: passwordUser,
                address: '',
                email: '',
                status: 1,
                join: new Date(),
                cart: [],
                userType: 0
            }
            let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];
            let checkloop = accounts.some(account => {
                return account.phone == user.phone;
            })
            if (!checkloop) {
                accounts.push(user);
                localStorage.setItem('accounts', JSON.stringify(accounts));
                localStorage.setItem('currentuser', JSON.stringify(user));
                toast({ title: 'Thành công', message: 'Tạo thành công tài khoản !', type: 'success', duration: 3000 });
                closeModal();
                kiemtradangnhap();
                updateAmount();
            } else {
                toast({ title: 'Thất bại', message: 'Tài khoản đã tồn tại !', type: 'error', duration: 3000 });
            }
        } else {
            toast({ title: 'Thất bại', message: 'Sai mật khẩu !', type: 'error', duration: 3000 });
        }
    }
}
)

// Dang nhap
loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    let phonelog = document.getElementById('phone-login').value;
    let passlog = document.getElementById('password-login').value;
    let accounts = JSON.parse(localStorage.getItem('accounts'));

    if (phonelog.length == 0) {
        document.querySelector('.form-message.phonelog').innerHTML = 'Vui lòng nhập vào số điện thoại';
    } else if (phonelog.length != 10) {
        document.querySelector('.form-message.phonelog').innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
        document.getElementById('phone-login').value = '';
    } else {
        document.querySelector('.form-message.phonelog').innerHTML = '';
    }

    if (passlog.length == 0) {
        document.querySelector('.form-message-check-login').innerHTML = 'Vui lòng nhập mật khẩu';
    } else if (passlog.length < 6) {
        document.querySelector('.form-message-check-login').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('passwordlogin').value = '';
    } else {
        document.querySelector('.form-message-check-login').innerHTML = '';
    }

    if (phonelog && passlog) {
        let vitri = accounts.findIndex(item => item.phone == phonelog);
        if (vitri == -1) {
            toast({ title: 'Error', message: 'Tài khoản của bạn không tồn tại', type: 'error', duration: 3000 });
        } else if (accounts[vitri].password == passlog) {
            if(accounts[vitri].status == 0) {
                toast({ title: 'Warning', message: 'Tài khoản của bạn đã bị khóa', type: 'warning', duration: 3000 });
            } else {
                localStorage.setItem('currentuser', JSON.stringify(accounts[vitri]));
                toast({ title: 'Success', message: 'Đăng nhập thành công', type: 'success', duration: 3000 });
                closeModal();
                kiemtradangnhap();
                checkAdmin();
                updateAmount();
            }
        } else {
            toast({ title: 'Warning', message: 'Sai mật khẩu', type: 'warning', duration: 3000 });
        }
    }
})

// Kiểm tra xem có tài khoản đăng nhập không ?
function kiemtradangnhap() {
    let currentUser = localStorage.getItem('currentuser');
    if (currentUser != null) {
        let user = JSON.parse(currentUser);
        document.querySelector('.auth-container').innerHTML = `<span class="text-dndk">Tài khoản</span>
            <span class="text-tk">${user.fullname} <i class="fa-sharp fa-solid fa-caret-down"></span>`
        document.querySelector('.header-middle-right-menu').innerHTML = `<li><a href="javascript:;" onclick="myAccount()"><i class="fa-solid fa-circle-user"></i> Tài khoản của tôi</a></li>
            <li><a href="javascript:;" onclick="orderHistory()"><i class="fa-solid fa-bag-shopping"></i> Đơn hàng đã mua</a></li>
            <li class="border"><a id="logout" href="javascript:;"><i class="fa-solid fa-right-from-bracket"></i> Thoát tài khoản</a></li>`
        document.querySelector('#logout').addEventListener('click',logOut)
    }
}

function logOut() {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    user = JSON.parse(localStorage.getItem('currentuser'));
    let vitri = accounts.findIndex(item => item.phone == user.phone)
    accounts[vitri].cart.length = 0;
    for (let i = 0; i < user.cart.length; i++) {
        accounts[vitri].cart[i] = user.cart[i];
    }
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.removeItem('currentuser');
    window.location = "index.html";
}

function checkAdmin() {
    let user = JSON.parse(localStorage.getItem('currentuser'));
    if(user && user.userType == 1) {
        let node = document.createElement(`li`);
        node.innerHTML = `<a href="./admin.html"><i class="fa-solid fa-gear"></i> Quản lý cửa hàng</a>`
        document.querySelector('.header-middle-right-menu').prepend(node);
    } 
}

window.onload = kiemtradangnhap();
window.onload = checkAdmin();

// Chuyển đổi trang chủ và trang thông tin tài khoản
function myAccount() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('trangchu').classList.add('hide');
    document.getElementById('order-history').classList.remove('open');
    document.getElementById('account-user').classList.add('open');
    userInfo();
}

// Chuyển đổi trang chủ và trang xem lịch sử đặt hàng 
function orderHistory() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('account-user').classList.remove('open');
    document.getElementById('trangchu').classList.add('hide');
    document.getElementById('order-history').classList.add('open');
    renderOrderProduct();
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function userInfo() {
    let user = JSON.parse(localStorage.getItem('currentuser'));
    document.getElementById('infoname').value = user.fullname;
    document.getElementById('infophone').value = user.phone;
    document.getElementById('infoemail').value = user.email;
    document.getElementById('infoaddress').value = user.address;
    if (user.email == undefined) {
        infoemail.value = '';
    }
    if (user.address == undefined) {
        infoaddress.value = '';
    }
}

// Thay doi thong tin
function changeInformation() {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let user = JSON.parse(localStorage.getItem('currentuser'));
    let infoname = document.getElementById('infoname');
    let infoemail = document.getElementById('infoemail');
    let infoaddress = document.getElementById('infoaddress');

    user.fullname = infoname.value;
    if (infoemail.value.length > 0) {
        if (!emailIsValid(infoemail.value)) {
            document.querySelector('.inforemail-error').innerHTML = 'Vui lòng nhập lại email!';
            infoemail.value = '';
        } else {
            user.email = infoemail.value;
        }
    }

    if (infoaddress.value.length > 0) {
        user.address = infoaddress.value;
    }

    let vitri = accounts.findIndex(item => item.phone == user.phone)

    accounts[vitri].fullname = user.fullname;
    accounts[vitri].email = user.email;
    accounts[vitri].address = user.address;
    localStorage.setItem('currentuser', JSON.stringify(user));
    localStorage.setItem('accounts', JSON.stringify(accounts));
    kiemtradangnhap();
    toast({ title: 'Success', message: 'Cập nhật thông tin thành công !', type: 'success', duration: 3000 });
}

// Đổi mật khẩu 
function changePassword() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    let passwordCur = document.getElementById('password-cur-info');
    let passwordAfter = document.getElementById('password-after-info');
    let passwordConfirm = document.getElementById('password-comfirm-info');
    let check = true;
    if (passwordCur.value.length == 0) {
        document.querySelector('.password-cur-info-error').innerHTML = 'Vui lòng nhập mật khẩu hiện tại';
        check = false;
    } else {
        document.querySelector('.password-cur-info-error').innerHTML = '';
    }

    if (passwordAfter.value.length == 0) {
        document.querySelector('.password-after-info-error').innerHTML = 'Vui lòn nhập mật khẩu mới';
        check = false;
    } else {
        document.querySelector('.password-after-info-error').innerHTML = '';
    }

    if (passwordConfirm.value.length == 0) {
        document.querySelector('.password-after-comfirm-error').innerHTML = 'Vui lòng nhập mật khẩu xác nhận';
        check = false;
    } else {
        document.querySelector('.password-after-comfirm-error').innerHTML = '';
    }

    if (check == true) {
        if (passwordCur.value.length > 0) {
            if (passwordCur.value == currentUser.password) {
                document.querySelector('.password-cur-info-error').innerHTML = '';
                if (passwordAfter.value.length > 0) {
                    if (passwordAfter.value.length < 6) {
                        document.querySelector('.password-after-info-error').innerHTML = 'Vui lòng nhập mật khẩu mới có số  kí tự lớn hơn bằng 6';
                    } else {
                        document.querySelector('.password-after-info-error').innerHTML = '';
                        if (passwordConfirm.value.length > 0) {
                            if (passwordConfirm.value == passwordAfter.value) {
                                document.querySelector('.password-after-comfirm-error').innerHTML = '';
                                currentUser.password = passwordAfter.value;
                                localStorage.setItem('currentuser', JSON.stringify(currentUser));
                                let userChange = JSON.parse(localStorage.getItem('currentuser'));
                                let accounts = JSON.parse(localStorage.getItem('accounts'));
                                let accountChange = accounts.find(acc => {
                                    return acc.phone = userChange.phone;
                                })
                                accountChange.password = userChange.password;
                                localStorage.setItem('accounts', JSON.stringify(accounts));
                                toast({ title: 'Success', message: 'Đổi mật khẩu thành công !', type: 'success', duration: 3000 });
                            } else {
                                document.querySelector('.password-after-comfirm-error').innerHTML = 'Mật khẩu bạn nhập không trùng khớp';
                            }
                        } else {
                            document.querySelector('.password-after-comfirm-error').innerHTML = 'Vui lòng xác nhận mật khẩu';
                        }
                    }
                } else {
                    document.querySelector('.password-after-info-error').innerHTML = 'Vui lòng nhập mật khẩu mới';
                }
            } else {
                document.querySelector('.password-cur-info-error').innerHTML = 'Bạn đã nhập sai mật khẩu hiện tại';
            }
        }
    }
}

function getProductInfo(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(item => {
        return item.id == id;
    })
}

// Quan ly don hang
function renderOrderProduct() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let order = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : [];
    let orderHtml = "";
    let arrDonHang = [];
    for (let i = 0; i < order.length; i++) {
        if (order[i].khachhang === currentUser.phone) {
            arrDonHang.push(order[i]);
        }
    }
    if (arrDonHang.length == 0) {
        orderHtml = `<div class="empty-order-section"><img src="./assets/img/empty-order.jpg" alt="" class="empty-order-img"><p>Chưa có đơn hàng nào</p></div>`;
    } else {
        arrDonHang.forEach(item => {
            let productHtml = `<div class="order-history-group">`;
            let chiTietDon = getOrderDetails(item.id);
            chiTietDon.forEach(sp => {
                let infosp = getProductInfo(sp.id);
                productHtml += `<div class="order-history">
                    <div class="order-history-left">
                        <img src="${infosp.img}" alt="">
                        <div class="order-history-info">
                            <h4>${infosp.title}!</h4>
                            <p class="order-history-note"><i class="fa-solid fa-pen"></i> ${sp.note}</p>
                            <p class="order-history-quantity">x${sp.soluong}</p>
                        </div>
                    </div>
                    <div class="order-history-right">
                        <div class="order-history-price">
                            <span class="order-history-current-price">${vnd(sp.price)}</span>
                        </div>                         
                    </div>
                </div>`;
            });
            // sửa icon giúp toi nhé
            const iconCompl=item.trangthai == 1?'<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-spinner fa-spin"></i>';
            let textCompl = item.trangthai == 1 ? "Đã xử lý" : "Đang xử lý";
            let classCompl = item.trangthai == 1 ? "complete" : "no-complete"
            productHtml += `<div class="order-history-control">
                <div class="order-history-status">
                    <span class="order-history-status-sp ${classCompl}">${iconCompl} ${textCompl}</span>
                    <button id="order-history-detail" onclick="detailOrder('${item.id}')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>
                </div>
                <div class="order-history-total">
                <span class="order-history-total-desc">Tổng tiền: </span>
                <span class="order-history-toltal-price">${vnd(item.tongtien)}</span>
                <button class="delete-order-btn" onclick="deleteOrder('${item.id}')"><i class="fa-solid fa-trash"></i> Xóa</button>
                </div>
            </div>`
            productHtml += `</div>`;
            orderHtml += productHtml;
        });
    }
    document.querySelector(".order-history-section").innerHTML = orderHtml;
}

//delete ordered
function deleteOrder(orderId) {
  let orders = JSON.parse(localStorage.getItem('order')) || [];
  orders = orders.filter(order => order.id !== orderId);
  localStorage.setItem('order', JSON.stringify(orders));
  toast({
     title: 'Xóa đơn hàng',
    message: 'Đơn hàng đã được xóa thành công!',
    type: 'success',
     duration: 3000
    });
    renderOrderProduct();
}
 



// Get Order Details
function getOrderDetails(madon) {
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let ctDon = [];
    orderDetails.forEach(item => {
        if(item.madon == madon) {
            ctDon.push(item);
        }
    });
    return ctDon;
}

// Format Date
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
}

// Xem chi tiet don hang
function detailOrder(id) {
    let order = JSON.parse(localStorage.getItem("order"));
    let detail = order.find(item => {
        return item.id == id;
    })
    document.querySelector(".modal.detail-order").classList.add("open");
    let detailOrderHtml = `<ul class="detail-order-group">
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-solid fa-calendar-days"></i> Ngày đặt hàng</span>
            <span class="detail-order-item-right">${formatDate(detail.thoigiandat)}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-solid fa-truck"></i> Hình thức giao</span>
            <span class="detail-order-item-right">${detail.hinhthucgiao}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-solid fa-clock"></i> Ngày nhận hàng</span>
            <span class="detail-order-item-right">${(detail.thoigiangiao == "" ? "" : (detail.thoigiangiao + " - ")) + formatDate(detail.ngaygiaohang)}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-solid fa-location-dot"></i> Địa điểm nhận</span>
            <span class="detail-order-item-right">${detail.diachinhan}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-solid fa-person"></i> Người nhận</span>
            <span class="detail-order-item-right">${detail.tenguoinhan}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-solid fa-phone"></i> Số điện thoại nhận</span>
            <span class="detail-order-item-right">${detail.sdtnhan}</span>
        </li>
    </ul>`
    document.querySelector(".detail-order-content").innerHTML = detailOrderHtml;
}

// Create id order 
function createId(arr) {
    let id = arr.length + 1;
    let check = arr.find(item => item.id == "DH" + id)
    while (check != null) {
        id++;
        check = arr.find(item => item.id == "DH" + id)
    }
    return "DH" + id;
}

// Back to top
window.onscroll = () => {
    let backtopTop = document.querySelector(".back-to-top")
    if (document.documentElement.scrollTop > 100) {
        backtopTop.classList.add("active");
    } else {
        backtopTop.classList.remove("active");
    }
}

// Auto hide header on scroll
const headerNav = document.querySelector(".header-bottom");
// const headerMiddle = document.querySelector(".header-middle");
// const headerTop = document.querySelector(".header-top");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if(lastScrollY < window.scrollY ) {
        // headerNav.classList.add("hide")
        // headerTop.classList.add("hide")
        // headerMiddle.classList.add("hide")
    } else {
        if (!document.querySelector(".advanced-search").classList.contains("open")) {

            // headerNav.classList.remove("hide")
            // headerTop.classList.remove("hide")
            // headerMiddle.classList.remove("hide")
        }
    }
    lastScrollY = window.scrollY;
})

//Nhấn nút sẽ ẩn header bottom

const btnCloseNav = document.getElementById("btnCloseNav");
const btnShowNavLeft = document.getElementById("btnShowNavLeft");
const icon = document.getElementById("closeNav");
btnCloseNav.addEventListener("click", function() {
    if (window.innerWidth >= 827) {
        headerNav.classList.toggle("hide")
        icon.classList.toggle("fa-chevron-up")
        icon.classList.toggle("fa-chevron-down")
    }
});
btnShowNavLeft.addEventListener("click", function() {
    if (window.innerWidth < 827) {
        headerNav.classList.toggle("show")
    }
})

window.addEventListener("resize", function() {
  if (window.innerWidth < 827) {
    // sang mobile: bỏ class hide (dùng cho desktop)
    headerNav.classList.remove("hide");
  } else {
    // sang desktop: bỏ class show (dùng cho mobile)
    headerNav.classList.remove("show");
  }
});





// Dong chu chay tren header-top 
const track = document.getElementById("track");
let x = 0;

function animate() {
  x -= 2; // tốc độ (px mỗi frame), chỉnh nhỏ/lớn để chậm/nhanh
  if (Math.abs(x) >= track.scrollWidth / 2) {
    // khi chạy hết nửa chiều dài thì reset về 0
    x = 0;
  }
  track.style.transform = `translateX(${x}px)`;
  requestAnimationFrame(animate);
}

// nhân đôi nội dung để nối đuôi nhau
if (!track.dataset.duplicated) {
  track.innerHTML += track.innerHTML;
  track.dataset.duplicated = "true";
}

animate();

// Lấy tên category từ ID
function getCategoryNameById(categoryId) {
    let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    // Tìm key (tên) từ value (ID)
    for (let name in categoryIdMapping) {
        if (categoryIdMapping[name] === categoryId) {
            return name;
        }
    }
    return categoryId; // Nếu không tìm thấy, trả về ID
}

// Page
function renderProducts(showProduct) {
    let productHtml = '';
    if(showProduct.length == 0) {
        document.getElementById("home-title").style.display = "none";
        productHtml = `<div class="no-result"><div class="no-result-h">Tìm kiếm không có kết quả</div><div class="no-result-p">Xin lỗi, chúng tôi không thể tìm được kết quả hợp với tìm kiếm của bạn</div><div class="no-result-i"><i class="fa-light fa-face-sad-cry"></i></div></div>`;
    } else {
        document.getElementById("home-title").style.display = "block";
        showProduct.forEach((product) => {
            let avgRating = calculateAverageRating(product.id);
            let reviewCount = getReviewCount(product.id);
            let ratingDisplay = avgRating > 0 ? 
                `<div class="product-rating">
                    ${generateStarDisplay(Math.round(avgRating))}
                    <span class="rating-score">${avgRating.toFixed(1)}</span>
                    <span class="rating-count">(${reviewCount})</span>
                </div>` : 
                `<div class="product-rating">
                    <span class="no-rating">Chưa có đánh giá</span>
                </div>`;
            
            productHtml += `
            <div class="col-product">
                <article class="card-product" >
                    <div class="card-header">
                        <a href="#" class="card-image-link" onclick="detailProduct(${product.id})">
                        <img class="card-image" src="${product.img}" alt="${product.title}">
                        </a>
                    </div>
                    <div class="food-info">
                        <div class="card-content">
                            <div class="card-title">
                                <a href="#" class="card-title-link" onclick="detailProduct(${product.id})">${product.title}</a>
                            </div>
                            ${ratingDisplay}
                        </div>
                        <div class="card-footer">
                            <div class="product-price">
                                <span class="current-price">${vnd(product.price)}</span>
                            </div>
                        <div class="product-buy">
                            <button onclick="detailProduct(${product.id})" class="card-button order-item"><i class="fa-solid fa-eye"></i> Xem chi tiết</button>
                        </div> 
                    </div>
                    </div>
                </article>
            </div>`;
        });
    }
    document.getElementById('home-products').innerHTML = productHtml;
}

// Find Product
function getProductAll() {
    return JSON.parse(localStorage.getItem('products')).filter(item => item.status == 1);
}
var productAll = getProductAll();

function searchProducts(mode) {
    // Refresh productAll để lấy dữ liệu mới nhất
    productAll = getProductAll();
    
    let valeSearchInput = document.querySelector('.form-search-input').value;
    let valueCategory = document.getElementById("advanced-search-category-select").value;
    let minPrice = document.getElementById("min-price").value;
    let maxPrice = document.getElementById("max-price").value;
    if(parseInt(minPrice) > parseInt(maxPrice) && minPrice != "" && maxPrice != "") {
        alert("Giá đã nhập sai !");
    }

    // Lấy ID của category từ tên để filter
    let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    let categoryId = categoryIdMapping[valueCategory];
    
    let result = valueCategory == "Tất cả" ? productAll : productAll.filter((item) => {
        return item.category == categoryId;
    });

    result = valeSearchInput == "" ? result : result.filter(item => {
        return item.title.toString().toUpperCase().includes(valeSearchInput.toString().toUpperCase());
    })

    if(minPrice == "" && maxPrice != "") {
        result = result.filter((item) => item.price <= maxPrice);
    } else if (minPrice != "" && maxPrice == "") {
        result = result.filter((item) => item.price >= minPrice);
    } else if(minPrice != "" && maxPrice != "") {
        result = result.filter((item) => item.price <= maxPrice && item.price >= minPrice);
    }
    document.getElementById("home-title").scrollIntoView({
            behavior: 'smooth',
            block: 'start'
    });

    switch (mode){
        case 0:
            result = JSON.parse(localStorage.getItem('products'));;
            document.querySelector('.form-search-input').value = "";
            document.getElementById("advanced-search-category-select").value = "Tất cả";
            document.getElementById("min-price").value = "";
            document.getElementById("max-price").value = "";
            break;
        case 1:
            result.sort((a,b) => a.price - b.price)
            break;
        case 2:
            result.sort((a,b) => b.price - a.price)
            break;
    }
    showHomeProduct(result)
}

// Phân trang 
let perPage = 12;
let currentPage = 1;
let totalPage = 0;
let perProducts = [];

function displayList(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = (currentPage - 1) * perPage + perPage;
    let productShow = productAll.slice(start, end);
    renderProducts(productShow);
}

function showHomeProduct(products) {
    let productAll = products.filter(item => item.status == 1)
    displayList(productAll, perPage, currentPage);
    setupPagination(productAll, perPage, currentPage);
}

window.onload = showHomeProduct(JSON.parse(localStorage.getItem('products')))
window.onload = renderCategoryMenu();

function setupPagination(productAll, perPage, currentPage) {
    document.querySelector('.page-nav-list').innerHTML = '';
    let page_count = Math.ceil(productAll.length / perPage);

    // nút về trang đầu <<
    if (currentPage > 1) {
        let first = document.createElement("li");
        first.classList.add("page-nav-item");
        first.innerHTML = `<a href="javascript:;"><i class="fa-solid fa-angles-left"></i></a>`; // <<
        first.addEventListener("click", function () {
            currentPage = 1;
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll, perPage, currentPage);
        });
        document.querySelector('.page-nav-list').appendChild(first);
    }

    // nút prev <
    if (currentPage > 1) {
        let prev = document.createElement("li");
        prev.classList.add("page-nav-item");
        prev.innerHTML = `<a href="javascript:;"><i class="fa-solid fa-angle-left"></i></a>`; // <
        prev.addEventListener("click", function () {
            currentPage--;
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll, perPage, currentPage);
        });
        document.querySelector('.page-nav-list').appendChild(prev);
    }

    // hiển thị 3 số trang
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(page_count, currentPage + 1);

    for (let i = start; i <= end; i++) {
        let li = paginationChange(i, productAll, currentPage, perPage);
        document.querySelector('.page-nav-list').appendChild(li);
    }

    // nút next >
    if (currentPage < page_count) {
        let next = document.createElement("li");
        next.classList.add("page-nav-item");
        next.innerHTML = `<a href="javascript:;"><i class="fa-solid fa-angle-right"></i></a>`; // >
        next.addEventListener("click", function () {
            currentPage++;
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll, perPage, currentPage);
        });
        document.querySelector('.page-nav-list').appendChild(next);
    }

    // nút tới trang cuối >>
    if (currentPage < page_count) {
        let last = document.createElement("li");
        last.classList.add("page-nav-item");
        last.innerHTML = `<a href="javascript:;"><i class="fa-solid fa-angles-right"></i></a>`; // >>
        last.addEventListener("click", function () {
            currentPage = page_count;
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll, perPage, currentPage);
        });
        document.querySelector('.page-nav-list').appendChild(last);
    }
}

function paginationChange(page, productAll, currentPage, perPage) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="javascript:;">${page}</a>`;
    if (currentPage == page) node.classList.add('active');
    node.addEventListener('click', function () {
        currentPage = page;
        displayList(productAll, perPage, currentPage);
        setupPagination(productAll, perPage, currentPage);
        document.getElementById("home-title").scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
    return node;
}

// Render menu categories động
function renderCategoryMenu() {
    let categories = JSON.parse(localStorage.getItem('defaultCategories')) || [];
    let menuList = document.getElementById('menu-list');
    let advancedSearchSelect = document.getElementById('advanced-search-category-select');
    
    // Xóa các menu item cũ (trừ "Trang chủ")
    let menuItems = menuList.querySelectorAll('li:not(:first-child)');
    menuItems.forEach(item => item.remove());
    
    // Xóa các option cũ (trừ "Tất cả")
    let selectOptions = advancedSearchSelect.querySelectorAll('option:not(:first-child)');
    selectOptions.forEach(option => option.remove());
    
    // Thêm category vào menu
    categories.forEach(category => {
        // Thêm vào menu navigation
        let li = document.createElement('li');
        li.className = 'menu-list-item';
        li.onclick = function() { showCategory(category); };
        li.innerHTML = `<a href="javascript:;" class="menu-link">${category}</a>`;
        menuList.appendChild(li);
        
        // Thêm vào dropdown advanced search
        let option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        advancedSearchSelect.appendChild(option);
    });
}

// Hiển thị chuyên mục
function showCategory(categoryName) {
    document.getElementById('trangchu').classList.remove('hide');
    document.getElementById('account-user').classList.remove('open');
    document.getElementById('order-history').classList.remove('open');
    
    // Refresh productAll để lấy dữ liệu mới nhất
    productAll = getProductAll();

    let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    let categoryId = categoryIdMapping[categoryName] || categoryName;

    let productSearch = [];
    if (categoryName === 'Đã xóa') {
        // Hiển thị tất cả sản phẩm có category bắt đầu bằng 'deleted:'
        productSearch = productAll.filter(value => typeof value.category === 'string' && value.category.startsWith('deleted:'));
    } else {
        productSearch = productAll.filter(value => value.category === categoryId);
    }
    
    let currentPageSeach = 1;
    displayList(productSearch, perPage, currentPageSeach);
    setupPagination(productSearch, perPage, currentPageSeach);
    document.getElementById("home-title").scrollIntoView();
    if (window.innerWidth >= 872) {
        headerNav.classList.toggle("hide")
    } else {
        headerNav.classList.toggle("show")
    }
}

// MỞ POPUP "VỀ CHÚNG TÔI "
function showPopup() {
  document.getElementById('popup').style.display = 'flex';
}

function hidePopup() {
  document.getElementById('popup').style.display = 'none';
}

// Đóng popup khi click ra ngoài
window.addEventListener("click", function(e) {
    const popup = document.getElementById("popup");
    const box = document.querySelector(".popup-box");
    if (e.target === popup) {
        hidePopup();
    }
});

// Open Popup DieuKhoan =====================================================================
function dieukhoan() {
    document.getElementById('dieukhoan').style.display = 'flex';
}
function hideDieuKhoan() {
    document.getElementById('dieukhoan').style.display = 'none';
}

// Đóng popup khi click ra ngoài
window.addEventListener("click", function(e) {
    const dieukhoan = document.getElementById("dieukhoan");
    const boxdk = document.querySelector(".dieukhoan-box");
    if (e.target === dieukhoan) {
        hideDieuKhoan();
    }
});

// Popup Lien he
function lienhe() {
    document.getElementById('lienhe').style.display = 'flex';
}
function hideLienHe() {
    document.getElementById('lienhe').style.display = 'none';
}

// Đóng popup khi click ra ngoài
window.addEventListener("click", function(e) {
    const lienhe = document.getElementById("lienhe");
    const boxlh = document.querySelector(".lienhe-box");
    if (e.target === lienhe) {
        hideLienHe();
    }
});


// Chọn vị trí để lấy hàng tại chỗ
const citySelect = document.getElementById("city");
const districtSelect = document.getElementById("district");
const wardSelect = document.getElementById("ward");

const data = {
  hcm: {
    "Quận 1": ["01 Công trường Công xã Paris, Phường Bến Nghé", "91 Lý Tự Trọng, Phường Bến Thành"],
    "Quận 5": ["273 An Dương Vương, Phường Chợ Quán", "25 Đ. Học Lạc, Phường 14"]
  },
  hn: {
    "Hoàn Kiếm": ["1 Tràng Tiền, Phan Chu Trinh", "57B Đinh Tiên Hoàng, Hàng Bạc"]   ,
    "Ba Đình": ["157 Đội Cấn", "43 Đ. Nguyễn Chí Thanh, Giảng Võ"]
  }
};

citySelect.addEventListener("change", function() {
  const city = this.value;
  districtSelect.innerHTML = "<option value=''>-- Chọn quận/huyện --</option>";
  wardSelect.innerHTML = "<option value=''>-- Chọn chi nhánh --</option>";

  if (data[city]) {
    Object.keys(data[city]).forEach(district => {
      const opt = document.createElement("option");
      opt.value = district;
      opt.textContent = district;
      districtSelect.appendChild(opt);
    });
  }
});

districtSelect.addEventListener("change", function() {
  const city = citySelect.value;
  const district = this.value;
  wardSelect.innerHTML = "<option value=''>-- Chọn chi nhánh --</option>";

  if (data[city] && data[city][district]) {
    data[city][district].forEach(ward => {
      const opt = document.createElement("option");
      opt.value = ward;
      opt.textContent = ward;
      wardSelect.appendChild(opt);
    });
  }
});

// Hàm tính trung bình sao
function calculateAverageRating(productId) {
    let reviews = getReviews(productId);
    if (reviews.length === 0) return 5; // Nếu chưa có đánh giá, hiển thị 5 sao mặc định
    let sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}

// Hàm lấy số lượng đánh giá
function getReviewCount(productId) {
    return getReviews(productId).length;
}

// Hàm tạo HTML hiển thị sao
function generateStarDisplay(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fa-solid fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return stars;
}

// Hàm lấy reviews của sản phẩm
function getReviews(productId) {
    let allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    return allReviews[productId] || [];
}

// Hàm render danh sách reviews
function renderReviews(productId) {
    let reviews = getReviews(productId);
    if (reviews.length === 0) {
        return '<p class="no-reviews"><i class="fa-regular fa-comment"></i> Chưa có đánh giá nào.</p>';
    }
    
    // Sắp xếp đánh giá mới nhất trước
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '<div class="reviews-list">';
    reviews.forEach(review => {
        let user = getUserByPhone(review.userId);
        let userName = user ? user.fullname : 'Người dùng ẩn danh';
        let date = new Date(review.date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        html += `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-user"><i class="fa-solid fa-user"></i> ${userName}</span>
                    <span class="review-date"><i class="fa-regular fa-calendar"></i> ${date}</span>
                </div>
                <div class="review-rating">
                    ${generateStarDisplay(review.rating)}
                </div>
                <p class="review-comment">${review.comment}</p>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// Hàm render form đánh giá
function renderReviewForm(productId) {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser) {
        return '<p class="login-required">Vui lòng đăng nhập để đánh giá sản phẩm.</p>';
    }
    
    // Kiểm tra đã đánh giá chưa
    let reviews = getReviews(productId);
    let hasReviewed = reviews.some(review => review.userId === currentUser.phone);
    
    if (hasReviewed) {
        return '<p class="already-reviewed">Bạn đã đánh giá sản phẩm này.</p>';
    }
    
    return `
        <div class="review-form">
            <h4><i class="fa-solid fa-pen-to-square"></i> Viết đánh giá của bạn</h4>
            <div class="rating-input">
                <span>Đánh giá:</span>
                <div class="stars" id="rating-stars-${productId}" data-selected-rating="0">
                    <i class="fa-regular fa-star" data-rating="1"></i>
                    <i class="fa-regular fa-star" data-rating="2"></i>
                    <i class="fa-regular fa-star" data-rating="3"></i>
                    <i class="fa-regular fa-star" data-rating="4"></i>
                    <i class="fa-regular fa-star" data-rating="5"></i>
                </div>
            </div>
            <textarea id="review-comment-${productId}" placeholder="Nhập bình luận của bạn (tối thiểu 10 ký tự)..." rows="4" maxlength="500"></textarea>
            <button class="submit-review-btn" data-product="${productId}">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Gửi đánh giá</span>
            </button>
        </div>
    `;
}

// Hàm lấy thông tin user theo phone
function getUserByPhone(phone) {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    return accounts.find(acc => acc.phone === phone);
}

// Hàm submit review
function submitReview(productId) {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser) {
        toast({ title: 'Lỗi', message: 'Vui lòng đăng nhập để đánh giá!', type: 'error', duration: 3000 });
        return;
    }
    
    // Kiểm tra đã đánh giá chưa
    let reviews = getReviews(productId);
    let hasReviewed = reviews.some(review => review.userId === currentUser.phone);
    if (hasReviewed) {
        toast({ title: 'Lỗi', message: 'Bạn đã đánh giá sản phẩm này rồi!', type: 'error', duration: 3000 });
        return;
    }
    
    let starsContainer = document.getElementById(`rating-stars-${productId}`);
    if (!starsContainer) {
        toast({ title: 'Lỗi', message: 'Không tìm thấy form đánh giá!', type: 'error', duration: 3000 });
        return;
    }
    
    let rating = parseInt(starsContainer.getAttribute('data-selected-rating')) || 0;
    let commentInput = document.getElementById(`review-comment-${productId}`);
    let comment = commentInput ? commentInput.value.trim() : '';
    
    if (rating === 0) {
        toast({ title: 'Lỗi', message: 'Vui lòng chọn số sao!', type: 'error', duration: 3000 });
        return;
    }
    
    if (comment === '') {
        toast({ title: 'Lỗi', message: 'Vui lòng nhập bình luận!', type: 'error', duration: 3000 });
        return;
    }
    
    if (comment.length < 10) {
        toast({ title: 'Lỗi', message: 'Bình luận phải có ít nhất 10 ký tự!', type: 'error', duration: 3000 });
        return;
    }
    
    let review = {
        userId: currentUser.phone,
        rating: rating,
        comment: comment,
        date: new Date().toISOString()
    };
    
    let allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    if (!allReviews[productId]) {
        allReviews[productId] = [];
    }
    allReviews[productId].push(review);
    localStorage.setItem('productReviews', JSON.stringify(allReviews));
    
    toast({ title: 'Thành công', message: 'Đánh giá của bạn đã được gửi thành công!', type: 'success', duration: 3000 });
    
    // Refresh modal để hiển thị đánh giá mới
    setTimeout(() => {
        detailProduct(productId);
    }, 500);
}
