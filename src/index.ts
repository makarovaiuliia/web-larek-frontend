import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ProjectApi } from './components/ProjectApi';
import { AppModel } from './components/AppModel';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardPresenter } from './components/presenters/cardPresenter';
import { CardView } from './components/view/cardView';
import { ICard } from './types';
import { Modal } from './components/common/modal';

// all templates

// all elements
const modalWindow = ensureElement<HTMLElement>('#modal-container');
const page = ensureElement<HTMLElement>('.page__wrapper');


// base project elements
const events = new EventEmitter();
const projectApi = new ProjectApi(CDN_URL, API_URL);
const appModel = new AppModel(projectApi, events);

//common elements
const modal = new Modal(modalWindow, events);

// presenters
const cardPresenter = new CardPresenter(appModel, events, modal);

// events

events.on('cards:fetched', () => {
	cardPresenter.loadCards();
});

events.on('shoppingList:fetched', () => {
	// update view of shopping list through shopping list presenter
})

events.on('card:select', (data: ICard) => {
	cardPresenter.handleOpenModal(data);
});

events.on('card:add', (data: ICard) => {
	console.log(data);
	// cardPresenter.handleAddToShoppingList(data);
})

events.on('card:remove', (data: ICard) => {
	console.log(data);
	// cardPresenter.handleAddToShoppingList(data);
});

events.on('modal:open', () => {
	page.classList.add('page__wrapper_locked');
});

events.on('modal:close', () => {
	page.classList.remove('page__wrapper_locked');
});
