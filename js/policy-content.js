  const openPolicy = document.querySelector('.form-checkbox a');
  const policyModal = document.getElementById('policy-modal');
  const closePolicy = document.querySelector('.close-policy');

  openPolicy.addEventListener('click', function(e) {
    e.preventDefault();
    policyModal.style.display = 'block';
  });

  closePolicy.addEventListener('click', function() {
    policyModal.style.display = 'none';
  });

  window.addEventListener('click', function(e) {
    if (e.target === policyModal) {
      policyModal.style.display = 'none';
    }
  });