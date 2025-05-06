import * as Const from '../const';
import EventEmitter = NodeJS.EventEmitter;
import {StatusBarItem} from 'vscode';

const Event = Const.Event;

export default class ToggleWholeMatchModeButton {
    private readonly eventBus: EventEmitter;
    private readonly statusBarItem: StatusBarItem;

    constructor(eventBus: EventEmitter, statusBarItem: StatusBarItem) {
        this.eventBus = eventBus;
        this.statusBarItem = statusBarItem;
        this.registerListeners();
    }

    private registerListeners() {
        this.eventBus.on(Event.MATCHING_MODE_INITIALISED, this.initialiseButton.bind(this));
        this.eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, this.updateButton.bind(this));
    }

    private initialiseButton(params: {wholeMatch: boolean}) {
        this.updateButton(params);

        this.statusBarItem.command = `${Const.EXTENSION_ID}.toggleModeForWholeMatch`;
        this.statusBarItem.show();
    }

    private updateButton({wholeMatch}: {wholeMatch: boolean}) {
        const statusBarItem = this.statusBarItem;
        if (wholeMatch) {
            statusBarItem.text = '$(whole-word)🔦'; // 🟢 [Ab|]
            statusBarItem.color = 'green'
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Whole Match On`;
        } else {
            statusBarItem.text = '$(whole-word)🔦'; // 🔴 Ab|
            statusBarItem.color = 'red'
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Whole Match Off`;
        }
    }

}
