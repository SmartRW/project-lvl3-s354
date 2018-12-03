import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initState } from './state';
import { initControllers, initReload, initPopularControllers } from './controllers';
import initWatchers from './watchers';
import { renderForm, renderPopular } from './renderers';

const state = initState();
renderPopular(state);
renderForm(state);
initControllers(state);
initPopularControllers(state);
initWatchers(state);
initReload(state);
