import { IProjectApi } from './ProjectApi';
import { ICard, IOrderData, IShoppingListItem, ISuccessOrder } from '../types';
import { IEvents } from './base/events';

/* Интерфейс хранения данных всего приложения, включает в себя каталог
 всех карточек, массив добавленных в корзину товаров и данные заказа */

export interface IAppModel {
	projectAPI: IProjectApi;
	cardCatalog: ICard[];
	shoppingList: IShoppingListItem[];
	order: IOrderData | null;
	openedCard: IShoppingListItem | null;
	events: IEvents;
}

export class AppModel implements IAppModel {
	// TODO: уточнить что тут protected
	projectAPI: IProjectApi;
	cardCatalog: ICard[] = [];
	shoppingList: IShoppingListItem[] = [];
	order: IOrderData | null = null;
	openedCard: IShoppingListItem | null = null;
	events: IEvents;

	constructor(projectApi: IProjectApi, events: IEvents) {
		this.projectAPI = projectApi;
		this.events = events;
		this.initialize();
	}

	private initialize() {
		this.fetchCards()
			.then((cards) => {
				this.cardCatalog = cards;
				this.events.emit('cards:fetched', cards);
			})
			.catch((error) => {
				console.error('Failed to fetch cards:', error);
			});

		this.getShoppingList();
	}

	private fetchCards(): Promise<ICard[]> {
		return this.projectAPI.getCardList();
	}

	private getShoppingList(): void {
		const shoppingList = localStorage.getItem('shoppingList');
		if (shoppingList) {
			this.shoppingList = JSON.parse(shoppingList);
		}
		this.shoppingList = [];
		this.events.emit('shoppingList:fetched');
	}

	public addToShoppingList(item: IShoppingListItem): void {
		this.shoppingList.push(item);
		localStorage.setItem('shoppingList', JSON.stringify(this.shoppingList));
	}

	public removeFromShoppingList(itemId: string): void {
		this.shoppingList.filter((item) => item.id !== itemId);
		localStorage.setItem('shoppingList', JSON.stringify(this.shoppingList));
	}

	public placeOrder(orderData: IOrderData): Promise<ISuccessOrder> {
		return this.projectAPI
			.postOrder(orderData)
			.then((data: ISuccessOrder) => data);
	}

	public emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}
