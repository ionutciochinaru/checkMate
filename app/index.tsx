import React, {useState} from 'react';
import {useTaskStore, useMainStore} from '../stores/taskStore';
import {useThemedStyles, useTheme} from '../hooks/useTheme';
import {useTaskFilter, FilterType} from '../hooks/useTaskFilter';
import EmptyStateComponent from '../components/EmptyStateComponent';
import TaskListComponent from '../components/TaskListComponent';
import AddButtonComponent from '../components/AddButtonComponent';
import {Animated, ScrollView, StyleSheet} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const {tasks} = useTaskStore();
    const {getSettings} = useMainStore();
    const {animatedBackgroundStyle, toggleTheme, isDark} = useTheme();
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('Today');
    const [searchText, setSearchText] = useState('');
    const insets = useSafeAreaInsets();

    const settings = getSettings();
    const {filteredTasks, pendingTasks, completedTasks, getFilterCount} = useTaskFilter(tasks, selectedFilter, {
        searchText,
        workingHoursStart: settings.workingHoursStart,
        workingHoursEnd: settings.workingHoursEnd,
    });

    const styles = useThemedStyles((theme) => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingTop: insets.top,
        },
        content: {
            flex: 1,
        },
        contentContainer: {
            paddingHorizontal: theme.spacing.sm,
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.xl + insets.bottom,
        },
    }));

    return (
        <Animated.View style={[styles.container, animatedBackgroundStyle]}>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                onTouchStart={() => {
                    // Native pickers handle their own interactions
                }}
                scrollEventThrottle={16}
            >
                <TaskListComponent
                    tasks={filteredTasks}
                    pendingTasks={pendingTasks}
                    completedTasks={completedTasks}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    getFilterCount={getFilterCount}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    onThemeToggle={toggleTheme}
                    isDark={isDark}
                    onSettingsPress={() => router.push('/settings')}
                />
                <EmptyStateComponent
                    tasks={tasks}
                    filteredTasks={filteredTasks}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                />
            </ScrollView>

            <AddButtonComponent
                tasks={tasks}
                filteredTasks={filteredTasks}
                selectedFilter={selectedFilter}
            />
        </Animated.View>
    );
}