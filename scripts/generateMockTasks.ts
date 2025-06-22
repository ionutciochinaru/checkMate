import { useTaskStore } from '../stores/taskStore';

const mockTasks = [
  {
    title: "Team standup meeting",
    description: "Daily sync with development team to discuss progress and blockers",
    isRecurring: true,
    recurringInterval: 24, // Daily
    reminderTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    ignoreWorkingHours: false,
    enableSequentialNotification: true,
    sequentialInterval: 300, // 5 minutes
  },
  {
    title: "Submit quarterly report",
    description: "Finalize and submit Q4 performance metrics to management",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days from now
    ignoreWorkingHours: false,
    enableSequentialNotification: false,
  },
  {
    title: "Code review for PR #234",
    description: "Review authentication module changes and provide feedback",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    ignoreWorkingHours: false,
    enableSequentialNotification: true,
    sequentialInterval: 600, // 10 minutes
  },
  {
    title: "Backup server maintenance",
    description: "Run weekly backup verification and cleanup old archives",
    isRecurring: true,
    recurringInterval: 168, // Weekly (7 days)
    reminderTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
    ignoreWorkingHours: true, // Can run anytime
    enableSequentialNotification: false,
  },
  {
    title: "Client presentation prep",
    description: "Prepare slides for tomorrow's product demo with XYZ Corp",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    ignoreWorkingHours: false,
    enableSequentialNotification: true,
    sequentialInterval: 300,
  },

  {
    title: "Doctor appointment",
    description: "Annual checkup with Dr. Smith - bring insurance card and medication list",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow
    ignoreWorkingHours: true,
    enableSequentialNotification: true,
    sequentialInterval: 1800, // 30 minutes
  },
  {
    title: "Take vitamins",
    description: "Daily vitamin D and B12 supplements with breakfast",
    isRecurring: true,
    recurringInterval: 24, // Daily
    reminderTime: new Date(Date.now() + 14 * 60 * 60 * 1000), // Tomorrow morning
    ignoreWorkingHours: true,
    enableSequentialNotification: false,
  },
  {
    title: "Grocery shopping",
    description: "Buy ingredients for weekend dinner party - check the shopping list app",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 32 * 60 * 60 * 1000), // Day after tomorrow
    ignoreWorkingHours: true,
    enableSequentialNotification: false,
  },
  {
    title: "Gym workout",
    description: "Leg day - squats, deadlifts, and cardio session",
    isRecurring: true,
    recurringInterval: 48, // Every 2 days
    reminderTime: new Date(Date.now() + 20 * 60 * 60 * 1000),
    ignoreWorkingHours: true,
    enableSequentialNotification: false,
  },
  {
    title: "Call mom",
    description: "Weekly check-in call with family to catch up",
    isRecurring: true,
    recurringInterval: 168, // Weekly
    reminderTime: new Date(Date.now() + 96 * 60 * 60 * 1000), // 4 days from now
    ignoreWorkingHours: true,
    enableSequentialNotification: true,
    sequentialInterval: 900, // 15 minutes
  },

  {
    title: "Water plants",
    description: "Water all indoor plants and check soil moisture levels",
    isRecurring: true,
    recurringInterval: 72, // Every 3 days
    reminderTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    ignoreWorkingHours: true,
    enableSequentialNotification: false,
  },
  {
    title: "Pay electricity bill",
    description: "Monthly utility bill due - pay online through the app",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 120 * 60 * 60 * 1000), // 5 days from now
    ignoreWorkingHours: true,
    enableSequentialNotification: true,
    sequentialInterval: 3600, // 1 hour
  },
  {
    title: "Clean apartment",
    description: "Weekly deep clean - vacuum, mop, dust surfaces, and organize",
    isRecurring: true,
    recurringInterval: 168, // Weekly
    reminderTime: new Date(Date.now() + 144 * 60 * 60 * 1000), // 6 days from now
    ignoreWorkingHours: true,
    enableSequentialNotification: false,
  },
  {
    title: "Car maintenance check",
    description: "Oil change and tire rotation at Mike's Auto Shop",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 240 * 60 * 60 * 1000), // 10 days from now
    ignoreWorkingHours: false,
    enableSequentialNotification: true,
    sequentialInterval: 600,
  },

  {
    title: "Spanish lesson",
    description: "Practice conversation with Duolingo and review grammar notes",
    isRecurring: true,
    recurringInterval: 24, // Daily
    reminderTime: new Date(Date.now() + 18 * 60 * 60 * 1000),
    ignoreWorkingHours: true,
    enableSequentialNotification: false,
  },
  {
    title: "Read programming book",
    description: "Continue reading 'Clean Architecture' - currently on chapter 8",
    isRecurring: true,
    recurringInterval: 48, // Every 2 days
    reminderTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    ignoreWorkingHours: true,
    enableSequentialNotification: false,
  },
  {
    title: "Online course deadline",
    description: "Submit final project for React Native certification course",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 168 * 60 * 60 * 1000), // 1 week from now
    ignoreWorkingHours: false,
    enableSequentialNotification: true,
    sequentialInterval: 1800,
  },

  {
    title: "Birthday party planning",
    description: "Organize surprise party for Sarah - book venue and send invitations",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 192 * 60 * 60 * 1000), // 8 days from now
    ignoreWorkingHours: true,
    enableSequentialNotification: true,
    sequentialInterval: 300,
  },
  {
    title: "Movie night with friends",
    description: "Watch the new Marvel movie at AMC - tickets already booked",
    isRecurring: false,
    reminderTime: new Date(Date.now() + 60 * 60 * 60 * 1000), // 2.5 days from now
    ignoreWorkingHours: true,
    enableSequentialNotification: true,
    sequentialInterval: 900,
  },
  {
    title: "Meditation session",
    description: "15-minute mindfulness meditation using the Headspace app",
    isRecurring: true,
    recurringInterval: 24, // Daily
    reminderTime: new Date(Date.now() + 22 * 60 * 60 * 1000),
    ignoreWorkingHours: true,
    enableSequentialNotification: false,
  }
];

export const generateMockTasks = async () => {
  const { addTask } = useTaskStore.getState();
  
  for (let i = 0; i < mockTasks.length; i++) {
    const taskData = mockTasks[i];
    
    try {
      await addTask({
        title: taskData.title,
        description: taskData.description,
        isRecurring: taskData.isRecurring,
        recurringInterval: taskData.recurringInterval,
        reminderTime: taskData.reminderTime,
        ignoreWorkingHours: taskData.ignoreWorkingHours,
        enableSequentialNotification: taskData.enableSequentialNotification,
        sequentialInterval: taskData.sequentialInterval,
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to create task ${i + 1}: "${taskData.title}"`, error);
    }
  }
  
  await addVariationTasks();
};

const addVariationTasks = async () => {
  const { addTask, delayTask, toggleComplete } = useTaskStore.getState();
  
  const completedTasks = [
    {
      title: "Morning coffee",
      description: "Brew fresh coffee and plan the day ahead",
      isRecurring: true,
      recurringInterval: 24,
      reminderTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      ignoreWorkingHours: true,
      enableSequentialNotification: false,
    },
    {
      title: "Email cleanup",
      description: "Archive old emails and organize inbox folders",
      isRecurring: false,
      reminderTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      ignoreWorkingHours: false,
      enableSequentialNotification: false,
    }
  ];
  
  for (const taskData of completedTasks) {
    try {
      await addTask(taskData);
      const tasks = useTaskStore.getState().tasks;
      const newTask = tasks[tasks.length - 1];
      
      await toggleComplete(newTask.id);
    } catch (error) {
      console.error(`❌ Failed to create completed task: "${taskData.title}"`, error);
    }
  }
  
  const delayedTasks = [
    {
      title: "Update resume",
      description: "Add recent projects and refresh work experience section",
      isRecurring: false,
      reminderTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago (overdue)
      ignoreWorkingHours: false,
      enableSequentialNotification: true,
      sequentialInterval: 300,
    }
  ];
  
  for (const taskData of delayedTasks) {
    try {
      await addTask(taskData);
      const tasks = useTaskStore.getState().tasks;
      const newTask = tasks[tasks.length - 1];
      
      await delayTask(newTask.id, "30m");
      await delayTask(newTask.id, "1h");
    } catch (error) {
      console.error(`❌ Failed to create delayed task: "${taskData.title}"`, error);
    }
  }
};

export default generateMockTasks;