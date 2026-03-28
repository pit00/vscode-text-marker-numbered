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
    
    constructor(configStore: ConfigStore, window: WindowComponent) {
        this.configStore = configStore;
        this.window = window;
    }
    
    create(colour: string): TextEditorDecorationType {
        let allColours = this.configStore.highlightColors;
        // check the index of color
        let digit = allColours.indexOf(colour);
        let index = "⁺"
        if (digit != -1) { // when match
            let superscripts = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
            digit += 1 // 1 indexed
            index = digit.toString().split('').map(digit => superscripts[parseInt(digit)]).join('');
        }
        
        if(this.configStore.random){
            colour = allColours[Math.floor(Math.random() * allColours.length)];
        }
        
        // corrected custom color
        const backgroundColour = this.getBackgroundColor(colour);
        // use custom color instead of default for the ruler
        const overviewRulerColor = this.configStore.useHighlightColorOnRuler ? colour : this.getBackgroundColor(OVERVIEW_RULER_COLOUR);
        
        return this.window.createTextEditorDecorationType(
            Object.assign(
                {
                    backgroundColor: backgroundColour,
                    borderStyle: "solid",
                    borderColor: colour,
                    overviewRulerColor: overviewRulerColor,
                    overviewRulerLane: OverviewRulerLane.Right,
                    before: {
                        width: "1",
                        contentText: index,
                        color: getColorContrast(colour),
                        backgroundColor: colour
                    },
                },
                this.configStore.autoSelectDistinctiveTextColor && {color: getColorContrast(colour)} // if enable, use color: Contrast
            )
        );
    }
    
    // convert a color to rgba (if not in rgba/hsla format) -> color name + opacity setting
    private getBackgroundColor(colour: string): string {
        if (colour.startsWith('rgba(') || colour.startsWith('hsla(')) return colour;
        
        const c = rgba(colour);
        if (!isValidColour(c)) return colour;
        return `rgba(${c[0]},${c[1]},${c[2]},${this.configStore.defaultHighlightOpacity})`;
    }
}
