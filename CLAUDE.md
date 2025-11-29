# CLAUDE.md - AI Assistant Guide for Cosmic Simulator

This document provides comprehensive guidance for AI assistants working with the Cosmic Simulator codebase.

## Project Overview

**Cosmic Simulator** is an interactive terminal-based particle system written in Python that features six stunning visual modes with real-time physics simulation. The project showcases beautiful procedural animations directly in the terminal using Python's built-in `curses` library.

### Project Metadata
- **Language**: Python 3.6+
- **Dependencies**: Standard library only (curses, math, random, time, dataclasses, enum, typing)
- **License**: MIT
- **Version**: 1.0.0
- **Platform**: Unix-like systems (Linux, macOS, WSL)

## Repository Structure

```
/home/user/1/
├── cosmic_simulator.py   # Main application (383 lines)
├── demo.py              # Demo mode without curses (96 lines)
├── requirements.txt     # Dependency documentation (no external deps)
├── README.md           # User-facing documentation
├── LICENSE             # MIT License
└── .gitignore          # Standard Python gitignore
```

### File Descriptions

1. **cosmic_simulator.py** - Core application
   - Entry point: `main()` function at line 370
   - Uses `curses.wrapper()` for terminal management
   - Three main classes: `Particle`, `ParticleSystem`, `CosmicSimulator`
   - Implements six visual modes with distinct particle behaviors

2. **demo.py** - Preview mode
   - Standalone demo for environments lacking curses support
   - Shows simple cosmic mode animation
   - Useful for testing without full terminal capabilities

3. **requirements.txt** - Dependency notes
   - Documents that no pip packages are required
   - Notes `windows-curses` for Windows users not using WSL

## Architecture Overview

### Class Hierarchy

```
Particle (dataclass)
  ├── Properties: x, y, vx, vy, life, max_life, char, color
  ├── update(dt, gravity, damping) - Physics update
  └── is_alive() - Life check

ParticleSystem
  ├── Manages particle collection
  ├── Handles emission for each visual mode
  ├── Six emission methods: _emit_cosmic(), _emit_matrix(), etc.
  ├── update(dt) - Update all particles
  └── set_mode(mode) - Change visual mode and parameters

CosmicSimulator
  ├── Main game loop
  ├── Curses terminal management
  ├── Input handling
  ├── Rendering system
  └── FPS management (target: 60 FPS)
```

### Visual Modes (VisualMode Enum)

1. **COSMIC** (default) - Stars and nebulae drifting in space
   - Characters: `['*', '·', '∙', '○', '●', '✦', '✧', '✨']`
   - Colors: Magenta, cyan, pink (color pairs 5, 6, 13, 14)
   - Gravity: (0, 0), Damping: 0.98, Emit rate: 5

2. **MATRIX** - Falling digital rain
   - Characters: `['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', '日', '月', '火']`
   - Colors: Green (color pair 2)
   - Vertical falling motion

3. **FIRE** - Rising flame simulation
   - Characters: `['▲', '▴', '∴', ':', '.', '·', '˙']`
   - Colors: Red to yellow (color pairs 1, 3, 9, 11)
   - Gravity: (0, -5), Damping: 0.95, Emit rate: 8

4. **OCEAN** - Wave particles
   - Characters: `['~', '≈', '∽', '∿', '〰', '・']`
   - Colors: Blue and cyan (color pairs 4, 6, 12, 14)
   - Sinusoidal motion based on time

5. **GALAXY** - Spiral galaxy with orbiting particles
   - Characters: `['*', '·', '∙', '○', '●', '+', '×']`
   - Orbital velocity calculations
   - Gravity: (0, 0), Damping: 0.99, Emit rate: 4

6. **AURORA** - Aurora borealis effect
   - Characters: `['░', '▒', '▓', '█', '▄', '▀', ':', '·']`
   - Colors: Green, yellow, magenta, cyan (color pairs 2, 3, 5, 6, 10, 13)
   - Wavy horizontal motion

## Code Conventions

### Python Style

1. **Naming Conventions**
   - Classes: PascalCase (`Particle`, `ParticleSystem`, `CosmicSimulator`)
   - Functions/Methods: snake_case (`update()`, `emit_particles()`, `handle_input()`)
   - Private methods: Leading underscore (`_emit_cosmic()`, `_emit_matrix()`)
   - Constants: UPPER_SNAKE_CASE (used in VisualMode enum)

2. **Type Hints**
   - Use type annotations from `typing` module
   - Return types specified for all methods
   - Example: `def update(self, dt: float, gravity: Tuple[float, float], damping: float)`

3. **Documentation**
   - Module-level docstring at top of file
   - Class docstrings for all classes
   - Method docstrings describing purpose
   - Format: Triple-quoted strings on line after definition

4. **Code Organization**
   - Imports grouped: standard library first
   - Classes ordered by dependency (Particle → ParticleSystem → CosmicSimulator)
   - Helper methods prefixed with underscore
   - Entry point at bottom with `if __name__ == "__main__":`

### Coding Patterns

1. **Dataclasses** - Used for simple data structures (Particle)
2. **Enums** - Used for mode selection (VisualMode)
3. **List Comprehensions** - Used for particle filtering: `[p for p in self.particles if p.is_alive()]`
4. **Try-except** - Used for curses operations that might fail at screen edges
5. **Delta Time** - All physics uses dt for frame-rate independence

## Development Workflows

### Running the Application

```bash
# Standard execution
python3 cosmic_simulator.py

# Or if executable bit is set
./cosmic_simulator.py

# Demo mode (no curses required)
python3 demo.py
```

### Testing Different Modes

The application has interactive controls:
- Keys 1-6: Switch visual modes
- SPACE: Pause/Resume
- C: Clear particles
- +/-: Adjust emission rate
- Q: Quit

### Performance Considerations

1. **Target FPS**: 60 (sleep time: 0.016s per frame)
2. **Particle Count**: Dynamic (100-500 typical)
3. **Delta Time Cap**: Max 0.1s to prevent huge jumps
4. **Automatic Cleanup**: Dead particles removed each frame
5. **Screen Wrapping**: Only for COSMIC and OCEAN modes

### Code Modification Guidelines

#### Adding a New Visual Mode

1. Add enum value to `VisualMode` class (line 18)
2. Create `_emit_<mode>()` method in `ParticleSystem` (after line 174)
3. Add mode case in `emit_particles()` (lines 68-82)
4. Set parameters in `set_mode()` (lines 200-224)
5. Add keybinding in `handle_input()` (lines 259-287)
6. Update README.md with mode description

#### Modifying Particle Behavior

- **Physics**: Edit `Particle.update()` (lines 40-48)
- **Lifetime**: Adjust `life` parameter in emission methods
- **Colors**: Modify color pair numbers (1-15)
- **Characters**: Edit `chars` list in emission methods
- **Gravity**: Change `self.gravity` tuple in `set_mode()`
- **Damping**: Adjust `self.damping` (0-1 range)

#### Adjusting Rendering

- **Fade Effect**: Logic at lines 300-304 (alpha-based rendering)
- **UI Elements**: Modify lines 308-323
- **Screen Dimensions**: Calculated at lines 247-248
- **Color Initialization**: Lines 241-244

## Key Technical Details

### Curses Setup

```python
curses.curs_set(0)          # Hide cursor
stdscr.nodelay(1)           # Non-blocking input
stdscr.timeout(0)           # No input delay
curses.start_color()        # Enable colors
curses.use_default_colors() # Use terminal defaults
```

### Physics System

- **Position Update**: `x += vx * dt`, `y += vy * dt`
- **Velocity Update**: `vx += gravity[0] * dt`, `vy += gravity[1] * dt`
- **Damping**: `vx *= damping` (simulates air resistance)
- **Life Decay**: `life -= dt`

### Frame Timing

```python
dt = current_time - last_time  # Delta time calculation
dt = min(dt, 0.1)              # Cap to prevent jumps
time.sleep(0.016)              # ~60 FPS
```

## Git Workflow

### Current Branch

- Working branch: `claude/claude-md-mikhn2vjqstk6hbw-018ewE8ymoVK1GFEJXQ5LYMn`
- All development should occur on this branch
- Push with: `git push -u origin <branch-name>`

### Commit Style

Based on recent commits:
```
Add demo preview script for environments without curses support
Add Cosmic Simulator - Interactive Terminal Particle System
```

**Conventions:**
- Start with imperative verb (Add, Update, Fix, Refactor)
- Be descriptive but concise
- No period at end
- Focus on "what" and "why"

### Pre-Push Checklist

1. Ensure code runs without errors
2. Test at least 2-3 visual modes
3. Verify no syntax errors or import issues
4. Check that terminal dimensions are handled correctly
5. Ensure FPS stays around 60 on your system

## Common Tasks for AI Assistants

### Code Analysis

**When asked to explain code:**
- Reference specific line numbers (e.g., "cosmic_simulator.py:240")
- Explain the purpose and how it fits in the architecture
- Mention related functions/classes

**When asked about behavior:**
- Trace execution from entry point (`main()` → `CosmicSimulator.run()`)
- Explain the game loop at lines 338-364
- Reference specific particle emission methods

### Code Modifications

**When adding features:**
1. Read relevant sections first
2. Understand existing patterns
3. Follow established naming conventions
4. Add type hints
5. Include docstrings
6. Test interactively if possible

**When fixing bugs:**
1. Identify the affected component (Particle/ParticleSystem/Simulator)
2. Check boundary conditions (screen edges, particle counts)
3. Consider curses exception handling
4. Test edge cases (very small/large terminal)

### Documentation Updates

**When updating README.md:**
- Keep consistent with existing style
- Update version badges if needed
- Add to appropriate section
- Maintain markdown formatting

**When updating this file (CLAUDE.md):**
- Keep technical and comprehensive
- Use code references with line numbers
- Provide examples
- Update when architecture changes

## Known Limitations & Considerations

1. **Platform**: Requires Unix-like system or WSL (curses dependency)
2. **Terminal**: Needs Unicode and 256-color support
3. **Performance**: May lag on very slow systems or tiny terminals
4. **Windows**: Native Windows needs `windows-curses` package
5. **Screen Size**: UI requires minimum ~40x10 characters
6. **Edge Rendering**: Try-except blocks prevent crashes but some particles may not render

## Troubleshooting Guide

### If the simulator won't start:
- Check Python version: `python3 --version` (need 3.6+)
- Verify curses availability: `python3 -c "import curses"`
- Ensure terminal is large enough

### If colors don't work:
- Check terminal color support: `echo $TERM`
- Try different terminal emulator
- Verify curses color initialization (lines 241-244)

### If particles behave strangely:
- Check delta time calculations (lines 342-348)
- Verify mode-specific parameters in `set_mode()` (lines 200-224)
- Review gravity and damping values

### If performance is poor:
- Reduce particle emission rate (press `-` key)
- Check FPS counter in UI
- Consider smaller terminal window
- Review particle cleanup (line 181)

## Quick Reference

### Important Line Numbers

- **Entry point**: cosmic_simulator.py:370 (`main()`)
- **Game loop**: cosmic_simulator.py:338-364 (`run()`)
- **Particle update**: cosmic_simulator.py:40-48 (`Particle.update()`)
- **Mode switching**: cosmic_simulator.py:200-224 (`set_mode()`)
- **Rendering**: cosmic_simulator.py:289-326 (`render()`)
- **Input handling**: cosmic_simulator.py:259-287 (`handle_input()`)
- **Emission methods**: cosmic_simulator.py:84-174 (`_emit_*()`)

### Color Pairs Reference

```python
1  = Red          9  = Bright Red
2  = Green       10  = Bright Green
3  = Yellow      11  = Bright Yellow
4  = Blue        12  = Bright Blue
5  = Magenta     13  = Bright Magenta
6  = Cyan        14  = Bright Cyan
7  = White       15  = Bright White
8  = Gray
```

### Typical Particle Lifetimes

- Cosmic: 3-8 seconds
- Matrix: 2-5 seconds
- Fire: 1.5-3 seconds
- Ocean: 2-4 seconds
- Galaxy: 4-8 seconds
- Aurora: 3-6 seconds

## Best Practices for AI Assistants

1. **Always read before modifying** - Use Read tool on files before suggesting changes
2. **Test comprehensively** - Consider all six modes when making changes
3. **Preserve existing patterns** - Match the established code style
4. **Document changes** - Update relevant comments and docstrings
5. **Consider performance** - Be mindful of particle counts and rendering load
6. **Handle errors gracefully** - Use try-except for curses operations
7. **Maintain backwards compatibility** - Don't break existing controls/features
8. **Update documentation** - Keep README.md and this file in sync with code

## Additional Resources

- **Python curses documentation**: https://docs.python.org/3/library/curses.html
- **Project README**: /home/user/1/README.md
- **License**: MIT License at /home/user/1/LICENSE

---

*Last Updated: 2025-11-29*
*Repository: /home/user/1*
*For AI assistants working with Cosmic Simulator codebase*
