import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ProgressUpProps = typeof __propDef.props;
export type ProgressUpEvents = typeof __propDef.events;
export type ProgressUpSlots = typeof __propDef.slots;
export default class ProgressUp extends SvelteComponentTyped<ProgressUpProps, ProgressUpEvents, ProgressUpSlots> {
}
export {};
