function loadOrder(event) {

    const orderData = JSON.parse(event.currentTarget.getAttribute('data-order'));
    const orderCode = orderData['code']
    $('#order-id').val(orderCode);

}