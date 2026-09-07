# 🤝 Contributing to AeonFlez

Thank you for considering contributing to AeonFlez! We're excited to have you join our community of developers working to create the ultimate personal productivity dashboard.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [How to Contribute](#-how-to-contribute)
- [Coding Standards](#-coding-standards)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Community](#-community)

## 🌟 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and professional in all interactions.

### Our Pledge
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have:
- **Git** installed on your machine
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Text editor** (VS Code recommended)
- **Basic knowledge** of HTML, CSS, and JavaScript

### First Steps
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Set up** your development environment
4. **Create** a new branch for your feature
5. **Make** your changes
6. **Test** thoroughly
7. **Submit** a pull request

## 🔧 Development Setup

### Local Environment Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/AeonFlez.git

# Navigate to the project directory
cd AeonFlez

# Add upstream remote
git remote add upstream https://github.com/ObsidianRain/AeonFlez.git

# Create a new branch for your feature
git checkout -b feature/your-feature-name
```

### Recommended VS Code Extensions
- **Live Server** - For local development server
- **Prettier** - Code formatting
- **ESLint** - JavaScript linting
- **Auto Rename Tag** - HTML tag management
- **Bracket Pair Colorizer** - Code readability

### Testing Your Changes
```bash
# Install Live Server extension in VS Code
# Right-click on index.html
# Select "Open with Live Server"
# Your changes will auto-reload in the browser
```

## 🛠 How to Contribute

### Types of Contributions We Welcome

#### 🐛 Bug Reports
- **Search existing issues** first to avoid duplicates
- **Use the bug report template** when creating new issues
- **Include detailed reproduction steps**
- **Add screenshots** if applicable
- **Specify your browser and OS**

#### 💡 Feature Requests
- **Check the roadmap** to see if it's already planned
- **Use the feature request template**
- **Explain the use case** and benefits
- **Provide mockups** or wireframes if possible

#### 📝 Documentation
- **Fix typos** and grammatical errors
- **Improve clarity** of existing documentation
- **Add examples** and code snippets
- **Translate** documentation to other languages

#### 🔧 Code Contributions
- **Bug fixes** for existing issues
- **New features** from the roadmap
- **Performance improvements**
- **UI/UX enhancements**
- **Test coverage** improvements

### Areas We Need Help With

#### 🎯 High Priority
- **API integrations** (Plaid, Google Calendar, etc.)
- **Real-time synchronization** implementation
- **Mobile responsiveness** improvements
- **Accessibility** (ARIA labels, keyboard navigation)
- **Performance optimization**

#### 🔄 Medium Priority
- **Theme system** enhancements
- **Additional templates** for notes
- **Export/import** functionality
- **Offline support** implementation
- **Advanced charting** options

#### 🎨 Design & UX
- **New theme designs**
- **Icon improvements**
- **Animation refinements**
- **Mobile-first** design improvements
- **Dark mode** optimizations

## 📏 Coding Standards

### HTML Guidelines
```html
<!-- Use semantic HTML5 elements -->
<article class="dashboard-card">
  <header class="card-header">
    <h2 class="card-title">Analytics Overview</h2>
  </header>
  <main class="card-content">
    <!-- Content here -->
  </main>
</article>

<!-- Use proper indentation (2 spaces) -->
<!-- Include alt text for images -->
<!-- Use ARIA labels for accessibility -->
```

### CSS Guidelines
```css
/* Use CSS custom properties for theming */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}

/* Follow BEM methodology */
.dashboard-card {
  /* Block styles */
}

.dashboard-card__header {
  /* Element styles */
}

.dashboard-card--featured {
  /* Modifier styles */
}

/* Use meaningful class names */
/* Group related properties */
/* Include comments for complex styles */
```

### JavaScript Guidelines
```javascript
// Use ES6+ features
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Use meaningful variable names
// Include error handling
// Add JSDoc comments for functions
/**
 * Updates the dashboard statistics
 * @param {Object} stats - The statistics object
 * @param {number} stats.activeTasks - Number of active tasks
 * @param {number} stats.completedGoals - Number of completed goals
 */
function updateDashboardStats(stats) {
  // Implementation here
}
```

### File Organization
```
AeonFlez/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   ├── main.css        # Main styles
│   │   ├── components/     # Component-specific styles
│   │   └── themes/         # Theme variations
│   ├── js/
│   │   ├── main.js         # Main JavaScript
│   │   ├── components/     # Component scripts
│   │   └── utils/          # Utility functions
│   └── images/             # Images and icons
├── docs/                   # Documentation
├── tests/                  # Test files
└── README.md
```

## 📤 Pull Request Process

### Before Submitting
1. **Update** your branch with latest changes from upstream
2. **Test** your changes thoroughly
3. **Run** code formatters and linters
4. **Check** for any console errors
5. **Verify** responsive design works

### Pull Request Checklist
- [ ] **Branch** is up to date with main
- [ ] **Code** follows the style guidelines
- [ ] **Tests** pass (when applicable)
- [ ] **Documentation** is updated
- [ ] **Changelog** is updated
- [ ] **Screenshots** included for UI changes
- [ ] **Breaking changes** are documented

### PR Title Format
```
feat: add real-time sync functionality
fix: resolve sidebar collapse issue on mobile
docs: update API integration guide
style: improve button hover animations
refactor: optimize chart rendering performance
```

### PR Description Template
```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile devices
- [ ] Tested edge cases

## Screenshots
Include screenshots of UI changes.

## Related Issues
Fixes #123
Related to #456
```

## 🐛 Issue Guidelines

### Bug Report Template
```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- Browser: [e.g., Chrome 91.0]
- OS: [e.g., Windows 10]
- Device: [e.g., Desktop/Mobile]
- Screen Resolution: [e.g., 1920x1080]

## Additional Context
Any other context about the problem.
```

### Feature Request Template
```markdown
## Feature Description
A clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other approaches did you consider?

## Additional Context
Any other context, mockups, or examples.

## Implementation Ideas
If you have ideas about how to implement this.
```

## 🌍 Community

### Communication Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Requests** - Code contributions and reviews

### Recognition
Contributors will be recognized in:
- **README.md** contributors section
- **CHANGELOG.md** for significant contributions
- **Release notes** for major features

### Mentorship
New contributors can:
- **Ask questions** in GitHub Discussions
- **Request mentorship** for complex features
- **Join pair programming** sessions (when available)

## 🎯 Getting Help

### Where to Ask Questions
- **GitHub Discussions** - General questions about the project
- **Issues** - Specific bugs or feature requests
- **Pull Requests** - Code review and implementation questions

### Response Times
- **Issues** - We aim to respond within 48 hours
- **Pull Requests** - Initial review within 72 hours
- **Discussions** - Response within 24 hours

## 📚 Resources

### Learning Resources
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [CSS-Tricks](https://css-tricks.com/) - CSS techniques and tutorials
- [JavaScript.info](https://javascript.info/) - Comprehensive JavaScript guide
- [Git Tutorial](https://git-scm.com/docs/gittutorial) - Git basics

### Project-Specific Resources
- [Project Roadmap](https://github.com/ObsidianRain/AeonFlez/projects) - What we're working on
- [Architecture Decisions](docs/architecture.md) - Technical decisions
- [API Documentation](docs/api.md) - API integration guide
- [Design System](docs/design-system.md) - UI/UX guidelines

## 🙏 Thank You

Thank you for contributing to AeonFlez! Your efforts help make this project better for everyone. Every contribution, no matter how small, is valuable and appreciated.

**Happy coding!** 🚀

---

*This document is a living guide. If you have suggestions for improvement, please submit a pull request or create an issue.*
