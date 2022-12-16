async function addToCart() {
  const variantId = document.getElementById('variantId')?.value || undefined;
  const quantity = document.getElementById('quantity')?.value || 1;
  const uploadedImageLink = document.querySelector('#yc-upload-link')?.value || undefined;

  try {
    load('#loading__checkout');

    const response = await youcanjs.cart.addItem({
      productVariantId: variantId,
      attachedImage: uploadedImageLink,
      quantity,
    });

    if (response.error) throw new Error(response.error);

    const cart = document.querySelector('#cart-items-badge');

    if (cart) {
      let cartBadgeBudge = Number(cart.innerHTML);

      cart.innerHTML = ++cartBadgeBudge;
    }

    stopLoad('#loading__checkout');
    notify('Item has been added successfully', 'success');
  } catch (err) {
    stopLoad('#loading__checkout');
    notify(err.message, 'error');
  }
}