import { IShoppingListItem } from '../../types';
import { ensureElement } from '../../utils/utils';
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
		this.indexElement = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this.titleElement = ensureElement<HTMLElement>(
			'.card__title',
			this.container
		);
		this.priceElement = ensureElement<HTMLElement>(
			'.card__price',
			this.container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);

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
