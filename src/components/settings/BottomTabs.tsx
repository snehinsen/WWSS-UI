import {Tabs} from "@chakra-ui/react";
import {SettingsView} from "./Sidebar.tsx";

interface Props {
    currentPage: SettingsView;
    onPageChange: (pageIndex: number) => void;
    pages: SettingsView[]
}

function BottomTabs({currentPage, onPageChange, pages}: Props) {

    return (
        <Tabs.Root
            value={currentPage.label}
            onValueChange={(details) => {
                const index:number = pages.findIndex(
                    (p:SettingsView):boolean => p.label === details.value
                );
                if (index !== -1) {
                    onPageChange(index);
                }
            }}
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            display={{ base: "block", md: "none" }}
        >
            <Tabs.List
                borderTopWidth="1px"
                bg="bg.panel"
                overflowX="auto"
            >
                {pages.map((page: SettingsView) => (
                    <Tabs.Trigger
                        key={page.label}
                        value={page.label}
                        flex="1"
                        py={3}
                        justifyContent="center"
                    >
                        {page.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
        </Tabs.Root>
    )

}

export default BottomTabs;