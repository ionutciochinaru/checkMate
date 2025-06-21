import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useTaskStore} from '../hooks/useTaskStore';
import {useThemedStyles, useTheme} from '../hooks/useTheme';
import {useTaskFilter, FilterType} from '../hooks/useTaskFilter';
import Animated from 'react-native-reanimated';
import HeaderComponent from '../components/HeaderComponent';
import EmptyStateComponent from '../components/EmptyStateComponent';
import TaskListComponent from '../components/TaskListComponent';
import AddButtonComponent from '../components/AddButtonComponent';

export default function HomeScreen() {
    const {tasks} = useTaskStore();
    const {animatedBackgroundStyle} = useTheme();
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('Today');

    const {filteredTasks, pendingTasks, completedTasks} = useTaskFilter(tasks, selectedFilter);

    const styles = useThemedStyles((theme) => StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {
            flex: 1,
        },
        contentContainer: {
            paddingHorizontal: 5,
            paddingVertical: 15
        },
    }));

    return (
        <Animated.View style={[styles.container, animatedBackgroundStyle]}>
            <HeaderComponent/>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                onTouchStart={() => {
                    if (showFilterDropdown) setShowFilterDropdown(false);
                }}
            >
                <TaskListComponent
                    tasks={tasks}
                    pendingTasks={pendingTasks}
                    completedTasks={completedTasks}
                    selectedFilter={selectedFilter}
                    showFilterDropdown={showFilterDropdown}
                    setSelectedFilter={setSelectedFilter}
                    setShowFilterDropdown={setShowFilterDropdown}
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
                showFilterDropdown={showFilterDropdown}
                setShowFilterDropdown={setShowFilterDropdown}
            />
        </Animated.View>
    );
}