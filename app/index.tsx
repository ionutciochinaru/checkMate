import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTaskStore } from '../hooks/useTaskStore';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { useTaskFilter, FilterType } from '../hooks/useTaskFilter';
import Animated from 'react-native-reanimated';
import HeaderComponent from '../components/HeaderComponent';
import EmptyStateComponent from '../components/EmptyStateComponent';
import TaskListComponent from '../components/TaskListComponent';
import AddButtonComponent from '../components/AddButtonComponent';

export default function HomeScreen() {
  const { tasks } = useTaskStore();
  const { animatedBackgroundStyle } = useTheme();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Today');

  const { filteredTasks, pendingTasks, completedTasks } = useTaskFilter(tasks, selectedFilter);

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 12,
    },
  }));

  return (
    <Animated.View style={[styles.container, animatedBackgroundStyle]}>
      <HeaderComponent
        tasks={tasks}
        pendingTasks={pendingTasks}
        completedTasks={completedTasks}
        selectedFilter={selectedFilter}
        showFilterDropdown={showFilterDropdown}
        setSelectedFilter={setSelectedFilter}
        setShowFilterDropdown={setShowFilterDropdown}
      />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        onTouchStart={() => {
          if (showFilterDropdown) setShowFilterDropdown(false);
        }}
      >
        <EmptyStateComponent
          tasks={tasks}
          filteredTasks={filteredTasks}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        <TaskListComponent
          pendingTasks={pendingTasks}
          completedTasks={completedTasks}
          selectedFilter={selectedFilter}
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