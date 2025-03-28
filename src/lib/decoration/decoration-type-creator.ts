import {OverviewRulerLane, TextEditorDecorationType} from 'vscode';
import ConfigStore from '../config-store';
import WindowComponent from '../vscode/window';

const OVERVIEW_RULER_COLOUR = 'violet';
const getColorContrast = require('../../../lib-3rd-party/dynamic-contrast');
const rgba = require('color-rgba');

const isValidColour = (rgba: number[]): boolean => rgba.length !== 0;

export default class DecorationTypeCreator {
    private readonly configStore: ConfigStore;
    private readonly window: WindowComponent;

    constructor(configStore: ConfigStore,
                window: WindowComponent) {
        this.configStore = configStore;
        this.window = window;
    }

    create(colour: string): TextEditorDecorationType {
        const backgroundColour = this.getBackgroundColor(colour);
        const overviewRulerColor = this.configStore.useHighlightColorOnRuler ?
            backgroundColour : this.getBackgroundColor(OVERVIEW_RULER_COLOUR);
        let digit = this.configStore.highlightColors.indexOf(colour);
        let index = "⁺"
        if (digit != -1) { // when match
            let superscripts = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
            digit += 1 // 1 indexed
            index = digit.toString().split('').map(digit => superscripts[parseInt(digit)]).join('');
        }
        return this.window.createTextEditorDecorationType(
            Object.assign(
                {
                    backgroundColor: backgroundColour,
                    borderRadius: '.2em',
                    overviewRulerColor: overviewRulerColor,
                    overviewRulerLane: OverviewRulerLane.Right,
                    before: {
                        width: "1",
                        contentText: index,
                        color: "white"
                    },
                },
                this.configStore.autoSelectDistinctiveTextColor && {color: getColorContrast(colour)}
            )
        );
    }

    private getBackgroundColor(colour: string): string {
        if (colour.startsWith('rgba(') || colour.startsWith('hsla(')) return colour;

        const c = rgba(colour);
        if (!isValidColour(c)) return colour;
        return `rgba(${c[0]},${c[1]},${c[2]},${this.configStore.defaultHighlightOpacity})`;
    }
}
