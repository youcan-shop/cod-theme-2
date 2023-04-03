const closeCartDrawerBtn = document.querySelectorAll('.close-cart-drawer-btn')

async function setupCartDrawer() {
  const cartDrawerContentEl = document.querySelector('.cart-drawer .content')
  const cartDrawerTotalEl = document.querySelector('.cart-drawer .total')

  /**
   * Basing on the cartDrawerTotalEl content and replacing only the number and keeping the currency symbol
   * @param {Number} price
   */
  function money(price) {
    return cartDrawerTotalEl.innerHTML.replace(/(\d+\.?\d*)/, price)
  }

  /**
   * Return a product variant HTML string
   * @param {cartItem} - the cart item
   * @returns {string} - HTML content
   */
  function createCartItemHtml(cartItem) {
    const { productVariant, quantity } = cartItem

    if (productVariant) {
      return `
        <div class="cart-item">
          <div class="image">
            <img src="${productVariant.image.url || productVariant.product.images[0].url}" />
          </div>
          <div class="info">
            <div class="title">${productVariant.product.name || ''}</div>
            <div class="quantity">${CART_DRAWER_LOCALES.quantity}: ${quantity || 0}</div>
            <div class="variants">
              ${Object.keys(productVariant.variations)
                      .map(key => `<div>${key}: ${productVariant.variations[key]}</div>`)
                      .join('')}
            </div>
          </div>
          <div class="price">${money(productVariant.price * quantity)}</div>
        </div>
      `
    }

    return ''
  }

  try {
    const cartObject = await youcanjs.cart.fetch()
    const cartItems = cartObject.items

    if (!cartItems || cartItems.data) return

    cartDrawerContentEl.innerHTML = cartItems.map(createCartItemHtml).join('')
    cartDrawerTotalEl.innerHTML = money(cartObject.total)
  } catch (error) {
    console.error(error)
  }
}

closeCartDrawerBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    const overlay = document.querySelector('.global-overlay')

    if (overlay) overlay.click()
  })
})

document.addEventListener('DOMContentLoaded', () => {
  setupCartDrawer()
})
