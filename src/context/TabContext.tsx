'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// 탭 타입 정의
type TabContextType = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState('deals'); // 기본값은 '핫딜'

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    );
}

// 훅(Hook)을 사용하여 쉽게 접근
export function useTab() {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error('useTab must be used within a TabProvider');
    }
    return context;
}