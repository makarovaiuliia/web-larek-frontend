import {
	IContactsForm,
	IOrderData,
	IOrderForm,
	FormErrors,
	ISuccessOrder,
} from '../../types';
import { IAppModel } from '../AppModel';
import { IEvents } from '../base/events';
import { Presenter } from '../base/presenter';
import { Modal } from '../common/modal';
import { SuccessModal } from '../view/successModal';

export class OrderPresenter extends Presenter<
	IOrderForm,
	IContactsForm,
	SuccessModal
> {
	private orderDetails: IOrderData;
	private formErrors: FormErrors = {};

	constructor(
		model: IAppModel,
		events: IEvents,
		modal: Modal,
		orderForm: IOrderForm,
		contactsForm: IContactsForm,
		successModal: SuccessModal
	) {
		super(model, events, modal, orderForm, contactsForm, successModal);
	}

	handleOpenOrderForm() {
		if (this._model.shoppingList.length > 0) {
			this.orderDetails = {
				payment: '',
				address: '',
				email: '',
				phone: '',
				total: this._model.shoppingList.reduce(
					(sum, item) => sum + item.price,
					0
				),
				items: this._model.shoppingList.map((item) => item.id),
			};
			this._modal.render({
				content: this._view.render({
					address: '',
					payment: '',
					valid: false,
					errors: [],
				}),
			});
		}
	}

	handleOpenContactsForm() {
		this._modal.render({
			content: this._view2.render({
				email: '',
				phone: '',
				valid: false,
				errors: [],
			}),
		});
	}

	handleChangeInput(data: { field: keyof IOrderData; value: string }) {
		this.setOrderField(data.field, data.value);
	}

	setOrderField<K extends keyof IOrderData>(
		field: K,
		value: IOrderData[K] | string
	) {
		if (typeof value === 'string') {
			this.orderDetails[field] = value as IOrderData[K];
		}
		this.validateOrder();
		console.log(this.orderDetails);
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.orderDetails.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.orderDetails.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.orderDetails.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.orderDetails.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this._events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	handleErrors(errors: Partial<IOrderData>) {
		const { email, phone, payment, address } = errors;
		this._view.valid = !address;
		this._view2.valid = !email && !phone;
		this._view.errors = Object.values({ address, payment });
		this._view2.errors = Object.values({ email, phone });
	}

	handleSendOrderDetails() {
		this._model.placeOrder(this.orderDetails).then((data: ISuccessOrder) => {
			this._events.emit('form:submit', { data });
			this._modal.render({
				content: this._view3.render({ ...data }),
			});
		});
	}

	handleOrderFinish() {
		this._modal.close();
		this._model.clearShoppingList();
		this.orderDetails = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: this._model.shoppingList.reduce((sum, item) => sum + item.price, 0),
			items: this._model.shoppingList.map((item) => item.id),
		};
	}
}
