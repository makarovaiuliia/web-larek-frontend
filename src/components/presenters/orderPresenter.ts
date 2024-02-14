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
	orderDetails: IOrderData;
	formErrors: FormErrors = {};

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
		if (this.model.shoppingList.length > 0) {
			this.orderDetails = {
				payment: '',
				address: '',
				email: '',
				phone: '',
				total: this.model.shoppingList.reduce(
					(sum, item) => sum + item.price,
					0
				),
				items: this.model.shoppingList.map((item) => item.id),
			};
			this.modal.render({
				content: this.view.render({
					address: '',
					payment: '',
					valid: false,
					errors: [],
				}),
			});
		}
	}

	handleOpenContactsForm() {
		this.modal.render({
			content: this.view2.render({
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
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	handleErrors(errors: Partial<IOrderData>) {
		const { email, phone, payment, address } = errors;
		this.view.valid = !address;
		this.view2.valid = !email && !phone;
		this.view.errors = Object.values({ address, payment });
		this.view2.errors = Object.values({ email, phone });
	}

	handleSendOrderDetails() {
		this.model.placeOrder(this.orderDetails).then((data: ISuccessOrder) => {
			this.events.emit('form:submit', { data });
			this.modal.render({
				content: this.view3.render({ ...data }),
			});
		});
	}

	handleOrderFinish() {
		this.modal.close();
		this.model.clearShoppingList();
		this.orderDetails = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: this.model.shoppingList.reduce((sum, item) => sum + item.price, 0),
			items: this.model.shoppingList.map((item) => item.id),
		};
	}
}
