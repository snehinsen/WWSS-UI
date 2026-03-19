import {Box, Flex} from "@chakra-ui/react";
import {useState} from "react";
import Header from "../components/Header";
import Sidebar, {SettingsView} from "../components/settings/Sidebar";
import General from "../components/settings/views/General.tsx";
import BottomTabs from "../components/settings/BottomTabs.tsx";
import Privacy from "../components/settings/views/Privacy.tsx";

function SettingsPage() {

    const pages: SettingsView[] = [
        {label: "General", component: General},
        {label: "Privacy", component: Privacy}
    ];

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const CurrentPage = pages[currentPageIndex].component;

    return (
        <Flex direction="column" minH="100vh">
            <Header headerType="logged-in"/>

            {/* Main settings layout */}
            <Flex
                flex="1"
                maxW="900px"
                w="100%"
                mx="auto"
                mt={6}
                px={4}
                gap="10"
                align="stretch"
            >
                {/* Desktop Sidebar */}
                <Box
                    display={{base: "none", md: "block"}}
                    w="220px"
                >
                    <Sidebar
                        currentPage={pages[currentPageIndex]}
                        onPageChange={setCurrentPageIndex}
                        pages={pages}
                    />
                </Box>

                {/* Page Content */}
                <Box
                    flex="1"
                    overflowY="auto"
                    pb={{base: "70px", md: "5px"}}
                >
                    <CurrentPage/>
                </Box>
            </Flex>

            {/* Mobile Bottom Tabs */}
            <BottomTabs
                currentPage={pages[currentPageIndex]}
                onPageChange={setCurrentPageIndex}
                pages={pages}
            />
        </Flex>
    );
}

export default SettingsPage;