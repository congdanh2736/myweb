// Popup Liên hệ - JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const contactForm = document.querySelector('.fillin');
    const submitButton = document.getElementById('contact-submit-button');

    if (contactForm && submitButton) {
        // Form validation rules
        const validationRules = {
            namecontact: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: {
                    required: 'Vui lòng nhập họ và tên',
                    minLength: 'Họ và tên phải có ít nhất 2 ký tự',
                    pattern: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
                }
            },
            phonecontact: {
                required: true,
                pattern: /^0[0-9]{9}$/,
                message: {
                    required: 'Vui lòng nhập số điện thoại',
                    pattern: 'Số điện thoại phải có 10 số và bắt đầu bằng 0'
                }
            },
            emailcontact: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: {
                    required: 'Vui lòng nhập email',
                    pattern: 'Email không hợp lệ'
                }
            },
            messagecontact: {
                required: true,
                minLength: 10,
                message: {
                    required: 'Vui lòng nhập nội dung',
                    minLength: 'Nội dung phải có ít nhất 10 ký tự'
                }
            }
        };

        // Validate single field
        function validateField(fieldName, value) {
            const rules = validationRules[fieldName];
            const fieldElement = document.querySelector(`[name="${fieldName}"]`).closest('.dienvao');

            // Remove previous validation classes
            fieldElement.classList.remove('error', 'success');

            if (rules.required && (!value || value.trim() === '')) {
                fieldElement.classList.add('error');
                showFieldMessage(fieldElement, rules.message.required);
                return false;
            }

            if (value && rules.minLength && value.length < rules.minLength) {
                fieldElement.classList.add('error');
                showFieldMessage(fieldElement, rules.message.minLength);
                return false;
            }

            if (value && rules.pattern && !rules.pattern.test(value)) {
                fieldElement.classList.add('error');
                showFieldMessage(fieldElement, rules.message.pattern);
                return false;
            }

            // Xóa thông báo lỗi nếu input hợp lệ, nhưng không thêm class success
            if (value) {
                hideFieldMessage(fieldElement);
            }

            return true;
        }

        // Show field validation message
        function showFieldMessage(fieldElement, message) {
            let messageElement = fieldElement.querySelector('.form-message');
            if (!messageElement) {
                messageElement = document.createElement('div');
                messageElement.className = 'form-message';
                fieldElement.appendChild(messageElement);
            }
            messageElement.textContent = message;
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }

        // Hide field validation message
        function hideFieldMessage(fieldElement) {
            const messageElement = fieldElement.querySelector('.form-message');
            if (messageElement) {
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateY(-10px)';
            }
        }

        // Validate entire form
        function validateForm() {
            let isValid = true;
            Object.keys(validationRules).forEach(fieldName => {
                const value = document.querySelector(`[name="${fieldName}"]`).value;
                if (!validateField(fieldName, value)) {
                    isValid = false;
                }
            });
            return isValid;
        }

        // Real-time validation
        Object.keys(validationRules).forEach(fieldName => {
            const input = document.querySelector(`[name="${fieldName}"]`);
            if (input) {
                input.addEventListener('blur', function() {
                    validateField(fieldName, this.value);
                });

                input.addEventListener('input', function() {
                    if (this.closest('.dienvao').classList.contains('error')) {
                        validateField(fieldName, this.value);
                    }
                });
            }
        });

        // Form submission
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (validateForm()) {
                // Show loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
                this.disabled = true;

                // Simulate form submission (replace with actual submission logic)
                setTimeout(() => {
                    // Lưu feedback vào localStorage
                    const feedback = {
                        id: Date.now().toString(),
                        name: document.querySelector('[name="namecontact"]').value,
                        phone: document.querySelector('[name="phonecontact"]').value,
                        email: document.querySelector('[name="emailcontact"]').value,
                        message: document.querySelector('[name="messagecontact"]').value,
                        timestamp: new Date().toISOString(),
                        status: 'unread' // unread, read
                    };

                    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
                    feedbacks.push(feedback);
                    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

                    // Show success message
                    showToast('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');

                    // Reset form
                    contactForm.reset();

                    // Clear validation states
                    document.querySelectorAll('.dienvao').forEach(field => {
                        field.classList.remove('error', 'success');
                        hideFieldMessage(field);
                    });

                    // Reset button
                    this.innerHTML = originalText;
                    this.disabled = false;

                    // Đóng popup ngay lập tức
                    hideLienHe();
                }, 1500); // Giảm thời gian chờ xuống 1.5 giây
            } else {
                showToast('Vui lòng kiểm tra lại thông tin đã nhập!', 'error');
            }
        });
    }

    // Toast notification function (assuming toast-message.js exists)
    function showToast(message, type = 'info') {
        // If toast function exists, use it
        if (typeof toast === 'function') {
            toast({ message, type });
        } else {
            // Fallback: create simple alert
            alert(message);
        }
    }
});

// Popup functions (defined globally for onclick handlers)
function lienhe() {
    const popup = document.getElementById('lienhe');
    if (popup) {
        popup.style.display = 'flex';
        popup.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Điền sẵn thông tin người dùng nếu đã đăng nhập
        const currentUser = JSON.parse(localStorage.getItem('currentuser'));
        if (currentUser) {
            const nameInput = document.getElementById('namecontact');
            const phoneInput = document.getElementById('phonecontact');
            const emailInput = document.getElementById('emailcontact');

            if (nameInput && currentUser.fullname) {
                nameInput.value = currentUser.fullname;
            }
            if (phoneInput && currentUser.phone) {
                phoneInput.value = currentUser.phone;
            }
            if (emailInput && currentUser.email) {
                emailInput.value = currentUser.email;
            }
        }
    }
}

function hideLienHe() {
    const popup = document.getElementById('lienhe');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300); // Match animation duration
        document.body.style.overflow = 'auto';
    }
}

// Close popup when clicking outside
document.addEventListener('click', function(e) {
    const lienhePopup = document.getElementById('lienhe');
    const lienheBox = document.querySelector('.lienhe-box');

    if (e.target === lienhePopup) {
        hideLienHe();
    }
});

// Close popup on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideLienHe();
    }
});