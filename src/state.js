export const inputStates = {
  pending: 'pending',
  valid: 'valid',
  invalid: 'invalid',
  loading: 'loading',
  failed: 'failed',
};

function State() {
  this.inputStates = inputStates;
  this.input = { state: this.inputStates.pending };
  this.message = 'Add RSS feed URL';
  this.feeds = [];
  this.modal = {
    title: '',
    content: '',
  };
}

export const initState = () => new State();
