import {ObjectMap} from '../common/collection';

export interface VsTelemetryReporterLike {
    sendTelemetryEvent(eventName: string, properties?: ObjectMap<string>, measurements?: ObjectMap<number>): void;
    dispose(): Promise<any>;
}

export type VsTelemetryReporterCreator = (extensionId: string, extensionVersion: string, telemetryKey: string) => VsTelemetryReporterLike;

export const getVsTelemetryReporterCreator = (useRealReporter: boolean): VsTelemetryReporterCreator => {
    if (useRealReporter) {
        // Cannot import at the top-level as it causes error during unit test
        const VsTelemetryReporter = require('vscode-extension-telemetry').default;
        return (id: string, version: string, telemetryKey: string) => new VsTelemetryReporter(id, version, telemetryKey);
    } else {
        return () => new NullVsTelemetryReporter();
    }
};

class NullVsTelemetryReporter implements VsTelemetryReporterLike {
    sendTelemetryEvent(_eventName: string, _properties?: ObjectMap<string>, _measurements?: ObjectMap<number>): void {
    }

    dispose(): Promise<any> {
        return Promise.resolve();
    }
}
