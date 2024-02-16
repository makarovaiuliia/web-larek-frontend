import { Category, ICard, CategoryKey } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

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
		this._titleElement = ensureElement<HTMLElement>(
			'.card__title',
			this.container
		);
		this._imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		this._priceElement = ensureElement<HTMLElement>(
			'.card__price',
			this.container
		);
	}

	set title(title: string) {
		this._titleElement.textContent = title;
	}

	set image(src: string) {
		this._imageElement.src = src;
		this._imageElement.alt = this.card.title;
	}

	set category(category: CategoryKey) {
		this._categoryElement.textContent = category;
		this._categoryElement.classList.add(`card__category_${Category[category]}`);
	}

	set price(price: number) {
		if (price) {
			this._priceElement.textContent = `${price} синапсов`;
		} else {
			this._priceElement.textContent = 'бесценно';
		}
	}
}
