import { Presenter } from '../base/presenter';
import { IAppModel } from '../AppModel';
import { IModal, IModalData, Modal } from '../common/modal';
import { Component } from '../base/component';
import { ICard, IShoppingListItem } from '../../types';
import { CardView } from '../view/cardView';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { CardPreview } from '../view/cardPreview';
// all elements
const cardContainer = ensureElement('.gallery');

// all templates
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardModal = ensureElement<HTMLTemplateElement>('#card-preview');

export class CardPresenter extends Presenter<IAppModel, IEvents, Modal> {
	events: IEvents;
	modal: Modal;

	constructor(model: IAppModel, events: IEvents, modal: Modal) {
		super(model);
		this.events = events;
		this.modal = modal;
		this.initialize();
	}

	initialize(): void {}

	loadCards(): void {
		this.model.cardCatalog.forEach((card) => {
			const cardContentContainer = cloneTemplate(cardTemplate);
			const cardElement = new CardView(cardContentContainer, card, this.events);
			cardContainer.append(cardElement.render(card));
		});
	}

	handleAddToShoppingList(item: ICard): void {
		
	}

	handleRemoveFromShoppingList(id: string): void {}

	handleOpenModal(cardInfo: ICard): void {
		this.model.openedCard = cardInfo;
		const cardModalContainer = cloneTemplate(cardModal);
		const cardPreview = new CardPreview(
			cardModalContainer,
			cardInfo,
			this.events
		);
		this.modal.render({
			content: cardPreview.render(cardInfo),
		});
	}
}
