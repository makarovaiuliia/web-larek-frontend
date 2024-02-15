import { IShoppingListItem } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class ShoppingListItemView extends Component<IShoppingListItem> {
	events: IEvents;
	private indexElement: HTMLElement;
	private titleElement: HTMLElement;
	private priceElement: HTMLElement;
	private buttonElement: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		events: IEvents,
		card: IShoppingListItem
	) {
		super(container);
		this.events = events;
		this.indexElement = this.container.querySelector('.basket__item-index');
		this.titleElement = this.container.querySelector('.card__title');
		this.priceElement = this.container.querySelector('.card__price');
		this.buttonElement = this.container.querySelector('.basket__item-delete ');

		this.buttonElement.addEventListener('click', () => {
			events.emit('card:remove', { ...card });
		});
	}

	set title(title: string) {
		this.titleElement.textContent = title;
	}

	set index(index: number) {
		this.indexElement.textContent = index.toString();
	}

	set price(price: number) {
		if (price) {
			this.priceElement.textContent = price.toString() + ' синапсов';
		} else {
			this.priceElement.textContent = 'бесценно';
		}
	}
}
