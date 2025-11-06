window.onload = function() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (currentUser) {
        if (currentUser.userType == 1) {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    }

    // Thêm thông báo lỗi tiếng Việt cho HTML5 validation
    document.querySelectorAll('input').forEach(function(input) {
        // Clear custom validity trước khi validate
        input.addEventListener('input', function() {
            this.setCustomValidity('');
        });
        
        input.addEventListener('change', function() {
            this.setCustomValidity('');
        });

        input.addEventListener('invalid', function(e) {
            this.setCustomValidity('');
            
            if (this.validity.valueMissing) {
                this.setCustomValidity('Vui lòng điền vào trường này');
            } else if (this.validity.typeMismatch) {
                this.setCustomValidity('Vui lòng nhập đúng định dạng');
            } else if (this.validity.patternMismatch) {
                if (this.name === 'phone') {
                    this.setCustomValidity('Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0');
                } else {
                    this.setCustomValidity('Vui lòng nhập đúng định dạng yêu cầu');
                }
            } else if (this.validity.tooShort) {
                this.setCustomValidity('Vui lòng nhập ít nhất ' + this.minLength + ' ký tự');
            } else if (this.validity.tooLong) {
                this.setCustomValidity('Vui lòng nhập tối đa ' + this.maxLength + ' ký tự');
            }
        });
    });

    // Xử lý riêng cho checkbox
    let checkboxSignup = document.getElementById('checkbox-signup');
    
    checkboxSignup.addEventListener('change', function() {
        this.setCustomValidity('');
    });

    checkboxSignup.addEventListener('invalid', function(e) {
        this.setCustomValidity('');
        if (!this.validity.valid) {
            this.setCustomValidity('Bạn phải đồng ý với chính sách trang web');
        }
    });
};

// Tab switching with animation
document.getElementById('login-tab').addEventListener('click', function() {
    let loginForm = document.getElementById('login-form');
    let signupForm = document.getElementById('signup-form');
    
    // Fade out signup form
    signupForm.style.opacity = '0';
    signupForm.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        
        // Small delay for the display change to take effect
        setTimeout(() => {
            loginForm.style.opacity = '1';
            loginForm.style.transform = 'translateX(0)';
        }, 50);
    }, 500);
    
    this.classList.add('active');
    document.getElementById('signup-tab').classList.remove('active');
});

document.getElementById('signup-tab').addEventListener('click', function() {
    let loginForm = document.getElementById('login-form');
    let signupForm = document.getElementById('signup-form');
    
    // Fade out login form
    loginForm.style.opacity = '0';
    loginForm.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        
        // Small delay for the display change to take effect
        setTimeout(() => {
            signupForm.style.opacity = '1';
            signupForm.style.transform = 'translateX(0)';
        }, 50);
    }, 500);
    
    this.classList.add('active');
    document.getElementById('login-tab').classList.remove('active');
});

// Xử lý form đăng nhập
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let phone = document.getElementById("login-phone").value.trim();
    let password = document.getElementById("login-password").value;
    let errorDiv = document.getElementById("login-error");
    
    errorDiv.textContent = "";
    
    // Validation đăng nhập
    if (!phone) {
        errorDiv.textContent = "Vui lòng nhập số điện thoại!";
        return;
    }
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
        errorDiv.textContent = "Số điện thoại phải có đúng 10 chữ số!";
        return;
    }
    if (!password) {
        errorDiv.textContent = "Vui lòng nhập mật khẩu!";
        return;
    }
    if (password.length < 6) {
        errorDiv.textContent = "Mật khẩu phải có ít nhất 6 ký tự!";
        return;
    }
    
    // Lấy danh sách tài khoản
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    
    // Tìm tài khoản khớp
    let user = accounts.find(acc => acc.phone === phone && acc.password === password);
    
    if (user && (user.userType == 1 || user.userType === "1")) {
        // Không cho phép đăng nhập admin từ trang này
        errorDiv.textContent = "Số điện thoại hoặc mật khẩu không đúng.";
        errorDiv.style.color = "#ff6b35";
        return;
    } else if (user && (user.userType == 0 || user.userType === "0")) {
        // Đăng nhập thành công user thường
        localStorage.setItem("currentuser", JSON.stringify(user));
        window.location.href = "index.html";
    } else {
        // Đăng nhập thất bại
        errorDiv.textContent = "Số điện thoại hoặc mật khẩu không đúng!";
    }
});

// Xử lý form đăng ký
document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let fullname = document.getElementById("signup-fullname").value.trim();
    let phone = document.getElementById("signup-phone").value.trim();
    let password = document.getElementById("signup-password").value;
    let passwordConfirm = document.getElementById("signup-password-confirm").value;
    let checkbox = document.getElementById("checkbox-signup").checked;
    let errorDiv = document.getElementById("login-error");
    
    errorDiv.textContent = "";
    
    // Validation chi tiết
    // 1. Kiểm tra họ tên
    if (!fullname) {
        errorDiv.textContent = "Vui lòng nhập họ tên!";
        return;
    }
    if (fullname.length < 3) {
        errorDiv.textContent = "Họ tên phải có ít nhất 3 ký tự!";
        return;
    }
    if (fullname.length > 50) {
        errorDiv.textContent = "Họ tên không được vượt quá 50 ký tự!";
        return;
    }
    if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/.test(fullname)) {
        errorDiv.textContent = "Họ tên chỉ được chứa chữ cái và khoảng trắng!";
        return;
    }
    
    // 2. Kiểm tra số điện thoại
    if (!phone) {
        errorDiv.textContent = "Vui lòng nhập số điện thoại!";
        return;
    }
    if (phone.length !== 10) {
        errorDiv.textContent = "Số điện thoại phải có đúng 10 chữ số!";
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        errorDiv.textContent = "Số điện thoại chỉ được chứa chữ số!";
        return;
    }
    if (!phone.startsWith('0')) {
        errorDiv.textContent = "Số điện thoại phải bắt đầu bằng số 0!";
        return;
    }
    
    // 3. Kiểm tra mật khẩu
    if (!password) {
        errorDiv.textContent = "Vui lòng nhập mật khẩu!";
        return;
    }
    if (password.length < 6) {
        errorDiv.textContent = "Mật khẩu phải có ít nhất 6 ký tự!";
        return;
    }
    if (password.length > 32) {
        errorDiv.textContent = "Mật khẩu không được vượt quá 32 ký tự!";
        return;
    }
    if (password.includes(' ')) {
        errorDiv.textContent = "Mật khẩu không được chứa khoảng trắng!";
        return;
    }
    
    // 4. Kiểm tra xác nhận mật khẩu
    if (!passwordConfirm) {
        errorDiv.textContent = "Vui lòng xác nhận mật khẩu!";
        return;
    }
    if (password !== passwordConfirm) {
        errorDiv.textContent = "Mật khẩu xác nhận không khớp!";
        return;
    }
    
    // 5. Kiểm tra checkbox chính sách
    if (!checkbox) {
        errorDiv.textContent = "Bạn phải đồng ý với chính sách trang web!";
        return;
    }
    
    // Lấy danh sách tài khoản
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    
    // Kiểm tra trùng lặp
    let existingUser = accounts.find(acc => acc.phone === phone);
    if (existingUser) {
        errorDiv.textContent = "Số điện thoại đã được đăng ký!";
        return;
    }
    
    // Tạo tài khoản mới
    let newUser = {
        fullname: fullname,
        phone: phone,
        password: password,
        address: '',
        email: '',
        status: 1,
        join: new Date(),
        cart: [],
        userType: 0 // User thường
    };
    
    accounts.push(newUser);
    localStorage.setItem("accounts", JSON.stringify(accounts));
    localStorage.setItem("currentuser", JSON.stringify(newUser));
    
    // Hiển thị thông báo thành công
    errorDiv.style.color = "#27ae60";
    errorDiv.style.background = "#e6ffe6";
    errorDiv.style.borderLeft = "3px solid #27ae60";
    errorDiv.textContent = "Đăng ký thành công! Đang chuyển hướng...";
    
    // Chuyển đến trang chủ sau 1 giây
    setTimeout(function() {
        window.location.href = "index.html";
    }, 1000);
});

// Thêm event listener để kiểm tra số điện thoại khi nhập
document.getElementById("signup-phone").addEventListener("input", function(e) {
    // Chỉ cho phép nhập số
    this.value = this.value.replace(/[^0-9]/g, '');
    // Giới hạn 10 số
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

document.getElementById("login-phone").addEventListener("input", function(e) {
    // Chỉ cho phép nhập số
    this.value = this.value.replace(/[^0-9]/g, '');
    // Giới hạn 10 số
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

// Xóa thông báo lỗi khi người dùng bắt đầu nhập
document.querySelectorAll('.form-control').forEach(function(input) {
    input.addEventListener("input", function() {
        let errorDiv = document.getElementById("login-error");
        errorDiv.textContent = "";
    });
});

// Kiểm tra khớp mật khẩu real-time
document.getElementById("signup-password-confirm").addEventListener("input", function() {
    let password = document.getElementById("signup-password").value;
    let confirmPassword = this.value;
    let errorDiv = document.getElementById("login-error");
    
    if (confirmPassword && password !== confirmPassword) {
        errorDiv.style.color = "#e74c3c";
        errorDiv.style.background = "#ffe6e6";
        errorDiv.style.borderLeft = "3px solid #e74c3c";
        errorDiv.textContent = "Mật khẩu xác nhận chưa khớp!";
    } else if (confirmPassword && password === confirmPassword) {
        errorDiv.style.color = "#27ae60";
        errorDiv.style.background = "#e6ffe6";
        errorDiv.style.borderLeft = "3px solid #27ae60";
        errorDiv.textContent = "Mật khẩu khớp!";
    } else {
        errorDiv.textContent = "";
    }
});