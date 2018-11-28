const input = document.getElementById('rss-url');
const submit = document.getElementById('submit-button');

export default (state) => {
  switch (state.urlInput.valid) {
    case true:
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      break;
    case false:
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      break;
    default:
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
      input.value = '';
      break;
  }
  switch (state.urlInput.submitEnabled) {
    case true:
      submit.disabled = false;
      break;
    case false:
      submit.disabled = true;
      break;
    default:
      submit.disabled = false;
  }
};
