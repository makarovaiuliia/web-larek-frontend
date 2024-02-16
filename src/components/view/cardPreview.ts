import { ICard, IShoppingListItem } from '../../types';
import { IEvents } from '../base/events';
import { Card } from '../common/card';
import { ButtonState } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card {
	private descriptionElement: HTMLElement;
	private buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, card: ICard, events: IEvents) {
		super(container, card, events);

		this.descriptionElement = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);

		this.buttonElement.addEventListener('click', () => {
			const data: IShoppingListItem = {
				id: card.id,
				title: card.title,
				price: card.price,
			};

			if (this.buttonElement.textContent === 'Убрать из корзины') {
				this.buttonElement.textContent = 'В корзину';

				this.events.emit('card:remove', { ...data });
			} else {
				this.buttonElement.textContent = 'Убрать из корзины';
				this.events.emit('card:add', { ...data });
			}
		});

		if (!this.card.price) {
			this.buttonElement.setAttribute('disabled', '');
		}
	}

	set button(buttonText: ButtonState) {
		this.buttonElement.textContent = buttonText;
	}

	set description(description: string) {
		this.descriptionElement.textContent = description;
	}
}
