# **App Name**: GeneSys

## Core Features:

- Real-time System Visualization: Displays system components (API Service, Security Layer, External Service) and their real-time status (healthy, warning, failure, recovery) with dynamic visual indicators like glows, pulses, and flickers.
- Live Activity Log Stream: Presents a continuous, auto-scrolling log of all system events, including timestamps, descriptive messages, and visual icons for event types (e.g., error, success, action).
- Mutation Simulation Controls: Provides user interface buttons to trigger simulated system failures and cyber attacks (e.g., 'Simulate API Failure', 'Simulate DDoS Attack') which send POST requests to the backend.
- Genetic Memory Panel: Displays the system's learned recovery strategies, showing which actions are effectively counteracting specific event types, with real-time updates as new successful strategies are stored.
- Real-time Event Communication: Establishes a WebSocket connection using Socket.io for bi-directional communication between the frontend and backend, enabling real-time updates for logs, system states, and memory panel data.
- Reactive DNA Engine: A backend logic module that acts as the system's 'DNA', containing rules to map detected events to potential recovery actions, executed sequentially based on an internal event system.
- Adaptive Immune System Memory: An in-memory storage mechanism that 'learns' by storing successful recovery strategies. Upon encountering a known event type, it retrieves and applies the proven strategy instantly.

## Style Guidelines:

- Dark background: #20182E (a deep, desaturated purplish-blue), providing a futuristic and focused ambiance.
- Primary accent color: #8553F5 (a vibrant violet), used for interactive elements, highlights, and primary textual content to contrast effectively with the dark background.
- Secondary accent color: #86C1FF (a bright sky blue), reserved for calls-to-action, key notifications, and system statuses requiring high visibility.
- Primary font: 'Space Grotesk' (sans-serif), chosen for its computerized and scientific aesthetic, suitable for all UI text, headlines, and log entries.
- Utilize crisp, vector-based icons that complement the futuristic, cyber-resilient theme for log entries (error, success, action) and system status indicators.
- Initial landing features a centrally animated CSS/SVG DNA helix, which transitions to a split-screen dashboard on scroll: 'System Brain' (live logs) on the left and 'System Body' (component visualizations) on the right.
- Incorporate subtle CSS transitions for UI elements and a responsive 'reconnect' animation for system nodes in recovery states, enhancing the real-time feedback. Log entries should smoothly animate into view.