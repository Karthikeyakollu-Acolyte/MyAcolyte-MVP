import { ArrowUp, ArrowDown, RotateCw, RotateCcw, Scroll, Layout } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSettings } from '@/context/SettingsContext';
import { useRefs } from '@/context/sharedRefs';
export function SideToolbar() {
    const {
        scrollMode,
        toggleScrollMode,
        scrollToPage,
        rotateSinglePage,
        rotateAllPages,
        currentPage,
        pages,
        setCurrentPage
    } = useSettings();

    const { pdfViewerRef } = useRefs()

    const goToNextPage = () => {
        if (currentPage < pages) {
            const nextPage = currentPage + 1;
            scrollToPage(nextPage);
            setCurrentPage(nextPage);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const previousPage = currentPage - 1;
            scrollToPage(previousPage);
            setCurrentPage(previousPage);
        }
    };

 

    return (
        <Card className="fixed right-4 top-1/4 h-auto p-2 shadow-lg rounded-lg bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-2">
                <Button variant="ghost" size="icon" onClick={goToPreviousPage}>
                    <ArrowUp className="h-5 w-5" />
                </Button>
                <span>{currentPage}/{pages}</span>
                <Button variant="ghost" size="icon" onClick={goToNextPage}>
                    <ArrowDown className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={rotateAllPages}>
                    <RotateCw className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => rotateSinglePage(currentPage)}>
                    <RotateCcw className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleScrollMode}>
                    {scrollMode === "vertical" && <Scroll className="h-5 w-5" />}
                    {scrollMode === "horizontal" && <Layout className="h-5 w-5 rotate-90" />}
                    {scrollMode === "two-page" && <Layout className="h-5 w-5" />}
                </Button>
            </div>
        </Card>
    );
}