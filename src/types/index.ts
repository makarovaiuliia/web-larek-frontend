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

export type PaymentMethod = 'card' | 'cash';

export interface IFormState {
	valid: boolean;
	errors: string[];
}
export interface IContactsForm extends IFormState {
	email: string;
	phone: string;
	render: (state: Partial<IContactsForm> & IFormState) => HTMLElement;
}

export interface IOrderForm extends IFormState {
	payment: PaymentMethod;
	address: string;
	render: (state: Partial<IOrderForm> & IFormState) => HTMLElement;
}

export interface IOrderItems {
	total: number;
	items: string[];
}

export interface IOrderData extends IOrderItems {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;
export type ButtonState = 'В корзину' | 'Убрать из корзины';

/* Интерфейс удачного оформления заказа */

export interface ISuccessOrder {
	total: number;
	id: string;
}

export type CategoryKey =
	| 'софт-скил'
	| 'другое'
	| 'кнопка'
	| 'дополнительное'
	| 'хард-скил';

// The Category object with explicit type
export const Category: { [key in CategoryKey]: string } = {
	'софт-скил': 'soft',
	другое: 'other',
	кнопка: 'button',
	дополнительное: 'additional',
	'хард-скил': 'hard',
};
