import { IShoppingListItem } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ShoppingListItemView } from './shoppingLIstItemView';

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

		this.listElement = this.container.querySelector('.basket__list');
		this.totalSumElement = this.container.querySelector('.basket__price');
		this.buttonElement = this.container.querySelector('.basket__button');
		this.counterElement = ensureElement<HTMLElement>('.header__basket-counter');

		this.buttonElement.addEventListener('click', () => {
			events.emit('order:start');
		});
	}

	updateView(shoppingListItems: IShoppingListItem[]) {
		this.listElement.innerHTML = null;
		shoppingListItems.forEach((item: IShoppingListItem, index: number) => {
			const itemSL = new ShoppingListItemView(
				cloneTemplate(shoppingListItemTemplate),
				this.events,
				item
			);
			itemSL.index = index + 1;
			this.listElement.appendChild(itemSL.render(item));
		});
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
}
