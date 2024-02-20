async function placeOrder() {
  const expressCheckoutForm = document.querySelector('#express-checkout-form');
  let fields = Object.fromEntries(new FormData(expressCheckoutForm));

  load('#loading__checkout');
  try {
    const productVariantId = document.getElementById('variantId')?.value;
    const quantity = document.getElementById('quantity')?.value || 1;
    const attachedImage = document.querySelector('#yc-upload-link')?.value;

    if (attachedImage) {
      fields = { ...fields, attachedImage };
    }

    const response = await youcanjs.checkout.placeExpressCheckoutOrder({ productVariantId, quantity, fields });

    response
      .onSuccess((data, redirectToThankyouPage) => {
        redirectToThankyouPage();
      })
      .onValidationErr((err) => {
        displayValidationErrors(err);
      })
      .onSkipShippingStep((data, redirectToShippingPage) => {
        redirectToShippingPage();
      })
      .onSkipPaymentStep((data, redirectToPaymentPage) => {
        redirectToPaymentPage();
      });
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad('#loading__checkout');
  }
}

function displayValidationErrors(err) {
  const form = document.querySelector('#express-checkout-form');
  const errorDetails = err.meta.fields;

  if (!form || !Object.keys(errorDetails).length) return;

  form.querySelectorAll('.validation-error').forEach(el => {
    el.textContent = '';
    el.previousElementSibling?.classList.remove('error');
  });

  const setError = (inputName, message) => {
    const input = form.querySelector(`[name="${inputName}"]`);
    const errorEl = form.querySelector(`.validation-error[data-error-for="${inputName}"]`);

    if (input && errorEl) {
      input.classList.add('error');
      errorEl.textContent = message;
      return true;
    }
    return false;
  };

  Object.entries(errorDetails).forEach(([field, messages]) => {
    let inputName = `extra_fields[${field}]`;
    if (!setError(inputName, messages[0])) {
      if (field.startsWith('extra_fields.')) {
        inputName = field.replace('extra_fields.', 'extra_fields[') + ']';
        if (!setError(inputName, messages[0])) {
          notify(`Error element not found for field: ${field}`, 'error');
        }
      } else {
        notify(`Error element not found for field: ${field}`, 'error');
      }
    }
  });
}

function normalizeFieldName(field) {
  return field.includes('extra_fields')
    ? field.replace('extra_fields.', 'extra_fields[') + ']'
    : field;
}

function clearError(input, errorEl) {
  input.classList.remove('error');
  if (errorEl) errorEl.textContent = '';
}

function scrollToFirstError(form) {
  const firstError = form.querySelector('.error');
  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
