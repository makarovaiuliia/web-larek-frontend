import { ICard } from '../../types';
import { IEvents } from '../base/events';
import { Card } from '../common/card';

export class CardPreview extends Card {
	private descriptionElement: HTMLElement;
	private buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, card: ICard, events: IEvents) {
		super(container, card, events);

		this.descriptionElement = this.container.querySelector('.card__text')!;
		this.buttonElement = this.container.querySelector('.card__button')!;

		this.buttonElement.addEventListener('click', (event) => {
			if (this.buttonElement.textContent === 'Убрать из корзины') {
				this.buttonElement.textContent = 'В корзину';
				this.events.emit('card:remove', { ...this.card });
			} else {
				this.buttonElement.textContent = 'Убрать из корзины';
				this.events.emit('card:add', { ...this.card });
			}
		});
	}

	set description(description: string) {
		this.descriptionElement.textContent = description;
	}
}
