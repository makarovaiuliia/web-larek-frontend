import { ShoppingListItemView } from './shoppingListItemView';
import { IShoppingListItem } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

//all templates
const shoppingListItemTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');

export interface IShoppingListView {
	updateView(shoppingListItems: IShoppingListItem[]): void;
	render(data?: Partial<IShoppingListItem[]>): HTMLElement;
}

export class ShoppingListView
	extends Component<IShoppingListItem[]>
	implements IShoppingListView
{
	private events: IEvents;
	private listElement: HTMLElement;
	private totalSumElement: HTMLElement;
	private buttonElement: HTMLButtonElement;
	private counterElement: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.listElement = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.totalSumElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this.counterElement = ensureElement<HTMLElement>('.header__basket-counter');

		this.buttonElement.addEventListener('click', () => {
			events.emit('order:start');
		});
	}

	updateView(shoppingListItems: IShoppingListItem[]) {
		this.listElement.innerHTML = null;
		if (shoppingListItems.length === 0) {
			this.toggleButton(true);
		} else {
			this.toggleButton(false);
			shoppingListItems.forEach((item: IShoppingListItem, index: number) => {
				const itemSL = new ShoppingListItemView(
					cloneTemplate(shoppingListItemTemplate),
					this.events,
					item
				);
				itemSL.index = index + 1;
				this.listElement.appendChild(itemSL.render(item));
			});
		}
		this.updateTotalSum(shoppingListItems);
		this.counterElement.textContent = shoppingListItems.length.toString();
	}

	protected updateTotalSum(shoppingListItems: IShoppingListItem[]) {
		let totalSum = 0;
		for (let i = 0; i < shoppingListItems.length; i++) {
			if (shoppingListItems[i].price) {
				totalSum += shoppingListItems[i].price;
			}
		}
		this.totalSumElement.textContent = `${totalSum.toString()} синапсов`;
	}

	protected toggleButton(empty: boolean) {
		if (empty) {
			this.buttonElement.setAttribute('disabled', '');
		} else {
			this.buttonElement.removeAttribute('disabled');
		}
	}
}
