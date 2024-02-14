import { Presenter } from '../base/presenter';
import { IAppModel } from '../AppModel';
import { Modal } from '../common/modal';
import { ICard } from '../../types';
import { CardView } from '../view/cardView';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { CardPreview } from '../view/cardPreview';
// all elements
const cardContainer = ensureElement('.gallery');

// all templates
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardModal = ensureElement<HTMLTemplateElement>('#card-preview');

export class CardPresenter extends Presenter {
	constructor(model: IAppModel, events: IEvents, modal: Modal) {
		super(model, events, modal);
	}

	loadCards(): void {
		this._model.cardCatalog.forEach((card) => {
			const cardContentContainer = cloneTemplate(cardTemplate);
			const cardElement = new CardView(cardContentContainer, card, this._events);
			cardContainer.append(cardElement.render(card));
		});
	}

	handleOpenModal(cardInfo: ICard): void {
		const exists = this._model.ifExists(cardInfo.id);

		const cardPreview = new CardPreview(
			cloneTemplate(cardModal),
			cardInfo,
			this._events
		);

		if (exists) {
			cardPreview.button = 'Убрать из корзины';
		}

		this._modal.render({
			content: cardPreview.render(cardInfo),
		});
	}
}
