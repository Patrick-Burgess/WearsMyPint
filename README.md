# pb-black-coursework-2

## Design Resources:
- **Figma**: [Coursework Design Files](https://www.figma.com/files/team/1217481051804527765/project/335575895/Coursework-Design?fuid=1217481041943720152)  
  Includes: Wireframe, Flowcharts, Concept Map

## Project Outline:
This web app is a social **bar crawl route finder** that uses the **Traveling Salesman Problem (TSP)** to determine the most efficient bar crawl route. The application fetches location data through APIs (e.g., Google Maps API) and evaluates routes based on factors such as:

- Distance
- Accessibility
- Price
- Number of participants
- Starting and ending locations
- Reviews and ratings

Users can customize the crawl based on their preferences, making it a highly personalized experience.

### Key Features:
- Location-based route finding for a bar crawl
- Route optimization using TSP
- User inputs for crawl criteria (e.g., budget, preferences, ratings)
- Integration with map APIs to fetch location data
- Filtering and sorting bars based on accessibility, price, etc.
- A visually appealing and user-friendly interface

## Tech Stack:

| **Category**      | **Technologies**                            |
|-------------------|---------------------------------------------|
| **Frontend**      | React, Vite, Tailwind CSS                  |
| **Backend**       | Node.js, Next.js                           |
| **DevOps**        | Docker, GitHub Actions (CI/CD)             |
| **API**           | Google Maps API                            |
| **Testing**       | Jest, React Testing Library                |

## Git Commit Guidelines:

1. **Use Present Tense**: Commit messages should describe what the current commit does in the present tense (e.g., `add feature`, `fix bug`, `update styling`).
   
2. **Use Key Words**: Prefix commit messages with the following key words to specify the type of changes made:
   - `add`: For new features or functionality.
   - `fix`: For fixing bugs or issues.
   - `update`: For updates to functionality, code, or documentation.
   - `remove`: For removing unnecessary code or features.
   - `refactor`: For improving or restructuring code without changing functionality.
   - `docs`: For changes to documentation.

## Code Style Consistency

### **Indentation and Formatting**:
- Use **2 spaces** for indentation (not tabs).
- Use **Prettier** or a similar code formatter to automatically format code before committing.

### **Variable and Function Naming**:
- Use **camelCase** for variable and function names (e.g., `getBarDetails`, `totalPrice`).
- Use **PascalCase** for React components (e.g., `BarCard`, `UserProfile`).
- Use **UPPERCASE** for constants (e.g., `MAX_BARS`).

## CI and Testing Guidelines

### **Continuous Integration (CI) Setup**:
- Use **GitHub Actions** or other CI tools to automate testing, linting, and deployments.
- Set up workflows that run **unit tests** on each push or pull request to ensure the integrity of the codebase.
- Ensure builds fail if tests or linting checks fail, preventing bad code from being merged into the main branch.

### **Testing**:
- Write unit tests for your components using **Jest** and **React Testing Library**.
- Use **mocking** for API calls and other external dependencies in your tests.
- Ensure **high test coverage** for critical features like user inputs, bar crawl calculations, and data fetching.


## API Integration and Usage

### **API Key Management**:
- Store **API keys** (e.g., Google Maps API) in **environment variables**. Never expose keys directly in code.
- Use **GitHub Secrets** for environment variables in production.

### **Rate Limiting and Caching**:
- Be mindful of API rate limits (especially for Google Maps API) to avoid exceeding the limit.
- Implement **caching** where possible to reduce the number of API calls (e.g., using Redis or a similar solution).

### **Error Handling**:
- Always handle potential errors from APIs gracefully. 
- Return **appropriate error messages** if API calls fail or data cannot be retrieved.
