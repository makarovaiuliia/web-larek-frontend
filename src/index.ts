import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ProjectApi } from './components/ProjectApi';
import { AppModel } from './components/AppModel';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardPresenter } from './components/presenters/cardPresenter';
import { CardView } from './components/view/cardView';
import { ICard, IShoppingListItem } from './types';
import { Modal } from './components/common/modal';
import { ShoppingListView } from './components/view/shoppingListView';
import { ShoppingListPresenter } from './components/presenters/shoppingLIstPresenter';

// all templates
const shoppingListTemplate = ensureElement<HTMLTemplateElement>('#basket');

// all elements
const modalWindow = ensureElement<HTMLElement>('#modal-container');
const page = ensureElement<HTMLElement>('.page__wrapper');
const shoppingListButton = ensureElement<HTMLButtonElement>('.header__basket');

// base project elements
const events = new EventEmitter();
const projectApi = new ProjectApi(CDN_URL, API_URL);
const appModel = new AppModel(projectApi, events);

//common elements
const modal = new Modal(modalWindow, events);
const shoppingList = new ShoppingListView(
	cloneTemplate(shoppingListTemplate),
	events
);

// presenters
const cardPresenter = new CardPresenter(appModel, events, modal);
const shoppingListPresenter = new ShoppingListPresenter(
	appModel,
	events,
	modal,
	shoppingList
);

// events

events.on('cards:fetched', () => {
	cardPresenter.loadCards();
});

events.on('card:select', (data: ICard) => {
	cardPresenter.handleOpenModal(data);
});

events.on('card:add', (data: IShoppingListItem) => {
	shoppingListPresenter.handleAddToShoppingList(data);
});

events.on('card:remove', (data: IShoppingListItem) => {
	shoppingListPresenter.handleRemoveFromShoppingList(data.id);
});

events.on('modal:open', () => {
	page.classList.add('page__wrapper_locked');
});

events.on('modal:close', () => {
	page.classList.remove('page__wrapper_locked');
});

shoppingListButton.addEventListener('click', () => {
	shoppingListPresenter.handleOpenModal();
});

events.on('order:start', () => {
	console.log('i did it')
});
