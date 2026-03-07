import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import MentionList from "./MentionList";

export default function MentionSuggestion()  {
    return () => {
        let component: ReactRenderer | null = null;
        let popup: any = null;

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(MentionList, {
                    props: { ...props },
                    editor: props.editor,
                });

                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                });
            },

            onUpdate: (props: any) => {
                component?.updateProps({ ...props });
                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown: (props: any) => {
                // @ts-ignore
                return component?.ref?.onKeyDown(props) ?? false;
            },

            onExit: () => {
                popup[0].destroy();
                component?.destroy();
            },
        };
    }
}

