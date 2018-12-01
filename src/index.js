import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initState } from './state';
import { initControllers, initReload } from './controllers';
import initWatchers from './watchers';
import { renderForm } from './renderers';

const state = initState();
renderForm(state);
initControllers(state);
initWatchers(state);
initReload(state);
