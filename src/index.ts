import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
// const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// const gallery = ensureElement<HTMLElement>('.gallery');

const apiProject = new Api(API_URL);

apiProject.get('/product').then((result) => {
	console.log(result);
});
