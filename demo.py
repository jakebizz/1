#!/usr/bin/env python3
"""
Cosmic Simulator - Demo Mode
A preview of what the simulator looks like (without curses)
"""

import time
import random
import math
import os

def clear_screen():
    """Clear the terminal"""
    os.system('clear' if os.name != 'nt' else 'cls')

def cosmic_demo():
    """Show a simple demo of cosmic mode"""
    width, height = 80, 24

    print("\n" + "="*80)
    print(" COSMIC SIMULATOR - DEMO MODE ".center(80))
    print("="*80 + "\n")

    print("This is a preview of what you'll see when running the full simulator!\n")

    # Cosmic mode demo
    print("MODE: COSMIC - Stars and Nebula".center(80))
    print("-"*80)

    particles = []
    chars = ['*', '·', '∙', '○', '●', '✦', '✧', '✨']

    for frame in range(5):
        # Create screen buffer
        screen = [[' ' for _ in range(width)] for _ in range(height)]

        # Add some particles
        for _ in range(20):
            x = random.randint(0, width-1)
            y = random.randint(0, height-1)
            char = random.choice(chars)
            screen[y][x] = char

        # Print screen
        if frame > 0:
            print("\033[F" * height, end='')  # Move cursor up

        for row in screen:
            print(''.join(row))

        time.sleep(0.3)

    print("\n" + "-"*80)
    print("\n✨ In the REAL simulator, you'll see:\n")
    print("  • Particles moving smoothly in real-time")
    print("  • Beautiful colors (cosmic purple, cyan, pink)")
    print("  • 60 FPS smooth animations")
    print("  • Particles with physics (velocity, gravity, life)")
    print("  • 6 different modes you can switch between instantly")
    print("\n" + "="*80)

    print("\n🎮 CONTROLS:")
    print("  [1-6]  Switch visual modes")
    print("  SPACE  Pause/Resume")
    print("  C      Clear particles")
    print("  +/-    Adjust emission rate")
    print("  Q      Quit")

    print("\n🚀 TO RUN THE FULL EXPERIENCE:")
    print("  python3 cosmic_simulator.py")

    print("\n" + "="*80)

    print("\n📋 AVAILABLE MODES:\n")
    modes = [
        ("1. COSMIC", "Twinkling stars and nebula clouds drifting through space"),
        ("2. MATRIX", "Iconic falling digital rain with Japanese characters"),
        ("3. FIRE", "Realistic flames rising with natural turbulence"),
        ("4. OCEAN", "Gentle waves flowing across your screen"),
        ("5. GALAXY", "Spiral galaxy with orbiting stellar particles"),
        ("6. AURORA", "Mesmerizing aurora borealis light show")
    ]

    for mode, desc in modes:
        print(f"  {mode:15} - {desc}")

    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    try:
        cosmic_demo()
    except KeyboardInterrupt:
        print("\n\nDemo interrupted!")
    except Exception as e:
        print(f"\nError: {e}")
