import { IEvents } from './events';
import { IAppModel } from '../AppModel';
import { Modal } from '../common/modal';

export abstract class Presenter<V = undefined, V2 = undefined, V3 = undefined> {
	protected events: IEvents;
	protected model: IAppModel;
	protected modal: Modal;
	protected view?: V;
	protected view2?: V2;
	protected view3?: V3

	constructor(
		model: IAppModel,
		events: IEvents,
		modal: Modal,
		view?: V,
		view2?: V2,
		view3?: V3
	) {
		this.model = model;
		this.events = events;
		this.modal = modal;
		this.view = view;
		this.view2 = view2;
		this.view3 = view3;
	}
}
