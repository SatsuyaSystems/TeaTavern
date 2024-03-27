function loadOrder(event) {

    const orderData = JSON.parse(event.currentTarget.getAttribute('data-order'));
    const orderCode = orderData['code']
    $('#order-id').val(orderCode);
    $('#order-info').val(orderData['info']);
    $('#order-payed').val(orderData['payed']);
    $('#order-shipped').val(orderData['shipped']);
}



function copyText(event) {
    let copyText = event.currentTarget;
    copyText.classList.toggle('rainbow_text_animated');

    let copyTextValue = copyText.getAttribute('title');

    // Create a temporary input field
    let tempInput = document.createElement('input');
    tempInput.setAttribute('style', 'display: none;')
    tempInput.value = copyTextValue;
    document.body.appendChild(tempInput);
    tempInput.select();
    navigator.clipboard.writeText(tempInput.value);
    tempInput.remove();

    setTimeout(() => {
        copyText.classList.toggle('rainbow_text_animated');
    }, 1000);
}


function adjustContainer() {
    const container = document.getElementById('responsive-container');
    if (window.innerWidth < 992) { // Use 992px as the lg breakpoint
      container.classList.remove('container');
      container.classList.add('container-fluid');
    } else {
      container.classList.add('container');
      container.classList.remove('container-fluid');
    }
  }
  
// Adjust on load and resize
window.addEventListener('load', adjustContainer);
window.addEventListener('resize', adjustContainer);