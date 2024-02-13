import { ICard } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class Card extends Component<ICard> {
	private titleElement: HTMLElement;
	private imageElement: HTMLImageElement;
	private categoryElement: HTMLElement;
	private priceElement: HTMLElement;
	public card: ICard;
	events: IEvents;

	constructor(container: HTMLElement, card: ICard, events: IEvents) {
		super(container);
		this.card = card;
		this.events = events;
		this.titleElement = this.container.querySelector('.card__title')!;
		this.imageElement = this.container.querySelector('.card__image')!;
		this.categoryElement = this.container.querySelector('.card__category')!;
		this.priceElement = this.container.querySelector('.card__price')!;
	}

	set title(title: string) {
		this.titleElement.textContent = title;
	}

	set image(src: string) {
		this.imageElement.src = src;
		this.imageElement.alt = this.card.title;
	}

	set category(category: string) {
		this.categoryElement.textContent = category;
	}

	set price(price: number) {
		if (price) {
			this.priceElement.textContent = price.toString() + ' синапсов';
		} else {
			this.priceElement.textContent = 'бесценно';
		}
	}
}
