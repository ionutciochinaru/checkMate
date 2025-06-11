import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4f4f5',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'ADHD Assistant',
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="add-task" 
          options={{ 
            title: 'Add Task',
            presentation: 'modal' 
          }} 
        />
      </Stack>
    </>
  );
}