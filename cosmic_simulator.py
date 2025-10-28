#!/usr/bin/env python3
"""
Cosmic Simulator - An Interactive Terminal Particle System
A beautiful, physics-based visualization with multiple modes and effects
"""

import os
import sys
import time
import math
import random
import curses
from dataclasses import dataclass
from typing import List, Tuple
from enum import Enum


class VisualMode(Enum):
    """Different visual modes for the simulator"""
    COSMIC = "cosmic"
    MATRIX = "matrix"
    FIRE = "fire"
    OCEAN = "ocean"
    GALAXY = "galaxy"
    AURORA = "aurora"


@dataclass
class Particle:
    """Represents a single particle in the simulation"""
    x: float
    y: float
    vx: float
    vy: float
    life: float
    max_life: float
    char: str
    color: int

    def update(self, dt: float, gravity: Tuple[float, float], damping: float):
        """Update particle position and velocity"""
        self.vx += gravity[0] * dt
        self.vy += gravity[1] * dt
        self.vx *= damping
        self.vy *= damping
        self.x += self.vx * dt
        self.y += self.vy * dt
        self.life -= dt

    def is_alive(self) -> bool:
        """Check if particle is still alive"""
        return self.life > 0


class ParticleSystem:
    """Manages the particle simulation"""

    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height
        self.particles: List[Particle] = []
        self.mode = VisualMode.COSMIC
        self.gravity = (0, 0)
        self.damping = 0.98
        self.emit_rate = 5
        self.time = 0

    def emit_particles(self, count: int):
        """Emit new particles based on current mode"""
        for _ in range(count):
            if self.mode == VisualMode.COSMIC:
                self._emit_cosmic()
            elif self.mode == VisualMode.MATRIX:
                self._emit_matrix()
            elif self.mode == VisualMode.FIRE:
                self._emit_fire()
            elif self.mode == VisualMode.OCEAN:
                self._emit_ocean()
            elif self.mode == VisualMode.GALAXY:
                self._emit_galaxy()
            elif self.mode == VisualMode.AURORA:
                self._emit_aurora()

    def _emit_cosmic(self):
        """Emit a cosmic particle (stars and nebula)"""
        chars = ['*', '·', '∙', '○', '●', '✦', '✧', '✨']
        x = random.uniform(0, self.width)
        y = random.uniform(0, self.height)
        angle = random.uniform(0, 2 * math.pi)
        speed = random.uniform(1, 5)
        vx = math.cos(angle) * speed
        vy = math.sin(angle) * speed
        life = random.uniform(3, 8)
        char = random.choice(chars)
        color = random.choice([5, 6, 13, 14])  # Magenta, cyan, pink, light cyan

        self.particles.append(Particle(x, y, vx, vy, life, life, char, color))

    def _emit_matrix(self):
        """Emit Matrix-style falling characters"""
        chars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', '日', '月', '火']
        x = random.uniform(0, self.width)
        y = 0
        vx = 0
        vy = random.uniform(10, 25)
        life = random.uniform(2, 5)
        char = random.choice(chars)
        color = 2  # Green

        self.particles.append(Particle(x, y, vx, vy, life, life, char, color))

    def _emit_fire(self):
        """Emit fire particles rising upward"""
        chars = ['▲', '▴', '∴', ':', '.', '·', '˙']
        x = random.uniform(self.width * 0.3, self.width * 0.7)
        y = self.height - 1
        vx = random.uniform(-3, 3)
        vy = random.uniform(-15, -25)
        life = random.uniform(1.5, 3)
        char = random.choice(chars)
        # Fire colors: red to yellow
        color = random.choice([1, 3, 9, 11])  # Red, yellow, bright red, bright yellow

        self.particles.append(Particle(x, y, vx, vy, life, life, char, color))

    def _emit_ocean(self):
        """Emit ocean wave particles"""
        chars = ['~', '≈', '∽', '∿', '〰', '・']
        x = random.uniform(0, self.width)
        y = self.height / 2 + math.sin(self.time * 2 + x * 0.1) * 5
        vx = random.uniform(-2, 2)
        vy = random.uniform(-1, 1)
        life = random.uniform(2, 4)
        char = random.choice(chars)
        color = random.choice([4, 6, 12, 14])  # Blue and cyan shades

        self.particles.append(Particle(x, y, vx, vy, life, life, char, color))

    def _emit_galaxy(self):
        """Emit particles in a spiral galaxy pattern"""
        chars = ['*', '·', '∙', '○', '●', '+', '×']
        # Spiral arms
        angle = self.time * 0.5 + random.uniform(0, 2 * math.pi)
        radius = random.uniform(5, min(self.width, self.height) * 0.4)
        spiral = angle * 0.5

        x = self.width / 2 + radius * math.cos(angle + spiral)
        y = self.height / 2 + radius * math.sin(angle + spiral)

        # Orbital velocity
        vx = -math.sin(angle + spiral) * radius * 0.1
        vy = math.cos(angle + spiral) * radius * 0.1

        life = random.uniform(4, 8)
        char = random.choice(chars)
        color = random.choice([5, 6, 7, 13, 14, 15])

        self.particles.append(Particle(x, y, vx, vy, life, life, char, color))

    def _emit_aurora(self):
        """Emit aurora borealis particles"""
        chars = ['░', '▒', '▓', '█', '▄', '▀', ':', '·']
        x = random.uniform(0, self.width)
        y = random.uniform(0, self.height * 0.5)

        # Wavy horizontal motion
        vx = random.uniform(-5, 5) + math.sin(self.time + y * 0.1) * 3
        vy = random.uniform(-1, 2)

        life = random.uniform(3, 6)
        char = random.choice(chars)
        color = random.choice([2, 3, 5, 6, 10, 13])  # Green, yellow, magenta, cyan

        self.particles.append(Particle(x, y, vx, vy, life, life, char, color))

    def update(self, dt: float):
        """Update all particles"""
        self.time += dt

        # Update existing particles
        self.particles = [p for p in self.particles if p.is_alive()]

        for particle in self.particles:
            particle.update(dt, self.gravity, self.damping)

            # Wrap around screen edges for cosmic and ocean modes
            if self.mode in [VisualMode.COSMIC, VisualMode.OCEAN]:
                if particle.x < 0:
                    particle.x += self.width
                elif particle.x >= self.width:
                    particle.x -= self.width
                if particle.y < 0:
                    particle.y += self.height
                elif particle.y >= self.height:
                    particle.y -= self.height

        # Emit new particles
        self.emit_particles(self.emit_rate)

    def set_mode(self, mode: VisualMode):
        """Change the visual mode"""
        self.mode = mode

        # Adjust parameters based on mode
        if mode == VisualMode.FIRE:
            self.gravity = (0, -5)
            self.damping = 0.95
            self.emit_rate = 8
        elif mode == VisualMode.OCEAN:
            self.gravity = (0, 1)
            self.damping = 0.98
            self.emit_rate = 6
        elif mode == VisualMode.GALAXY:
            self.gravity = (0, 0)
            self.damping = 0.99
            self.emit_rate = 4
        elif mode == VisualMode.AURORA:
            self.gravity = (0, 0.5)
            self.damping = 0.97
            self.emit_rate = 7
        else:
            self.gravity = (0, 0)
            self.damping = 0.98
            self.emit_rate = 5


class CosmicSimulator:
    """Main simulator application"""

    def __init__(self, stdscr):
        self.stdscr = stdscr
        self.running = True
        self.paused = False

        # Setup curses
        curses.curs_set(0)  # Hide cursor
        self.stdscr.nodelay(1)  # Non-blocking input
        self.stdscr.timeout(0)

        # Initialize colors
        curses.start_color()
        curses.use_default_colors()
        for i in range(1, 16):
            curses.init_pair(i, i, -1)

        # Get screen dimensions
        self.height, self.width = self.stdscr.getmaxyx()
        self.height -= 3  # Reserve space for UI

        # Initialize particle system
        self.particle_system = ParticleSystem(self.width, self.height)

        # Frame timing
        self.last_time = time.time()
        self.fps = 0
        self.frame_count = 0
        self.fps_time = time.time()

    def handle_input(self):
        """Handle user input"""
        try:
            key = self.stdscr.getch()

            if key == ord('q') or key == ord('Q'):
                self.running = False
            elif key == ord(' '):
                self.paused = not self.paused
            elif key == ord('1'):
                self.particle_system.set_mode(VisualMode.COSMIC)
            elif key == ord('2'):
                self.particle_system.set_mode(VisualMode.MATRIX)
            elif key == ord('3'):
                self.particle_system.set_mode(VisualMode.FIRE)
            elif key == ord('4'):
                self.particle_system.set_mode(VisualMode.OCEAN)
            elif key == ord('5'):
                self.particle_system.set_mode(VisualMode.GALAXY)
            elif key == ord('6'):
                self.particle_system.set_mode(VisualMode.AURORA)
            elif key == ord('c') or key == ord('C'):
                self.particle_system.particles.clear()
            elif key == ord('+') or key == ord('='):
                self.particle_system.emit_rate = min(20, self.particle_system.emit_rate + 1)
            elif key == ord('-') or key == ord('_'):
                self.particle_system.emit_rate = max(1, self.particle_system.emit_rate - 1)
        except:
            pass

    def render(self):
        """Render the current frame"""
        self.stdscr.clear()

        # Draw particles
        for particle in self.particle_system.particles:
            x = int(particle.x)
            y = int(particle.y)

            if 0 <= x < self.width and 0 <= y < self.height:
                try:
                    # Fade particles based on remaining life
                    alpha = particle.life / particle.max_life
                    if alpha > 0.3 or random.random() < alpha:
                        self.stdscr.addstr(y, x, particle.char,
                                         curses.color_pair(particle.color))
                except:
                    pass

        # Draw UI
        mode_name = self.particle_system.mode.value.upper()
        status = "PAUSED" if self.paused else "RUNNING"
        particle_count = len(self.particle_system.particles)

        ui_y = self.height + 1

        try:
            self.stdscr.addstr(ui_y, 0, "═" * self.width, curses.color_pair(7))

            info = f" Mode: {mode_name} | Status: {status} | Particles: {particle_count} | FPS: {self.fps:.0f} | Rate: {self.particle_system.emit_rate} "
            self.stdscr.addstr(ui_y + 1, 0, info, curses.color_pair(15) | curses.A_BOLD)

            controls = " [1-6] Modes | [SPACE] Pause | [C] Clear | [+/-] Rate | [Q] Quit "
            self.stdscr.addstr(ui_y + 2, 0, controls, curses.color_pair(8))
        except:
            pass

        self.stdscr.refresh()

    def update_fps(self):
        """Update FPS counter"""
        self.frame_count += 1
        current_time = time.time()

        if current_time - self.fps_time >= 1.0:
            self.fps = self.frame_count / (current_time - self.fps_time)
            self.frame_count = 0
            self.fps_time = current_time

    def run(self):
        """Main game loop"""
        try:
            while self.running:
                # Calculate delta time
                current_time = time.time()
                dt = current_time - self.last_time
                self.last_time = current_time

                # Cap dt to prevent huge jumps
                dt = min(dt, 0.1)

                # Handle input
                self.handle_input()

                # Update simulation
                if not self.paused:
                    self.particle_system.update(dt)

                # Render
                self.render()

                # Update FPS
                self.update_fps()

                # Sleep to maintain ~60 FPS
                time.sleep(0.016)

        except KeyboardInterrupt:
            pass


def main():
    """Entry point"""
    try:
        curses.wrapper(lambda stdscr: CosmicSimulator(stdscr).run())
    except Exception as e:
        print(f"Error: {e}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
