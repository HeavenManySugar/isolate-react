# Isolate React Configuration Tool

A modern, user-friendly web interface for configuring the [Isolate sandbox](https://github.com/ioi/isolate) - a security isolation system based on Linux containers, commonly used in competitive programming and code execution environments.

## 🚀 Features

### Visual Configuration Interface
- **Tabbed Interface**: Organize configuration options into logical groups (Basic, Limits, Environment, Directories, Control Groups, Special Options, Program Settings)
- **Real-time Command Generation**: Automatically generates Isolate commands as you configure options
- **One-click Copy**: Copy generated commands to clipboard with visual feedback

### Resource Management
- **Memory Limits**: Configure memory usage limits in KB
- **Time Limits**: Set CPU time and wall-clock time constraints
- **File System Limits**: Control file size, open files count, and disk quotas
- **Process Limits**: Restrict number of processes and stack size

### Environment Control
- **Environment Variables**: Add/remove custom environment variables
- **Directory Mapping**: Map host directories to sandbox paths with permission controls
- **Network Isolation**: Configure network namespace sharing
- **User/Group Control**: Set execution UID/GID

### Configuration Management
- **Preset Templates**: Pre-configured templates for common use cases:
  - Basic Configuration: General program execution
  - Competitive Programming: Strict limits for contest environments
  - Development Testing: Relaxed settings for development
- **Import/Export**: Save and load configurations as JSON files
- **Reset Functionality**: Quick reset to default settings

### Modern UI/UX
- **Dark Mode Support**: Automatic dark/light theme detection
- **Responsive Design**: Works on desktop and mobile devices
- **Tailwind CSS**: Modern, clean interface with smooth animations
- **TypeScript**: Type-safe development with excellent IDE support

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans & Geist Mono
- **Build Tool**: Turbopack (Next.js)
- **Deployment**: GitHub Pages ready

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HeavenManySugar/isolate-react.git
   cd isolate-react
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

- **`npm run dev`**: Start development server with Turbopack
- **`npm run build`**: Build for production
- **`npm run start`**: Start production server
- **`npm run lint`**: Run ESLint

## 📖 Usage Guide

### Basic Workflow

1. **Initialize Isolate**:
   ```bash
   isolate --init
   ```

2. **Configure using the web interface**:
   - Navigate through different configuration tabs
   - Set your desired limits and options
   - Use preset templates for common scenarios

3. **Copy the generated command**:
   - The command is automatically generated as you configure
   - Click "Copy Command" to copy to clipboard

4. **Execute your program**:
   ```bash
   # Example generated command
   isolate --box-id=0 --mem=262144 --time=1 --wall-time=2 --processes=1 --run -- ./program
   ```

5. **Cleanup**:
   ```bash
   isolate --cleanup
   ```

### Configuration Options

#### Basic Options
- **Box ID**: Unique sandbox identifier
- **Meta File**: Output file for execution metadata
- **I/O Redirection**: Configure stdin, stdout, stderr
- **Working Directory**: Set program execution directory
- **Verbose/Silent modes**: Control output verbosity

#### Resource Limits
- **Memory Limit**: Maximum memory usage (KB)
- **Time Limits**: CPU time and wall-clock time limits
- **File System**: File size limits, open files count
- **Process Control**: Maximum number of processes
- **Stack Size**: Stack memory limit

#### Environment & Security
- **Environment Variables**: Custom environment setup
- **Directory Mapping**: Mount host directories with specific permissions
- **Network Isolation**: Control network access
- **User/Group Settings**: Execute with specific UID/GID
- **Control Groups**: Advanced resource management

### Preset Configurations

#### Basic Configuration
- Memory: 256MB
- Time: 1 second
- Processes: 1
- Suitable for: General program execution

#### Competitive Programming
- Memory: 256MB
- Time: 1 second
- Stack: 8MB
- Open Files: 16
- Suitable for: Contest environments, strict resource limits

#### Development Testing
- Memory: 1GB
- Time: 10 seconds
- Network: Enabled
- Verbose: Enabled
- Suitable for: Development and testing scenarios

## 🔧 Development

### Project Structure
```
isolate-react/
├── pages/
│   ├── _app.tsx          # App configuration
│   ├── _document.tsx     # Document structure
│   └── index.tsx         # Main application
├── styles/
│   └── globals.css       # Global styles
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

### Key Components

The main application (`pages/index.tsx`) includes:
- **Configuration State Management**: React hooks for managing complex configuration state
- **Tab Navigation**: Modular interface for different configuration categories
- **Command Generation**: Real-time command building based on configuration
- **Clipboard Integration**: Native browser clipboard API with fallback
- **Configuration Import/Export**: JSON-based configuration persistence

### Customization

To add new configuration options:

1. **Extend the IsolateConfig interface**:
   ```typescript
   interface IsolateConfig {
     // Add new option
     newOption: string;
   }
   ```

2. **Update the generateCommand function**:
   ```typescript
   if (config.newOption) cmd += ` --new-option=${config.newOption}`;
   ```

3. **Add UI controls** in the appropriate tab section

## 🌐 Deployment

### GitHub Pages
The project includes a GitHub Actions workflow for automatic deployment to GitHub Pages:

```yaml
# .github/workflows/nextjs.yml
# Automatically deploys on push to main branch
```

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the GNU General Public License v2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **[Isolate](https://github.com/ioi/isolate)**: The underlying sandbox system

## 📚 Resources

- **[Isolate Documentation](https://github.com/ioi/isolate/blob/master/isolate.1.txt)**: Official Isolate manual
- **[Next.js Documentation](https://nextjs.org/docs)**: Learn about Next.js features
- **[Tailwind CSS](https://tailwindcss.com/docs)**: Utility-first CSS framework
- **[Linux Containers](https://linuxcontainers.org/)**: Learn about container technology

---

**Note**: This is a configuration tool for Isolate. You still need to have Isolate installed on your system to execute the generated commands. This tool only helps generate the correct command-line arguments for Isolate.