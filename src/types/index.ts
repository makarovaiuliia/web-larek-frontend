/* Интерфейс хранения данных карточки, которую приложение получает из сервера
и на основе которой заполняются карточки в HTML через слой View */

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

/* Интерфейс элемента корзины покупок. Включает в себя id и price. Id - для
отправки данных заказа на сервер, а price - чтобы посчитать итоговую сумму заказа */

export interface IShoppingListItem {
	id: string;
	price: number;
	title: string;
}

/* Интерфейс хранения данных заказа */

type PaymentMethod = 'онлайн' | 'при получении';

interface IOrderForm {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
}

interface IOrderItems {
	total: number;
	items: string[];
}

export interface IOrderData extends IOrderForm, IOrderItems {
}

/* Интерфейс удачного оформления заказа */

export interface ISuccessOrder {
  total: number;
  id: string;
}

export type ButtonState = 'В корзину' | 'Убрать из корзины';
