# Airsoft Events & Marketplace - Development Guidelines

## Table of Contents
1. [Code Style](#code-style)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [Component Patterns](#component-patterns)
4. [Data Fetching](#data-fetching)
5. [Error Handling](#error-handling)
6. [Form Generation](#form-generation)
7. [Layout Guidelines](#layout-guidelines)
8. [Navigation](#navigation)
9. [Performance](#performance)
10. [Styling](#styling)
11. [Testing](#testing)
12. [Theme Customization](#theme-customization)
13. [Accessibility](#accessibility)
14. [Documentation](#documentation)

## Code Style

### General Rules
- Use meaningful variable and function names
- Keep functions small and focused
- Use consistent indentation (2 spaces)
- Follow ESLint and Prettier configurations
- Use TypeScript for type safety

### File Organization
- Group related files in feature folders
- Keep components in `src/components`
- Keep pages in `src/pages`
- Keep utilities in `src/utils`
- Keep types in `src/types`

### Naming Conventions
- Use PascalCase for components
- Use camelCase for variables and functions
- Use UPPER_CASE for constants
- Use kebab-case for file names

## TypeScript Guidelines

### Type Definitions
- Define interfaces for all data structures
- Use type aliases for complex types
- Avoid using `any` type
- Use generics when appropriate

### Best Practices
- Enable strict mode
- Use type inference when possible
- Document complex types
- Use union types for variants
- Use optional properties with `?`

## Component Patterns

### Component Structure
- Use functional components
- Implement proper prop types
- Use React hooks effectively
- Follow single responsibility principle

### State Management
- Use local state for component-specific data
- Use context for global state
- Implement proper state updates
- Handle side effects with useEffect

### Component Composition
- Use composition over inheritance
- Create reusable components
- Implement proper prop drilling
- Use render props when needed

## Data Fetching

### API Integration
- Use the provided API client
- Handle loading states
- Implement proper error handling
- Cache responses when appropriate

### Data Management
- Use React Query for server state
- Implement proper data mutations
- Handle optimistic updates
- Manage cache invalidation

## Error Handling

### Error Boundaries
- Implement error boundaries
- Handle component errors gracefully
- Provide fallback UI
- Log errors appropriately

### Error Messages
- Use user-friendly error messages
- Implement proper error states
- Handle network errors
- Provide recovery options

## Form Generation

### Form Structure
- Use controlled components
- Implement proper validation
- Handle form submission
- Manage form state

### Form Validation
- Use Zod for schema validation
- Implement client-side validation
- Handle server-side validation
- Show validation errors

## Layout Guidelines

### Responsive Design
- Use mobile-first approach
- Implement proper breakpoints
- Use flexbox and grid
- Handle different screen sizes

### Layout Components
- Use consistent spacing
- Implement proper alignment
- Handle overflow
- Use proper container widths

## Navigation

### Routing
- Use React Router
- Implement proper routes
- Handle route parameters
- Manage navigation state

### Navigation Components
- Create reusable navigation
- Handle active states
- Implement proper links
- Manage navigation history

## Performance

### Optimization
- Implement code splitting
- Use proper lazy loading
- Optimize images
- Minimize bundle size

### Performance Monitoring
- Monitor performance metrics
- Implement proper caching
- Optimize re-renders
- Handle large datasets

## Styling

### CSS Guidelines
- Use Tailwind CSS
- Follow BEM naming
- Implement responsive styles
- Use CSS variables

### Style Organization
- Keep styles modular
- Use proper specificity
- Implement themes
- Handle dark mode

## Testing

### Test Structure
- Write unit tests
- Implement integration tests
- Use proper test organization
- Follow testing best practices

### Testing Tools
- Use Jest for testing
- Implement proper mocks
- Use testing library
- Write meaningful tests

## Theme Customization

### Theme Structure
- Use design tokens
- Implement proper themes
- Handle theme switching
- Use consistent colors

### Theme Implementation
- Use CSS variables
- Implement proper overrides
- Handle theme variants
- Use proper typography

## Accessibility

### Accessibility Guidelines
- Follow WCAG guidelines
- Implement proper ARIA
- Handle keyboard navigation
- Use semantic HTML

### Accessibility Testing
- Test with screen readers
- Check color contrast
- Handle focus states
- Implement proper labels

## Documentation

### Code Documentation
- Write meaningful comments
- Document complex logic
- Use JSDoc comments
- Keep documentation updated

### Project Documentation
- Maintain README
- Document setup process
- Keep changelog updated
- Document API endpoints

## Custom Components

### TextInput Component
- For all text input fields, use the custom `TextInput` component from `src/components/ui/TextInput.tsx`. This component supports `label`, `error`, and `containerClassName` props, and applies consistent Tailwind styling. Do not use raw <input> elements for text fields in new layouts.