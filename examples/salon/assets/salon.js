document.querySelectorAll('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.querySelector('[data-form-status]').textContent = 'Это демонстрационная форма: заявка не отправлена. Не вводите реальные контакты.';
  });
});
