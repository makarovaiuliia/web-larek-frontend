import { ICard, IShoppingListItem } from '../../types';
import { IEvents } from '../base/events';
import { Card } from '../common/card';
import { ButtonState } from '../../types';

export class CardPreview extends Card {
	private descriptionElement: HTMLElement;
	private buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, card: ICard, events: IEvents) {
		super(container, card, events);

		this.descriptionElement = this.container.querySelector('.card__text')!;
		this.buttonElement = this.container.querySelector('.card__button')!;

		this.buttonElement.addEventListener('click', (event) => {
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
	}

	set button(buttonText: ButtonState) {
		this.buttonElement.textContent = buttonText;
	}

	set description(description: string) {
		this.descriptionElement.textContent = description;
	}
}
