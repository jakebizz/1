# Cosmic Simulator

**An interactive terminal-based particle system with stunning visual effects**

Experience the beauty of procedural particle physics right in your terminal! Cosmic Simulator features multiple visual modes, real-time physics simulation, and smooth animations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.6+-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## Features

- **6 Beautiful Visual Modes:**
  - **Cosmic** - Twinkling stars and nebula clouds drifting through space
  - **Matrix** - Iconic falling digital rain with Japanese characters
  - **Fire** - Realistic flames rising with natural turbulence
  - **Ocean** - Gentle waves flowing across your screen
  - **Galaxy** - Spiral galaxy with orbiting stellar particles
  - **Aurora** - Mesmerizing aurora borealis light show

- **Real Physics Engine:**
  - Particle-based simulation with velocity and acceleration
  - Gravity and damping effects
  - Life cycle management with fade effects
  - Smooth 60 FPS rendering

- **Interactive Controls:**
  - Switch between modes in real-time
  - Pause and resume simulation
  - Adjust particle emission rate
  - Clear particles on demand

## Installation

### Prerequisites

- Python 3.6 or higher
- Unix-like terminal (Linux, macOS, WSL on Windows)
- Terminal with Unicode and color support

### Setup

1. Clone or download this repository:
   ```bash
   git clone <repository-url>
   cd cosmic-simulator
   ```

2. No external dependencies required! Uses Python's built-in `curses` library.

3. Make the script executable (optional):
   ```bash
   chmod +x cosmic_simulator.py
   ```

## Usage

### Quick Start

Simply run the simulator:

```bash
python3 cosmic_simulator.py
```

Or if you made it executable:

```bash
./cosmic_simulator.py
```

### Controls

| Key | Action |
|-----|--------|
| `1` | Switch to **Cosmic** mode |
| `2` | Switch to **Matrix** mode |
| `3` | Switch to **Fire** mode |
| `4` | Switch to **Ocean** mode |
| `5` | Switch to **Galaxy** mode |
| `6` | Switch to **Aurora** mode |
| `SPACE` | Pause/Resume simulation |
| `C` | Clear all particles |
| `+` or `=` | Increase particle emission rate |
| `-` or `_` | Decrease particle emission rate |
| `Q` | Quit the simulator |

### Tips for Best Experience

1. **Terminal Size:** Use a large terminal window for the best visual effect (at least 100x30)
2. **Color Support:** Ensure your terminal supports 256 colors
3. **Font:** Use a monospace font with good Unicode support
4. **Theme:** Dark terminal backgrounds work best
5. **Performance:** If you experience lag, press `-` to reduce particle count

## Visual Modes Explained

### 1. Cosmic Mode
The default mode featuring stars, nebulae, and cosmic dust particles floating through space with gentle motion.

### 2. Matrix Mode
Digital rain falling down your screen with randomized characters including binary and Japanese katakana.

### 3. Fire Mode
Realistic fire simulation with particles rising upward, swaying side to side, and fading as they ascend.

### 4. Ocean Mode
Gentle wave particles flowing in sinusoidal patterns, creating a calming oceanic effect.

### 5. Galaxy Mode
Particles orbit in a spiral pattern, creating a rotating galaxy structure at the center of your screen.

### 6. Aurora Mode
Flowing aurora borealis effect with particles drifting in wavy patterns across the upper portion of the screen.

## Technical Details

### Architecture

The simulator consists of three main components:

1. **Particle Class** (`Particle`)
   - Represents individual particles with position, velocity, and life properties
   - Updates physics each frame
   - Supports customizable appearance and colors

2. **Particle System** (`ParticleSystem`)
   - Manages all active particles
   - Handles emission based on current mode
   - Applies physics updates (gravity, damping, movement)
   - Maintains mode-specific parameters

3. **Simulator Application** (`CosmicSimulator`)
   - Main game loop and rendering
   - Input handling
   - FPS management
   - UI display

### Performance

- Target: 60 FPS
- Particle count: Dynamic (typically 100-500 depending on mode and emission rate)
- Memory efficient: Only stores active particles
- Automatic cleanup of dead particles

## Customization

Want to tweak the simulator? Here are some parameters you can modify in `cosmic_simulator.py`:

- **Emission Rate:** Adjust `self.emit_rate` in each mode (lines 118-135)
- **Gravity:** Modify `self.gravity` tuple for different physics
- **Damping:** Change `self.damping` (0-1) for air resistance
- **Particle Characters:** Edit the `chars` list in each `_emit_*` method
- **Colors:** Modify color numbers (1-15) for different palettes
- **Particle Lifetime:** Adjust `life` parameter in emission methods

## Troubleshooting

### Colors don't display correctly
- Ensure your terminal supports 256 colors
- Try a different terminal emulator (e.g., iTerm2, GNOME Terminal, Alacritty)

### Performance issues
- Reduce particle emission rate using the `-` key
- Close other applications
- Use a smaller terminal window

### Characters display as boxes
- Install a font with better Unicode support
- Try: Fira Code, JetBrains Mono, or Nerd Fonts

### Crashes on Windows
- Use WSL (Windows Subsystem for Linux)
- The `curses` library requires Unix-like terminal

## Contributing

Feel free to:
- Report bugs
- Suggest new visual modes
- Improve performance
- Add features
- Fix issues

## License

MIT License - Feel free to use and modify!

## Credits

Created with passion for beautiful terminal applications.

Inspired by:
- Classic screensavers
- Particle physics simulations
- Terminal art enthusiasts worldwide

---

**Enjoy the cosmic experience!**

*"In the terminal, no one can hear you scream... but they can see you shine."*
