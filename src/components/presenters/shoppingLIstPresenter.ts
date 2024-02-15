import { Presenter } from '../base/presenter';
import { IAppModel } from '../AppModel';
import { IModal } from '../common/modal';
import { IShoppingListItem } from '../../types';
import { IEvents } from '../base/events';
import { IShoppingListView } from '../view/shoppingListView';

export class ShoppingListPresenter extends Presenter<IShoppingListView> {
	constructor(
		model: IAppModel,
		events: IEvents,
		modal: IModal,
		view: IShoppingListView
	) {
		super(model, events, modal, view);
		this.handleUpdateView();
	}

	handleAddToShoppingList(item: IShoppingListItem): void {
		this._model.addToShoppingList(item);
		this.handleUpdateView();
	}

	handleRemoveFromShoppingList(id: string): void {
		this._model.removeFromShoppingList(id);
		this.handleUpdateView();
	}

	handleOpenModal() {
		this._modal.render({
			content: this._view.render(),
		});
	}

	handleUpdateView() {
		this._view.updateView(this._model.shoppingList);
	}
}
