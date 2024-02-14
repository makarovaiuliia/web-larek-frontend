import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ProjectApi } from './components/ProjectApi';
import { AppModel } from './components/AppModel';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardPresenter } from './components/presenters/cardPresenter';
import { CardView } from './components/view/cardView';
import {
	ICard,
	IOrderData,
	IOrderForm,
	IShoppingListItem,
	ISuccessOrder,
} from './types';
import { Modal } from './components/common/modal';
import { ShoppingListView } from './components/view/shoppingListView';
import { ShoppingListPresenter } from './components/presenters/shoppingLIstPresenter';
import { OrderPresenter } from './components/presenters/orderPresenter';
import { OrderForm } from './components/view/orderForm';
import { ContactsForm } from './components/view/contacsForm';
import { SuccessModal } from './components/view/successModal';

// all templates
const shoppingListTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

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
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(
	cloneTemplate(contactsFormTemplate),
	events
);
const successModal = new SuccessModal(cloneTemplate(successTemplate), events);

// presenters
const cardPresenter = new CardPresenter(appModel, events, modal);
const shoppingListPresenter = new ShoppingListPresenter(
	appModel,
	events,
	modal,
	shoppingList
);
const orderPresenter = new OrderPresenter(
	appModel,
	events,
	modal,
	orderForm,
	contactsForm,
	successModal
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
	orderPresenter.handleOpenOrderForm();
});

events.on('order:submit', () => {
	orderPresenter.handleOpenContactsForm();
});

events.on('contacts:submit', () => {
	orderPresenter.handleSendOrderDetails();
});

events.on(
	/^(order|contacts)\..*:change$/,
	(data: { field: keyof IOrderData; value: string }) => {
		console.log(data);
		orderPresenter.handleChangeInput(data);
	}
);

events.on('formErrors:change', (errors: Partial<IOrderData>) => {
	orderPresenter.handleErrors(errors);
});

events.on('order:done', () => {
	orderPresenter.handleOrderFinish();
	shoppingListPresenter.handleUpdateView();
});
