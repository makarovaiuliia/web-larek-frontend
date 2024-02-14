import { ICard } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class Card extends Component<ICard> {
	protected _titleElement: HTMLElement;
	protected _imageElement: HTMLImageElement;
	protected _categoryElement: HTMLElement;
	protected _priceElement: HTMLElement;
	public card: ICard;
	events: IEvents;

	constructor(container: HTMLElement, card: ICard, events: IEvents) {
		super(container);
		this.card = card;
		this.events = events;
		this._titleElement = this.container.querySelector('.card__title')!;
		this._imageElement = this.container.querySelector('.card__image')!;
		this._categoryElement = this.container.querySelector('.card__category')!;
		this._priceElement = this.container.querySelector('.card__price')!;
	}

	set title(title: string) {
		this._titleElement.textContent = title;
	}

	set image(src: string) {
		this._imageElement.src = src;
		this._imageElement.alt = this.card.title;
	}

	set category(category: string) {
		this._categoryElement.textContent = category;
	}

	set price(price: number) {
		if (price) {
			this._priceElement.textContent = price.toString() + ' синапсов';
		} else {
			this._priceElement.textContent = 'бесценно';
		}
	}
}
